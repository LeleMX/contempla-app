import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

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

  async login(username: string, password: string):Promise<boolean> {
    try {
      const usersRef = collection(this.firestore, 'users');
      // In a real scenario, passwords must NOT be queried straightforward like this or stored as plain text,
      // but for this specific local prototype where we seeded "insulina" we will match it.
      const q = query(usersRef, where('username', '==', username), where('password', '==', password));
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
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
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
