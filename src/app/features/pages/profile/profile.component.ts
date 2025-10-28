import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
})
export class ProfileComponent implements OnInit {
  public user: any;
  public newPassword: string = '';
  public confirmPassword: string = '';
  public passwordChangeSuccess: boolean = false;
  public passwordChangeError: string = '';
  public showChangePassword: boolean = false;

  constructor() {}
  ngOnInit() {
    this.user = {
      firstName: 'Samantha',
      name: 'Samantha de Jesus',
      dateOfBirth: '05/04/1984',
      email: 'mantinha23@email.com',
    };
  }

  public changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordChangeError = 'Senhas não conferem';
      return;
    }

    this.passwordChangeSuccess = true;
    this.passwordChangeError = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  public toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
  }
}
