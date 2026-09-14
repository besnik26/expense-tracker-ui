import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      // this.isLoading = true;
      console.log(this.loginForm.value)
    }
  }
}
