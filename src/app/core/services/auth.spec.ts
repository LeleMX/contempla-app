import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let firestoreSpy: any;
  let routerSpy: any;

  beforeEach(() => {
    firestoreSpy = {
        collection: () => {},
        doc: () => {},
        getDocs: () => {},
        updateDoc: () => {},
        query: () => {},
        where: () => {}
    };
    routerSpy = {
        navigate: () => {}
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Firestore, useValue: firestoreSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
