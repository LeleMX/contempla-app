import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from '@angular/fire/firestore';
import { AuthService } from './auth';
import { Observable } from 'rxjs';

export interface AuditLog {
  id?: string;
  userId: string;
  username: string;
  action: string;
  entity: 'Landing' | 'Menu';
  elementId?: string;
  oldValue?: string;
  newValue?: string;
  timestamp?: any;
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  async logAction(action: string, entity: 'Landing' | 'Menu', newValue?: any, oldValue?: any, elementId?: string) {
    const user = this.authService.currentUserValue;
    if (!user) return; // Prevent logging if no user is authenticated
    
    // Helper to safely stringify and crop massive strings (like base64 images inside objects if they exist)
    const safeStringify = (obj: any) => obj ? JSON.stringify(obj, null, 2) : null;
    
    // We create a cleaned-up log to not exceed Firestore document size limits easily
    const logEntry = {
      userId: user.id || 'unknown',
      username: user.username || 'Admin',
      action,
      entity,
      elementId: elementId || null,
      oldValue: safeStringify(oldValue),
      newValue: safeStringify(newValue),
      timestamp: serverTimestamp()
    };

    try {
      const logsRef = collection(this.firestore, 'audit_logs');
      await addDoc(logsRef, logEntry);
    } catch (e) {
      console.error('Error saving audit log', e);
    }
  }

  getLogs(): Observable<AuditLog[]> {
    return new Observable<AuditLog[]>((observer) => {
      const logsRef = collection(this.firestore, 'audit_logs');
      // Sort by timestamp descending
      const q = query(logsRef, orderBy('timestamp', 'desc'));
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const logs = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() } as AuditLog;
          });
          observer.next(logs);
        },
        (error) => console.error(error)
      );
      return { unsubscribe };
    });
  }
}
