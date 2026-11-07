import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../../shared/services/auth.service';
import { fakeJwt } from '../../shared/services/auth.service.spec';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let messages: jasmine.SpyObj<MessageService>;
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    messages = jasmine.createSpyObj<MessageService>('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: MessageService, useValue: messages },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => {
    controller.verify();
    localStorage.clear();
  });

  it('envia Authorization: Bearer <token> nas chamadas à API', () => {
    const token = fakeJwt(600);
    localStorage.setItem('access_token', token);

    http.get('/api/recipes').subscribe();

    const req = controller.expectOne('/api/recipes');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({ recipes: [] });
  });

  it('não envia o cabeçalho sem token', () => {
    http.get('/api/recipes').subscribe();

    const req = controller.expectOne('/api/recipes');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({ recipes: [] });
  });

  it('não vaza o token para outros domínios', () => {
    localStorage.setItem('access_token', fakeJwt(600));

    http.get('https://outro-site.example.com/x').subscribe();

    const req = controller.expectOne('https://outro-site.example.com/x');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('em 401 faz logout, avisa o usuário e vai para /login', () => {
    localStorage.setItem('access_token', fakeJwt(600));
    let status = 0;

    http.get('/api/records').subscribe({ error: (e) => (status = e.status) });

    controller
      .expectOne('/api/records')
      .flush({ detail: 'x' }, { status: 401, statusText: 'Unauthorized' });

    expect(status).toBe(401);
    expect(auth.getToken()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(messages.add).toHaveBeenCalledTimes(1);
    expect(messages.add.calls.mostRecent().args[0].severity).toBe('warn');
  });

  it('401 em várias chamadas simultâneas avisa só uma vez', () => {
    localStorage.setItem('access_token', fakeJwt(600));

    http.get('/api/records').subscribe({ error: () => undefined });
    http.get('/api/recipes').subscribe({ error: () => undefined });

    controller
      .expectOne('/api/records')
      .flush({}, { status: 401, statusText: 'Unauthorized' });
    controller
      .expectOne('/api/recipes')
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(messages.add).toHaveBeenCalledTimes(1);
  });

  it('401 no próprio login não faz logout nem redireciona', () => {
    http
      .post('/api/auth/token', 'username=a&password=b')
      .subscribe({ error: () => undefined });

    controller
      .expectOne('/api/auth/token')
      .flush(
        { detail: 'Incorrect email or password' },
        { status: 401, statusText: 'Unauthorized' }
      );

    expect(router.navigate).not.toHaveBeenCalled();
    expect(messages.add).not.toHaveBeenCalled();
  });

  it('outros erros (500) não encerram a sessão', () => {
    const token = fakeJwt(600);
    localStorage.setItem('access_token', token);

    http.get('/api/records').subscribe({ error: () => undefined });

    controller
      .expectOne('/api/records')
      .flush({}, { status: 500, statusText: 'Server Error' });

    expect(auth.getToken()).toBe(token);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
