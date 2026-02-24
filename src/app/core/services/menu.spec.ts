import { TestBed } from '@angular/core/testing';
import { MenuService } from './menu';
import { Firestore } from '@angular/fire/firestore';
import { StorageService } from './storage.service';

describe('MenuService', () => {
  let service: MenuService;
  let firestoreSpy: any;
  let storageServiceSpy: any;

  beforeEach(() => {
    firestoreSpy = {
        collection: () => {},
        doc: () => {},
        addDoc: () => {},
        updateDoc: () => {},
        deleteDoc: () => {},
        onSnapshot: () => {}
    };
    storageServiceSpy = {
        uploadFile: () => Promise.resolve('url')
    };

    TestBed.configureTestingModule({
      providers: [
        MenuService,
        { provide: Firestore, useValue: firestoreSpy },
        { provide: StorageService, useValue: storageServiceSpy }
      ]
    });
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
