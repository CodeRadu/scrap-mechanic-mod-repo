import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import AuthService from '../services/auth.service';
import StorageService from '../services/storage.service';
import FirestoreService from '../services/firestore.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  private name = '';
  private description = '';
  private file: File | null = null;
  public uploading = false;
  public error = '';
  private image: File | null = null;
  private imageUrl: string | undefined = '';
  constructor(
    public authService: AuthService,
    public router: Router,
    public storageService: StorageService,
    public firestoreService: FirestoreService
  ) {}

  ngOnInit(): void {}
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
  async CreateMod(event: Event) {
    event.preventDefault();
    if (!this.file) {
      this.error = 'No file selected';
      return;
    }
    const extension = this.file.name.split('.').pop();
    if (extension != 'zip') {
      this.error = 'File is not ZIP';
      return;
    }
    if (this.image) {
      const extension = this.image.name.split('.').pop();
      if (!extension?.match(/(jpg|jpeg|png|gif|bmp)/)) {
        this.error = 'Image format is not JPG, JPEG, PNG, GIF, BMP';
        return;
      }
    }
    this.uploading = true;
    this.error = '';
    const id = uuidv4();
    const url = await this.storageService.UploadFile(this.file, id + '.zip');
    if (this.image)
      this.imageUrl = await this.storageService.UploadFile(
        this.image,
        id + '.jpg'
      );
    this.firestoreService.SetDocument('mods', id, {
      id: id,
      name: this.name,
      description: this.description,
      url: url,
      ownerId: this.authService.userData?.uid,
      downloads: 0,
      imageUrl: this.imageUrl,
    });
    this.router.navigate([`/mod`, id]);
  }
}
