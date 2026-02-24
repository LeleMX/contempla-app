import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Client {
  id?: string;
  name?: string;
  email: string;
  visits: number;
  lastVisitAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private firestore = inject(Firestore);

  // Obtener todos los clientes (Usa onSnapshot nativo de Firebase)
  getClients(): Observable<Client[]> {
    return new Observable<Client[]>((observer) => {
      const clientsRef = collection(this.firestore, 'clients');
      const unsubscribe = onSnapshot(clientsRef, 
        (snapshot) => {
          const clients = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() } as Client;
          });
          // Sort by visits descending automatically
          observer.next(clients.sort((a,b) => b.visits - a.visits));
        },
        (error) => observer.error(error)
      );
      return { unsubscribe }; // Cleanup function when observable is destroyed
    });
  }

  // Registrar visita a través del correo y guardar el nombre
  // Registrar visita a través del correo
  async registerVisit(email: string): Promise<number> {
    const normalizedEmail = email.trim().toLowerCase();
    
    if (!normalizedEmail) throw new Error('El correo es requerido');

    // Usaremos el correo como ID del documento para evitar duplicados
    const clientRef = doc(this.firestore, `clients/${normalizedEmail}`);
    const clientSnapshot = await getDoc(clientRef);

    if (clientSnapshot.exists()) {
      const data = clientSnapshot.data();
      const currentVisits = data['visits'] || 0;
      
      // Manejar el formato antiguo numérico y el nuevo serverTimestamp de Firebase
      let lastVisitDate = new Date(0);
      if (data['lastVisitAt']) {
        lastVisitDate = data['lastVisitAt']?.toDate ? data['lastVisitAt'].toDate() : new Date(data['lastVisitAt']);
      }
      
      const nowDate = new Date();

      // Check if the current visit is on the same calendar day
      const isSameDay = lastVisitDate.getFullYear() === nowDate.getFullYear() &&
                        lastVisitDate.getMonth() === nowDate.getMonth() &&
                        lastVisitDate.getDate() === nowDate.getDate();

      if (isSameDay) {
        throw new Error(`Ya has registrado tu visita de hoy. ¡Vuelve mañana y sigue sumando!`);
      }

      const newVisits = currentVisits + 1;
      await updateDoc(clientRef, {
        visits: newVisits,
        lastVisitAt: serverTimestamp()
      });
      return newVisits;
    } else {
      await setDoc(clientRef, {
        email: normalizedEmail,
        visits: 1,
        lastVisitAt: serverTimestamp()
      });
      return 1;
    }
  }
}
