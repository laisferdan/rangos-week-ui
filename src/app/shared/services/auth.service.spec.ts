import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export function fakeJwt(expiresInSeconds: number): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const encode = (value: object) =>
    btoa(JSON.stringify(value))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({
    sub: '1',
    exp,
  })}.signature`;
}

describe('AuthService', () => {
  let http: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  function createService(): AuthService {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    return TestBed.inject(AuthService);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => {
    http?.verify();
    localStorage.clear();
  });

  it('signup envia username, e-mail e senha para POST /api/users', () => {
    const service = createService();
    let done = false;

    service.signup('alice', 'alice@example.com', 'secret-pass').subscribe(() => {
      done = true;
    });

    const req = http.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'alice',
      email: 'alice@example.com',
      password: 'secret-pass',
    });
    req.flush({ id: 1, username: 'alice', email: 'alice@example.com' });
    expect(done).toBeTrue();
  });

  it('signup propaga o erro da API (e-mail duplicado)', () => {
    const service = createService();
    let status = 0;

    service.signup('alice', 'a@a.com', 'secret-pass').subscribe({
      error: (e) => (status = e.status),
    });

    http
      .expectOne('/api/users')
      .flush({ detail: 'Email already exists' }, { status: 409, statusText: 'Conflict' });
    expect(status).toBe(409);
  });

  it('login envia form OAuth2 e guarda o token', () => {
    const service = createService();
    const token = fakeJwt(600);
    const states: boolean[] = [];
    service.isLoggedIn$.subscribe((s) => states.push(s));

    service.login('alice@example.com', 'p+ss&word=1').subscribe();

    const req = http.expectOne('/api/auth/token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(
      'username=alice%40example.com&password=p%2Bss%26word%3D1'
    );
    expect(req.request.headers.get('Content-Type')).toContain(
      'application/x-www-form-urlencoded'
    );
    req.flush({ access_token: token, token_type: 'bearer' });

    expect(service.getToken()).toBe(token);
    expect(service.checkLoginStatus()).toBeTrue();
    expect(states).toEqual([false, true]);
  });

  it('login com credenciais erradas não guarda token', () => {
    const service = createService();
    let status = 0;

    service.login('a@a.com', 'wrong').subscribe({
      error: (e) => (status = e.status),
    });

    http
      .expectOne('/api/auth/token')
      .flush(
        { detail: 'Incorrect email or password' },
        { status: 401, statusText: 'Unauthorized' }
      );
    expect(status).toBe(401);
    expect(service.getToken()).toBeNull();
    expect(service.checkLoginStatus()).toBeFalse();
  });

  it('logout limpa o token, emite false e vai para /login', () => {
    localStorage.setItem('access_token', fakeJwt(600));
    const service = createService();
    const states: boolean[] = [];
    service.isLoggedIn$.subscribe((s) => states.push(s));

    service.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(states).toEqual([true, false]);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('isLoggedIn$ começa true com token válido', () => {
    localStorage.setItem('access_token', fakeJwt(600));
    const service = createService();
    let value: boolean | undefined;

    service.isLoggedIn$.subscribe((s) => (value = s));

    expect(value).toBeTrue();
  });

  it('token expirado conta como deslogado e é removido', () => {
    localStorage.setItem('access_token', fakeJwt(-10));
    const service = createService();

    expect(service.checkLoginStatus()).toBeFalse();
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('token malformado conta como deslogado', () => {
    localStorage.setItem('access_token', 'lixo');
    const service = createService();

    expect(service.checkLoginStatus()).toBeFalse();
  });

  it('sem token conta como deslogado', () => {
    const service = createService();

    expect(service.checkLoginStatus()).toBeFalse();
  });

  it('remove dados do mecanismo antigo (usuários e senhas em texto puro)', () => {
    localStorage.setItem('users', '[{"email":"a","password":"b"}]');
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', 'a');

    createService();

    expect(localStorage.getItem('users')).toBeNull();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });
});
