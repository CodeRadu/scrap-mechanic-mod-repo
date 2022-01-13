import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import AuthGuardService from './services/authGuard.service';
import { ModComponent } from './mod/mod.component';
import { HomeComponent } from './home/home.component';
import { EditModComponent } from './edit-mod/edit-mod.component';
import { UsersComponent } from './users/users.component';
import AdminGuardService from './services/adminGuard.service';
const routes: Routes = [
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'mod/:id',
    component: ModComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'mod/:id/edit',
    component: EditModComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService],
})
export class AppRoutingModule {}
