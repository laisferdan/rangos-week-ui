import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

const TOKEN_KEY = 'access_token';
// Chaves do mecanismo antigo (usuários e senhas no localStorage).
const LEGACY_KEYS = ['users', 'isLoggedIn', 'currentUser'];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.removeLegacyData();
  }

  signup(username: string, email: string, password: string): Observable<void> {
    return this.http
      .post(`${this.apiUrl}/users`, { username, email, password })
      .pipe(map(() => void 0));
  }

  login(email: string, password: string): Observable<void> {
    // OAuth2PasswordRequestForm: o campo "username" recebe o e-mail.
    // URLSearchParams codifica "+" e "&" corretamente (HttpParams não).
    const body = new URLSearchParams({
      username: email,
      password,
    }).toString();

    return this.http
      .post<TokenResponse>(`${this.apiUrl}/auth/token`, body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .pipe(
        tap((response) => this.storeToken(response.access_token)),
        map(() => void 0)
      );
  }

  logout(): void {
    this.clearToken();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /** True quando existe token e ele ainda não expirou. */
  checkLoginStatus(): boolean {
    const valid = this.hasValidToken();
    if (!valid && this.getToken()) {
      this.clearToken();
    }
    if (this.isLoggedInSubject.value !== valid) {
      this.isLoggedInSubject.next(valid);
    }
    return valid;
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const exp = this.readExpiration(token);
    return exp !== null && exp * 1000 > Date.now();
  }

  private readExpiration(token: string): number | null {
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const exp = JSON.parse(json).exp;
      return typeof exp === 'number' ? exp : null;
    } catch {
      return null;
    }
  }

  private storeToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.isLoggedInSubject.next(true);
  }

  private clearToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // localStorage indisponível: nada a limpar.
    }
  }

  private removeLegacyData(): void {
    try {
      LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch {
      // localStorage indisponível: nada a limpar.
    }
  }
}
