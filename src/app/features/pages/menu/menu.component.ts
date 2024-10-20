import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;
  itemsLogin: MenuItem[] | undefined;
  isLoggedIn: boolean = false;
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.items = [
      {
        label: 'Página inicial',
        icon: 'pi pi-fw pi-home',
        routerLink: '/home',
        style: {'margin-left': 'auto'}
      },
      {
        label: 'Perfil',
        routerLink: '/perfil',
        icon: 'pi pi-fw pi-user',
      },
      {
        label: 'Modos de armazenamento',
        routerLink: '/armazenamento',
        icon: 'pi pi-fw pi-box',
      },
      {
        label: 'Sobre nós',
        routerLink: '/sobre-nos',
        icon: 'pi pi-fw pi-info-circle',
      },
    ];    
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}