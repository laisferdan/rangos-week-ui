import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import User from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  id: string = "";
  cadastroForm: any;
  
  constructor(
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private readonly route: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}
  
  onRegister() {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params["id"];

    if (this.id) {
      this.userService.returnUser(this.id).subscribe({
        next: (user) => {
          console.log(user);

          this.registerForm = this.formBuilder.group({
            name: user.name,
            email: user.email,
            password: '',
            permission: user.permission
          });
        },
        error: (error) => console.error(error)
      })
    }

  }

  registerForm = this.formBuilder.group({
    name: '',
    email: '',
    password: '',
    permission: ''
  });

  onSubmit() {
    const user = new User(
      this.registerForm.value.name ?? '',
      this.registerForm.value.email ?? '',
      this.registerForm.value.password ?? '',
      ''
    );

    if (this.id) {
      user._id = this.id;
      user.permission = this.registerForm.value.permission ?? '';
      this.userService.updateUser(user).subscribe({
        next: () => this.route.navigate(["/home/users"])
      });
    } else {
      this.userService.addUser(user).subscribe((retorno) => {
        console.log(retorno);
        this.route.navigate(['/login']);
      });
    }
  }
}
