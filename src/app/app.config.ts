import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { CardapioService } from './shared/services/cardapio.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), CardapioService, importProvidersFrom(HttpClientModule), provideHttpClient(withFetch())]
};
