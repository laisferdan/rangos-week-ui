import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  items: MenuItem[] = [];
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (status) => {
        this.isLoggedIn = status;
        this.initializeMenu();
      }
    );
  }

  private initializeMenu() {
    this.items = [
      {
        label: 'Home',
        routerLink: '/home',
        icon: 'pi pi-fw pi-home',
        disabled: !this.isLoggedIn
      },
      {
        label: 'Perfil',
        routerLink: '/profile',
        icon: 'pi pi-fw pi-user',
        disabled: !this.isLoggedIn
      },
      {
        label: 'Dicas',
        routerLink: '/dicas',
        icon: 'pi pi-fw pi-book',
        disabled: !this.isLoggedIn
      },
      {
        label: 'Sobre nós',
        routerLink: '/sobre-nos',
        icon: 'pi pi-fw pi-info-circle',
        disabled: !this.isLoggedIn
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        command: () => this.authService.logout(),
        visible: this.isLoggedIn
      },
    ];    
  }

  public navigateToLogin() {
    this.router.navigate(['/login']);
  }
}