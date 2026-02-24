import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = inject(Storage);

  async uploadFile(file: File, folder: string): Promise<string> {
    const timestamp = new Date().getTime();
    const storageRef = ref(this.storage, `${folder}/${timestamp}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }
}
