import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import { UsersService } from '../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink,CommonModule,MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private snackBar: MatSnackBar){}
  userData:any=localStorage.getItem('loginUser');
  user:any=JSON.parse(this.userData);
  private _usersService = inject(UsersService)
  loginUser=localStorage.getItem("loginUser")
  loggedUser: any;

ngOnInit() {
  const storedUser = this.loginUser;
  if (storedUser) {
    this.loggedUser = JSON.parse(storedUser);
  } else {
    this.loggedUser = {}; // or provide default values
  }
}


  logOut() {    
    this._usersService.logout();
    //success snackbar
    this.snackBar.open('You have successfully logged out.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }

  @Output() menuClicked = new EventEmitter<void>();

  toggleMenu() {
    this.menuClicked.emit();
  }
}
