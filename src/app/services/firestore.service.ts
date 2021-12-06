import { Injectable } from '@angular/core';
import {
  Firestore,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export default class FirestoreService {
  constructor(public firestore: Firestore) {}
  async GetDocument(collection: string, document: string) {
    const docSnap = await getDoc(doc(this.firestore, collection, document));
    return docSnap.data();
  }
  SetDocument(collection: string, document: string, data: Object) {
    return setDoc(doc(this.firestore, collection, document), data, {
      merge: true,
    });
  }
  DeleteDocument(collection: string, document: string) {
    return deleteDoc(doc(this.firestore, collection, document));
  }
}
