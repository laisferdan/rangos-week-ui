import { Routes } from '@angular/router';
import { HomeComponent } from './features/pages/home/home.component';
import { ArmazenamentoComponent } from './features/pages/armazenamento/armazenamento.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'armazenamento', component: ArmazenamentoComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' }
   
];