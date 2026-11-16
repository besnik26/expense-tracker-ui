import { Component } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../interfaces/login-request.interface';
import { toast } from 'ngx-sonner';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';


@Component({
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login  {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService

  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }



  onSubmit(): void {
    if (this.loginForm.valid){
      this.spinner.show('login');
      this.isLoading = true;

      this.authService.login(this.loginForm.value as LoginRequest)
      .pipe(
        finalize(()=>{
          this.spinner.hide('login')
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard'])
          toast.success('Successfully logged in!')
        },
        error: (err) => {
          console.error('Login failed', err);
          // alert(err.error?.message ?? 'Invalid credentials');
          toast.error('Invalid credentials');
        }
      });
    }else{
      this.markFormGroupTouched(this.loginForm);
    }
  }

  markFormGroupTouched(formGroup:FormGroup){
    Object.values(formGroup.controls).forEach(control =>{
      control.markAsTouched();
    })
  }

}
