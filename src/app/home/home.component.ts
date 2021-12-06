import { Component, OnInit } from '@angular/core';
import { query, orderBy, limit, collection, getDocs } from 'firebase/firestore';
import FirestoreService from '../services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  mods: Array<Mod | undefined> = [];
  constructor(private firestoreService: FirestoreService) {}

  async ngOnInit() {
    const q = query(
      collection(this.firestoreService.firestore, 'mods'),
      orderBy('downloads', 'desc'),
      limit(10)
    );
    const modsSnapshot = await getDocs(q);
    modsSnapshot.forEach((mod) => {
      this.mods.push(mod.data());
    });
  }
}

interface Mod {
  name?: string;
  description?: string;
  id?: string;
  ownerId?: string;
  url?: string;
  downloads?: number;
}
