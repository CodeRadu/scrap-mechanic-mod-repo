import { Injectable, NgZone } from '@angular/core';
import { User } from './user';
import 'firebase/auth';
import { GoogleAuthProvider, signOut } from 'firebase/auth';
import { signInWithPopup, Auth, AuthProvider } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export default class AuthService {
  userData: User | null = null;
  constructor(
    public router: Router,
    public ngZone: NgZone,
    public afAuth: Auth,
    public afs: Firestore
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user') as string);
      } else {
        localStorage.removeItem('user');
        JSON.parse(localStorage.getItem('user') as string);
      }
    });
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
    }
  }
  AuthLogin(provider: AuthProvider) {
    return signInWithPopup(this.afAuth, provider).then((result) => {
      this.ngZone.run(() => {
        this.router.navigate(['dashboard']);
      });
      this.SetUserData(result.user);
    });
  }
  async SetUserData(user: User) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    if (user.uid) {
      this.userData = userData;
      return await setDoc(doc(this.afs, 'users', user.uid), userData);
    }
    throw new Error('User not found');
  }
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }
  async SignOut() {
    this.userData = null;
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/']);
      localStorage.removeItem('user');
    });
  }
}
