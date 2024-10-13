import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn: boolean = false;

  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
  }

  checkLoginStatus() {
    return this.isLoggedIn;
  }
  
  token = localStorage.getItem('token') ?? '';

  constructor(private readonly router: Router, private readonly http: HttpClient) {}

  buildHeaders = () =>
    new HttpHeaders().set('X-token', localStorage.getItem('token') ?? '');

  validateLogin = (token: string) =>
    this.http.post(
      'http://localhost:4200/validate',
      { token },
      {
        headers: this.buildHeaders(),
        observe: 'response',
      }
    );

  canActivate(route: ActivatedRouteSnapshot) {

    if (!this.token) {
      this.router.navigate(['/login']);
    }

    this.validateLogin(this.token).subscribe((retorno) => {
      console.log(route.url[0].toString());

      if (
        route.url[0].path.includes('users') &&
        (retorno as any).body.permissao != 'admin'
      ) {
        this.router.navigate(['/home']);
      }
    });
  }

  persistToken(token: string) {
    localStorage.setItem('token', token);
    this.token = token;
  }

  getToken() {
    return this.token;
  }
}
