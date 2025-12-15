import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { LoginRequest } from '../../../Models/Auth/loginRequest';
import { LoginResponse } from '../../../Models/Auth/loginResponse';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ContainerComponent, RowComponent, ColComponent,
    CardGroupComponent, CardComponent, CardBodyComponent,
    FormDirective, InputGroupComponent, InputGroupTextDirective, RouterLink, RouterModule, RouterOutlet,
    IconDirective, FormControlDirective, ButtonDirective, FormsModule, ReactiveFormsModule]
})

export class LoginComponent {

  loginForm!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(
    private fb: FormBuilder, private router: Router,
    private httpService: HttpConnectService
  ) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  login(): void {
    console.log(this.loginForm.getRawValue())
    if (this.loginForm.invalid) return;

    const payload: LoginRequest = this.loginForm.getRawValue();


    this.httpService.posteData('Account/Login', payload).subscribe({
      next: (res: LoginResponse) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/Home/dashboard']);
        console.log('Login successful');
      },
      error: err => {
        console.error('Login failed', err);
      }
    });
  }

}
