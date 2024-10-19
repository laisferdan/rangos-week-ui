import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private router: Router) {}

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent the default form submission

    // Implement user registration logic here
    // For example, call a service to register the user

    // After successful registration, navigate to the login page
    this.router.navigate(['/login']);
  }
}
