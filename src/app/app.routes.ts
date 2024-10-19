import { Routes } from '@angular/router';
import { HomeComponent } from './features/pages/home/home.component';
import { ArmazenamentoComponent } from './features/pages/armazenamento/armazenamento.component';
import { LoginComponent } from './features/pages/login/login.component';
import { RegisterComponent } from './features/pages/register/register.component';
import { ProfileComponent } from './features/pages/profile/profile.component';
import { AboutUsComponent } from './features/pages/about-us/about-us.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: RegisterComponent },
    { path: 'perfil', component: ProfileComponent },
    { path: 'armazenamento', component: ArmazenamentoComponent},
    { path: 'sobre-nos', component: AboutUsComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' }
   
];