import { Component } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { toast } from 'ngx-sonner';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { finalize, delay } from 'rxjs';

@Component({
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  registerForm:FormGroup;
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ){
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }



  onSubmit(): void {
    if (this.registerForm.valid){
      this.spinner.show('register');
      this.isLoading = true;


      this.authService.register(this.registerForm.value)
     
      .pipe(
        delay(3000),
        finalize(()=>{
          this.spinner.hide('register');
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
          toast.success('Successfully registered your account!')
          
        },
        error: (err) => {
          // alert(err.error?.message || 'Registration failed');
          console.error(err.error?.message || 'Registration failed');
          toast.error('Registration failed!')

        }
      });
    }else{
      this.markFormGroupTouched(this.registerForm);
    }

  }

  markFormGroupTouched(formGroup:FormGroup){
    Object.values(formGroup.controls).forEach(control =>{
      control.markAsTouched();
    })
  }

}
