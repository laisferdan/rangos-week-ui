import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { CardapioService } from './shared/services/cardapio.service';
import { AuthService } from './shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    CardapioService,
    AuthService,
    MessageService,
    provideHttpClient(withFetch(), withInterceptors([authInterceptor]))
  ]
};
