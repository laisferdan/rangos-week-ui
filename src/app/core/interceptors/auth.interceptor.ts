import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);

  const isApiCall = req.url.startsWith(environment.apiUrl);
  const isLoginCall = req.url.endsWith('/auth/token');
  const token = authService.getToken();

  const request =
    isApiCall && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      // Um 401 no próprio login significa credenciais erradas, não sessão
      // expirada. Fora dele, o token é inválido: encerra a sessão.
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        isApiCall &&
        !isLoginCall &&
        authService.getToken()
      ) {
        authService.logout();
        messageService.add({
          severity: 'warn',
          summary: 'Sessão expirada',
          detail: 'Faça login novamente.',
          life: 4000,
        });
      }
      return throwError(() => error);
    })
  );
};
