import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hasError: boolean = false;

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  public onLogin(event: Event) {
    event.preventDefault();
    console.log(this.authService.checkLoginStatus());  
    if (!this.authService.checkLoginStatus()) {
      this.authService.login();
      this.router.navigate(['/home']);
    } else {
      this.authService.logout();
    }
  }
}