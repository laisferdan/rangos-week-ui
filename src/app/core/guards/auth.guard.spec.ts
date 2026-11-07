import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../../shared/services/auth.service';

describe('AuthGuard', () => {
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let guard: AuthGuard;
  const loginTree = {} as UrlTree;

  beforeEach(() => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', [
      'checkLoginStatus',
    ]);
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    router.createUrlTree.and.returnValue(loginTree);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('libera a rota com token válido', () => {
    auth.checkLoginStatus.and.returnValue(true);

    expect(guard.canActivate()).toBeTrue();
  });

  it('redireciona para /login sem token válido', () => {
    auth.checkLoginStatus.and.returnValue(false);

    expect(guard.canActivate()).toBe(loginTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
