import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

export interface User {
  id: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  
  private timeoutId: any;
  private readonly TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos de inactividad

  constructor() {
    this.checkSession();
    this.setupIdleTimeout();
  }

  private setupIdleTimeout() {
    window.addEventListener('mousemove', () => this.resetTimeout());
    window.addEventListener('keydown', () => this.resetTimeout());
    window.addEventListener('scroll', () => this.resetTimeout());
    window.addEventListener('click', () => this.resetTimeout());
  }

  private resetTimeout() {
    if (!this.isAuthenticated) return;
    
    localStorage.setItem('contempla_last_activity', Date.now().toString());

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      this.logout(true); // logout por inactividad
    }, this.TIMEOUT_MS);
  }

  private checkSession() {
    const storedUser = localStorage.getItem('contempla_user');
    const lastActivity = localStorage.getItem('contempla_last_activity');
    
    if (storedUser) {
      if (lastActivity) {
        const timePassed = Date.now() - parseInt(lastActivity, 10);
        if (timePassed > this.TIMEOUT_MS) {
          // Expirado por tiempo fuera
          localStorage.removeItem('contempla_user');
          localStorage.removeItem('contempla_last_activity');
          return;
        }
      }
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.resetTimeout();
    }
  }

  public get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  async login(username: string, password: string):Promise<{success: boolean, message?: string}> {
    try {
      // Input sanitization to prevent basic injection
      const sanitizedUsername = username.replace(/[^\w\s@.-]/gi, '');
      
      // Hash password using SHA-256
      const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

      const usersRef = collection(this.firestore, 'users');
      // Look for sanitized username and hashed password
      const q = query(usersRef, where('username', '==', sanitizedUsername), where('password', '==', hashedPassword));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        const user: User = {
          id: userDoc.id,
          username: userData['username'],
          role: userData['role']
        };

        localStorage.setItem('contempla_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.resetTimeout();
        return {success: true};
      } else {
        // Fallback 1: Fix for hallucinated incorrect hash pasted manually by the user
        const hallucinatedHash = '128ce89aefbbb14c1cd8f8bb142994ef0041af3fae208b02daee2ab45422abcb';
        const badHashQ = query(usersRef, where('username', '==', sanitizedUsername), where('password', '==', hallucinatedHash));
        const badHashSnapshot = await getDocs(badHashQ);
        
        if (!badHashSnapshot.empty && password === 'insulina') {
            const userDoc = badHashSnapshot.docs[0];
            const userRef = doc(this.firestore, `users/${userDoc.id}`);
            await updateDoc(userRef, { password: hashedPassword }); // Migrate to genuine SHA-256 hash
            
            const userData = userDoc.data();
            const user: User = {
              id: userDoc.id,
              username: userData['username'],
              role: userData['role']
            };

            localStorage.setItem('contempla_user', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.resetTimeout();
            return {success: true};
        }

        // Fallback 2: One-time migration for existing plaintext passwords in the database
        const fallbackQ = query(usersRef, where('username', '==', sanitizedUsername), where('password', '==', password));
        const fallbackSnapshot = await getDocs(fallbackQ);
        
        if (!fallbackSnapshot.empty) {
            const userDoc = fallbackSnapshot.docs[0];
            // Update Firestore with the new hashed password
            const userRef = doc(this.firestore, `users/${userDoc.id}`);
            await updateDoc(userRef, { password: hashedPassword });
            
            const userData = userDoc.data();
            const user: User = {
              id: userDoc.id,
              username: userData['username'],
              role: userData['role']
            };

            localStorage.setItem('contempla_user', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.resetTimeout();
            return {success: true};
        } else {
            return {success: false, message: `Usuario o contraseña no encontrados en la base de datos para: ${sanitizedUsername}`};
        }
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      return {success: false, message: `Error interno de conexión a Firestore: ${error.message}`};
    }
  }

  logout(expired: boolean = false) {
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
    }
    localStorage.removeItem('contempla_user');
    localStorage.removeItem('contempla_last_activity');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    
    if (expired) {
        alert("Su sesión ha expirado tras 5 minutos de inactividad.");
    }
  }
}
