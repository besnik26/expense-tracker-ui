import { RouterLink,Router,  RouterLinkActive, RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-app-layout',
  styleUrl: './app-layout.css',
  templateUrl: './app-layout.html',
})
export class AppLayout {
  constructor(
    private authService: AuthService,
    private router: Router
  ){

  }

  logOut(){
    this.authService.logout();
    this.router.navigate(['/login']);

  }
}
