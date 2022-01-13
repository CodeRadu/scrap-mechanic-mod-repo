import { Injectable, NgZone } from '@angular/core';
import { User } from './user';
import 'firebase/auth';
import { GoogleAuthProvider, signOut } from 'firebase/auth';
import { signInWithPopup, Auth, AuthProvider } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export default class AuthService {
  userData: User | null | undefined = null;
  constructor(
    public router: Router,
    public ngZone: NgZone,
    public afAuth: Auth,
    public afs: Firestore
  ) {
    this.afAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const foundUser = await getDoc(doc(this.afs, 'users', user.uid));
        if (!foundUser) location.reload();
        else {
          localStorage.setItem('user', JSON.stringify(foundUser.data()));
          this.userData = foundUser.data();
        }
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
      banned: false,
      admin: false,
    };
    if (user.uid) {
      const foundUserData = await getDoc(doc(this.afs, 'users', user.uid));
      if (!foundUserData.data()) {
        this.userData = userData;
        return await setDoc(doc(this.afs, 'users', user.uid), userData);
      } else this.userData = foundUserData.data();
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
