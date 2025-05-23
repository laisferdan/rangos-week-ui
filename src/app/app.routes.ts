import { Routes } from '@angular/router';
import { HomeComponent } from './features/pages/home/home.component';
import { LoginComponent } from './features/pages/login/login.component';
import { SignupComponent } from './features/pages/signup/signup.component';
import { StorageComponent } from './features/pages/storage/storage.component';
import { AboutUsComponent } from './features/pages/about-us/about-us.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/pages/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'dicas', component: StorageComponent, canActivate: [AuthGuard] },
  { path: 'sobre-nos', component: AboutUsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];