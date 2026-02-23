import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

const firebaseConfig = {
  apiKey: "AIzaSyDe6p2LXGtA3GewuO5dVTY0TMRgbyy5yqM",
  authDomain: "contempla-app.firebaseapp.com",
  projectId: "contempla-app",
  storageBucket: "contempla-app.firebasestorage.app",
  messagingSenderId: "444753192597",
  appId: "1:444753192597:web:9158739bdaea195bf79d9c",
  measurementId: "G-NFXKHBWR6T"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideCharts(withDefaultRegisterables()),
  ]
};
