import { ChangeDetectorRef, Component } from '@angular/core';
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
  RowComponent,
  SpinnerComponent,
  SpinnerModule
} from '@coreui/angular';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { LoginRequest } from '../../../Models/Auth/loginRequest';
import { LoginResponse } from '../../../Models/Auth/loginResponse';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ContainerComponent, RowComponent, ColComponent, SpinnerComponent, CommonModule,
    CardGroupComponent, CardComponent, CardBodyComponent,
    FormDirective, InputGroupComponent, InputGroupTextDirective, RouterLink, RouterModule, RouterOutlet,
    IconDirective, FormControlDirective, ButtonDirective, FormsModule, ReactiveFormsModule]
})

export class LoginComponent {

  loading: boolean = false
  showError: boolean = false
  LoginResponse?: string
  loginForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(
    private fb: FormBuilder, private router: Router, private cdr: ChangeDetectorRef,
    private httpService: HttpConnectService
  ) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


    login(): void {
      if (this.loginForm.invalid) return;

      this.loading = true;
      this.showError = false;

      const payload: LoginRequest = this.loginForm.getRawValue();

      this.httpService.posteData('Account/Login', payload).subscribe({
        next: (res: LoginResponse) => {
          console.log(res)
          localStorage.setItem('token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          if (res.businesses && res.businesses.length > 0) {
            const safeBusinesses = JSON.parse(JSON.stringify(res.businesses));
            localStorage.setItem('businesses', JSON.stringify(safeBusinesses));
            if(localStorage.getItem('currentBusiness') == null){
              localStorage.setItem('currentBusiness', JSON.stringify(safeBusinesses[0]));
            }
          } else {
            localStorage.removeItem('businesses');
          }

          this.router.navigate(['/Home/dashboard']);
          this.loading = false;
        },

        error: err => {
          this.showError = true;
          this.loading = false;
          this.cdr.detectChanges();
          alert(err.error.message);
        }
      });
    }


}
