import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import FirestoreService from '../services/firestore.service';
import { User } from '../services/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: Array<User | undefined> = [];
  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  async ngOnInit() {
    const q = query(
      collection(this.firestoreService.firestore, 'users'),
      orderBy('displayName', 'asc')
    );
    const usersSnapshot = await getDocs(q);
    usersSnapshot.forEach((user) => {
      this.users.push(user.data());
    });
  }
  async SetBanState(user: User | undefined) {
    if (!user) return;
    const id = user.uid;
    if (!id) return;
    const userDoc = await this.firestoreService.GetDocument('users', id);
    if (!userDoc) return;
    userDoc['banned'] = !userDoc['banned'];
    await this.firestoreService.SetDocument('users', id, userDoc);
    location.reload();
  }
}
