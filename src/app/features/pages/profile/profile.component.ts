import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from '../../../core/models/user.model';
import { friendlyHttpError } from '../../../core/utils/http-error.util';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
})
export class ProfileComponent implements OnInit {
  public user: User | null = null;
  public loading: boolean = false;
  public saving: boolean = false;
  public loadError: boolean = false;
  public newPassword: string = '';
  public confirmPassword: string = '';
  public passwordChangeSuccess: boolean = false;
  public passwordChangeError: string = '';
  public showChangePassword: boolean = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  public loadUser() {
    this.loading = true;
    this.loadError = false;

    this.userService.getMe().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.loadError = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: friendlyHttpError(e, 'Erro ao carregar o perfil.'),
          life: 4000,
        });
      },
    });
  }

  public changePassword() {
    this.passwordChangeSuccess = false;

    if (this.newPassword !== this.confirmPassword) {
      this.passwordChangeError = 'Senhas não conferem';
      return;
    }
    if (this.newPassword.length < 8) {
      this.passwordChangeError = 'A senha deve ter pelo menos 8 caracteres';
      return;
    }

    this.passwordChangeError = '';
    this.saving = true;

    this.userService.updateMe({ password: this.newPassword }).subscribe({
      next: () => {
        this.saving = false;
        this.passwordChangeSuccess = true;
        this.newPassword = '';
        this.confirmPassword = '';
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Senha alterada com sucesso!',
          life: 3000,
        });
      },
      error: (e) => {
        this.saving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: friendlyHttpError(e, 'Erro ao alterar a senha.'),
          life: 4000,
        });
      },
    });
  }

  public toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
  }
}
