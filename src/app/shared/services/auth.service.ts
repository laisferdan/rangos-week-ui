import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private users: User[] = [];

  constructor(private router: Router) {
    this.loadUsers();
  }

  private loadUsers(): void {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      try {
        this.users = JSON.parse(savedUsers);
      } catch (e) {
        console.error('Error loading users from localStorage:', e);
        this.users = [];
        localStorage.setItem('users', JSON.stringify(this.users));
      }
    }
  }

  private saveUsers(): void {
    try {
      localStorage.setItem('users', JSON.stringify(this.users));
    } catch (e) {
      console.error('Error saving users to localStorage:', e);
    }
  }

  signup(email: string, password: string): Observable<void> {
    // Reload users before checking to ensure we have the latest data
    this.loadUsers();
    
    const existingUser = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return throwError(() => new Error('Email já cadastrado'));
    }

    this.users.push({ email, password });
    this.saveUsers();
    return of(void 0);
  }

  login(email: string): Observable<void> {
    // Reload users before checking to ensure we have the latest data
    this.loadUsers();
    
    const user = this.users.find(
      u => u.email.toLowerCase() === email.toLowerCase() 
    );
    
    if (!user) {
      return throwError(() => new Error('Email ou senha inválidos'));
    }

    try {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', email);
      this.isLoggedInSubject.next(true);
      return of(void 0);
    } catch (e) {
      console.error('Error setting login state:', e);
      return throwError(() => new Error('Erro ao fazer login. Tente novamente.'));
    }
  }

  logout(): void {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      this.isLoggedInSubject.next(false);
      this.router.navigate(['/login']);
    } catch (e) {
      console.error('Error during logout:', e);
    }
  }

  checkLoginStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
