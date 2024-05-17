import { Routes } from '@angular/router';
import { HomeComponent } from './features/pages/home/home.component';
import { ArmazenamentoComponent } from './features/pages/armazenamento/armazenamento.component';
import { SobreNosComponent } from './features/pages/sobre-nos/sobre-nos.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'armazenamento', component: ArmazenamentoComponent},
    { path: 'sobre-nos', component: SobreNosComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' }
   
];