import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, onSnapshot } from '@angular/fire/firestore';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';

export interface LandingSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroBgUrl: string;
  heroTitleColor: string;
  heroTitleSize: string;
  heroSubtitleColor: string;
  heroSubtitleSize: string;
  
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutBgUrl: string;
  aboutImage1: string;
  aboutTitleColor: string;
  aboutTitleSize: string;
  aboutTextColor: string;

  menuBgUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private firestore = inject(Firestore);
  private storageService = inject(StorageService);

  // Default values for fallback if no settings exist in the DB
  private defaultSettings: LandingSettings = {
    heroTitle: 'Contempla',
    heroSubtitle: 'El Arte del Café',
    heroBgUrl: 'https://images.pexels.com/photos/1015568/pexels-photo-1015568.jpeg?auto=compress&cs=tinysrgb&w=1920',
    heroTitleColor: '#ffffff',
    heroTitleSize: 'text-9xl',
    heroSubtitleColor: '#e5e7eb', // gray-200
    heroSubtitleSize: 'text-2xl',
    
    aboutTitle: 'Nuestra Esencia',
    aboutText1: 'En Contempla creemos que cada taza de café es una pausa merecida. Seleccionamos rigurosamente granos de altura, tostados a la perfección para que en cada sorbo descubras notas inigualables.',
    aboutText2: 'Un espacio diseñado para ti, donde el aroma a café recién filtrado se mezcla con la tranquilidad, permitiéndote contemplar el momento presente.',
    aboutBgUrl: 'https://images.pexels.com/photos/410974/pexels-photo-410974.jpeg?auto=compress&cs=tinysrgb&w=1920',
    aboutImage1: 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=800',
    aboutTitleColor: '#95715a', // primary color aprox
    aboutTitleSize: 'text-5xl',
    aboutTextColor: '#e5e7eb',
    
    menuBgUrl: 'https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg?auto=compress&cs=tinysrgb&w=1920'
  };

  getLandingSettings(): Observable<LandingSettings> {
    return new Observable<LandingSettings>((observer) => {
      const docRef = doc(this.firestore, 'settings/landing');
      
      const unsubscribe = onSnapshot(docRef, 
        (snapshot) => {
          if (snapshot.exists()) {
            // Merge defaults with existing db properties to avoid blanks if there are missing db fields
            observer.next({ ...this.defaultSettings, ...snapshot.data() } as LandingSettings);
          } else {
            // If the document doesn't exist yet, return defaults
            observer.next(this.defaultSettings);
          }
        },
        (error) => observer.error(error)
      );
      return { unsubscribe };
    });
  }

  async updateLandingSettings(settings: Partial<LandingSettings>): Promise<void> {
    const docRef = doc(this.firestore, 'settings/landing');
    // We use setDoc with merge: true to avoid overwriting unrelated fields and to create if it doesn't exist
    await setDoc(docRef, settings, { merge: true });
  }

  /**
   * Helper to upload image specifically for landing pieces
   */
  async uploadImage(file: File): Promise<string> {
    return this.storageService.uploadFile(file, 'landing-images');
  }
}
