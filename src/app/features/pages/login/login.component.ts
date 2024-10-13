import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hasError: boolean = false;
  constructor(private readonly authService: AuthService) {}
 
  public onLogin() {
    console.log(this.authService.checkLoginStatus())
    if (!this.authService.checkLoginStatus()) {
      this.authService.login();
    } else {
      this.authService.logout();
    }
  }
}