import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [ContainerComponent, RowComponent,
    ColComponent, CardComponent, CardBodyComponent, CommonModule, FormsModule,
    FormDirective, InputGroupComponent, InputGroupTextDirective, ReactiveFormsModule,
    IconDirective, FormControlDirective, ButtonDirective, RouterLink, RouterOutlet]
})
export class RegisterComponent {

  registerForm!: FormGroup;
  confirmPassword?: string;

  constructor(private fb: FormBuilder, private http: HttpConnectService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],

      }
    );
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    if (this.registerForm.value.password !== this.confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    this.http.posteData('Register', this.registerForm.getRawValue())
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token)
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

}
