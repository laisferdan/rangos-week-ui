import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { CardapioService } from './shared/services/cardapio.service';
import { AuthService } from './shared/services/auth.service';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    CardapioService,
    AuthService,
    MessageService,
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withFetch())
  ]
};
