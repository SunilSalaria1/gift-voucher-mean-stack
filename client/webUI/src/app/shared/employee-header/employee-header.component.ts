import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-header',
  standalone: true,
  imports: [MatIcon,RouterLink],
  templateUrl: './employee-header.component.html',
  styleUrl: './employee-header.component.css'
})
export class EmployeeHeaderComponent {
  private _snackBar = inject(MatSnackBar);
  constructor(private router: Router,private snackBar: MatSnackBar) {}
  
  isLoginPage(): boolean {
    return this.router.url === '/employee-code';
  }

  isSelectGiftPage(): boolean {
    return this.router.url === '/select-gift-voucher';
  }

  isRewardClaimedPage(): boolean {
    return this.router.url === '/reward-claimed';
  }

  logOut(){
    localStorage.removeItem('loginUser')
    // show success snackbar
    this.snackBar.open('You have successfully logged out.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
}
