import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  public isLoggedIn: boolean = false;

  login() {
    this.isLoggedIn = true;
    this.isLoggedInSubject.next(true);
  }

  logout() {
    this.isLoggedIn = false;
    this.isLoggedInSubject.next(false);
  }

  checkLoginStatus() {
    return this.isLoggedIn;
  }
}
