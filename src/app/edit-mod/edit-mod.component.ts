import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import AuthService from '../services/auth.service';
import FirestoreService from '../services/firestore.service';
import StorageService from '../services/storage.service';

@Component({
  selector: 'app-edit-mod',
  templateUrl: './edit-mod.component.html',
  styleUrls: ['./edit-mod.component.scss'],
})
export class EditModComponent implements OnInit {
  public id: string = '';
  public mod: Mod | null | undefined = null;
  public owner = false;
  public name: string | undefined = '';
  public description: string | undefined = '';
  public file: File | null = null;
  public uploading = false;
  public error = '';
  private image: File | null = null;
  private fileUrl: string | undefined = '';
  private imageUrl: string | undefined = '';

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
      if (
        this.mod?.ownerId == this.authService.userData?.uid ||
        this.authService.userData?.admin
      )
        this.owner = true;
      else {
        this.router.navigate(['mod', this.id]);
        return;
      }
      this.name = this.mod?.name;
      this.description = this.mod?.description;
      this.fileUrl = this.mod?.url;
      this.imageUrl = this.mod?.imageUrl;
    });
  }
  SetName(value: string) {
    this.name = value;
  }
  SetDescription(value: string) {
    this.description = value;
  }
  SetFile(value: FileList | null) {
    if (!value) return;
    this.file = value[0];
  }
  SetImage(value: FileList | null) {
    if (!value) return;
    this.image = value[0];
  }
  async EditMod(event: Event) {
    event.preventDefault();
    if (!this.file && !this.image) {
      this.firestoreService.SetDocument('mods', this.id, {
        name: this.name,
        description: this.description,
      });
    } else {
      let url;
      url = this.fileUrl;
      let imageUrl;
      imageUrl = this.imageUrl;
      let extension = this.file?.name.split('.').pop();
      if (extension != 'zip' && this.file) {
        this.error = 'File is not ZIP';
        return;
      }
      extension = this.image?.name.split('.').pop();
      if (!extension?.match(/(jpg|jpeg|png|gif|bmp)/) && this.image) {
        this.error = 'Image format is not JPG, JPEG, PNG, GIF, BMP';
        return;
      }
      if (this.file) {
        this.uploading = true;
        await this.storageService.DeleteFile(this.id + '.zip');
        url = await this.storageService.UploadFile(this.file, this.id + '.zip');
      }
      if (this.image) {
        this.uploading = true;
        await this.storageService.DeleteFile(this.id + '.jpg');
        imageUrl = await this.storageService.UploadFile(
          this.image,
          this.id + '.jpg'
        );
      }
      this.firestoreService.SetDocument('mods', this.id, {
        name: this.name,
        description: this.description,
        url: url,
        imageUrl: imageUrl,
      });
    }
    this.router.navigate([`/mod`, this.id]);
  }
  GoBack() {
    this.router.navigate([`/mod`, this.id]);
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
