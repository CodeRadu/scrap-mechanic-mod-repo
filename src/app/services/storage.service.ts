import { Injectable } from '@angular/core';
import { Storage, ref } from '@angular/fire/storage';
import {
  getStorage,
  StorageReference,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import AuthService from './auth.service';

@Injectable({
  providedIn: 'root',
})
export default class StorageService {
  storage: Storage;
  reference: StorageReference | null = null;
  constructor(private authService: AuthService) {
    this.storage = getStorage();
  }
  async UploadFile(file: File, id: string) {
    if (!this.authService.userData?.uid) return;
    this.reference = ref(
      this.storage,
      `${this.authService.userData.uid}/${id}`
    );
    const snapshot = await uploadBytes(this.reference, file);
    return await getDownloadURL(snapshot.ref);
  }
  async DeleteFile(id: string) {
    if (!this.authService.userData?.uid) return;
    this.reference = ref(
      this.storage,
      `${this.authService.userData.uid}/${id}`
    );
    return await deleteObject(this.reference).catch((e) => {});
  }
}
