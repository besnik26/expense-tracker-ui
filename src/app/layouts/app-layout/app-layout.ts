import { RouterLink,Router,  RouterLinkActive, RouterOutlet } from '@angular/router';
import { Component, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  selector: 'app-app-layout',
  styleUrl: './app-layout.css',
  templateUrl: './app-layout.html',
})
export class AppLayout {
  isOpen = signal<boolean>(false);



  constructor(
    private authService: AuthService,
    private router: Router
  ){

  }

  logOut(){
    this.authService.logout();
    this.router.navigate(['/login']);
    this.setNavbar(false);
  }

  toggleNavbar() {
    this.isOpen.update(currentValue => !currentValue); 
  }

  setNavbar(value: boolean) {
    this.isOpen.set(value);
  }
}
