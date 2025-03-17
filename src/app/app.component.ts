import { Component, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuComponent } from './features/pages/menu/menu.component';
import localePT from '@angular/common/locales/pt';

registerLocaleData(localePT);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{provide: LOCALE_ID, useValue: 'pt-br'}]
})
export class AppComponent {
  title = "Rango's WEEK";
}
