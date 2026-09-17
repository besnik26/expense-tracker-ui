import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-auth-layout',
  styleUrl: './auth-layout.css',
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
