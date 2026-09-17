import { Component } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../interfaces/login-request.interface';

@Component({
  imports: [ReactiveFormsModule],
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
    private authService: AuthService

  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    
  }


  onSubmit(): void {
    if (this.loginForm.invalid) return;
      this.authService.login(this.loginForm.value as LoginRequest).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          console.error('Login failed', err);
          alert(err.error?.message ?? 'Invalid credentials');
        }
      });
  }
}
