import { Component, inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-employee-header',
  standalone: true,
  imports: [MatIconModule,RouterLink,MatButtonModule],
  templateUrl: './employee-header.component.html',
  styleUrl: './employee-header.component.css'
})
export class EmployeeHeaderComponent { 
  private _usersService = inject(UsersService)
  constructor(private router: Router) {}
  
  isLoginPage(): boolean {
    return this.router.url === '/employee-code';
  }

  isSelectGiftPage(): boolean {
    return this.router.url === '/select-gift-voucher';
  }

  isRewardClaimedPage(): boolean {
    return this.router.url === '/reward-claimed';
  }

  isHomePage(){
    return this.router.url === '/home';
  }

  isAdminLoginPage(){
    return this.router.url === '/admin-login-access';
  }

  logOut(){
    this._usersService.logout();    
  }
}
