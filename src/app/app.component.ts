import { Component, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import localePT from '@angular/common/locales/pt';

registerLocaleData(localePT);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SharedModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{provide: LOCALE_ID, useValue: 'pt-br'}]
})
export class AppComponent {
  title = "Rango's WEEK";
}
