import { Component, inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-header',
  standalone: true,
  imports: [MatIconModule,RouterLink,MatButtonModule],
  templateUrl: './employee-header.component.html',
  styleUrl: './employee-header.component.css'
})
export class EmployeeHeaderComponent { 
  private _usersService = inject(UsersService)
  constructor(private router: Router,private snackBar: MatSnackBar  ) {}
  
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
      //success snackbar
    this.snackBar.open('You have successfully logged out.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
}
