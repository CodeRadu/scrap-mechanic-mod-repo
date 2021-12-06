import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import AuthService from '../services/auth.service';
import FirestoreService from '../services/firestore.service';
import StorageService from '../services/storage.service';

@Component({
  selector: 'app-mod',
  templateUrl: './mod.component.html',
  styleUrls: ['./mod.component.scss'],
})
export class ModComponent implements OnInit {
  public id: string = '';
  public mod: Mod | null | undefined = null;
  public owner = false;
  public image: string | undefined = '/assets/no-image.png';

  constructor(
    private route: ActivatedRoute,
    public firestoreService: FirestoreService,
    public authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params: Params) => {
      this.id = params['id'];
      this.mod = await this.firestoreService.GetDocument('mods', this.id);
      if (this.mod?.ownerId == this.authService.userData?.uid)
        this.owner = true;
      if (this.mod?.imageUrl) {
        this.image = this.mod.imageUrl;
      }
    });
  }

  async DownloadMod() {
    if (this.mod?.downloads == null) return;
    if (!this.mod.url) return;
    this.mod.downloads++;
    await this.firestoreService.SetDocument('mods', this.id, this.mod);
    window.location.href = this.mod.url;
  }
  EditMod() {
    this.router.navigate(['/mod', this.id, 'edit']);
  }
  DeleteMod() {
    this.firestoreService.DeleteDocument('mods', this.id);
    this.storageService.DeleteFile(this.id + '.zip');
    try {
      this.storageService.DeleteFile(this.id + '.jpg');
    } catch (err) {}
    this.router.navigate(['/']);
  }
  DownloadImg() {
    window.open(this.image as string);
  }
}

interface Mod {
  name?: string;
  description?: string;
  id?: string;
  ownerId?: string;
  url?: string;
  downloads?: number;
  imageUrl?: string;
}
