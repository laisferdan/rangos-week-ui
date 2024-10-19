import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;
  itemsLogin: MenuItem[] | undefined;
  isLoggedIn: boolean = false;

  constructor(private readonly authService: AuthService) {}

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

    this.itemsLogin = [
      {
        label: 'Login',
        routerLink: '/login',
        style: {
          'background-color': '#FFB357', 
          'border-radius' : '10px'
        }
      },
    ];
  }
}