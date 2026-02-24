import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';

export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private firestore = inject(Firestore);
  private storageService = inject(StorageService);

  getMenuItems(): Observable<MenuItem[]> {
    return new Observable<MenuItem[]>((observer) => {
      const menuRef = collection(this.firestore, 'menu_items');
      
      const unsubscribe = onSnapshot(menuRef, 
        (snapshot) => {
          const items = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() } as MenuItem;
          });
          
          // Ordenar en memoria por categoría y luego por nombre
          items.sort((a, b) => {
            if (a.category === b.category) {
              return a.name.localeCompare(b.name);
            }
            return a.category.localeCompare(b.category);
          });
          
          observer.next(items);
        },
        (error) => observer.error(error)
      );
      return { unsubscribe };
    });
  }

  async uploadImage(file: File): Promise<string> {
    return this.storageService.uploadFile(file, 'menu-images');
  }

  addMenuItem(item: MenuItem): Promise<any> {
    const menuRef = collection(this.firestore, 'menu_items');
    return addDoc(menuRef, item);
  }

  updateMenuItem(id: string, item: Partial<MenuItem>): Promise<void> {
    const docRef = doc(this.firestore, 'menu_items', id);
    return updateDoc(docRef, item);
  }

  deleteMenuItem(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'menu_items', id);
    return deleteDoc(docRef);
  }
}
