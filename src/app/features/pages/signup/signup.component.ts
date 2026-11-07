import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { switchMap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { friendlyHttpError } from '../../../core/utils/http-error.util';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSignup() {
    if (this.loading) {
      return; // Enter dispara keypress e ngSubmit: evita envio duplicado
    }

    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'A senha deve ter pelo menos 8 caracteres';
      return;
    }

    this.errorMessage = '';
    this.loading = true;
    this.authService.signup(this.username, this.email, this.password)
      .pipe(
        switchMap(() => this.authService.login(this.email, this.password))
      )
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Não foi possível criar a conta',
            detail: friendlyHttpError(error, 'Erro ao criar a conta. Tente novamente.'),
            life: 4000,
          });
        }
      });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSignup();
    }
  }
}
