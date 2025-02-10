import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink,CommonModule,MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userData:any=localStorage.getItem('loginUser');
  user:any=JSON.parse(this.userData);
  private _usersService = inject(UsersService)

  logOut() {    
    this._usersService.logout();
  }

  @Output() menuClicked = new EventEmitter<void>();

  toggleMenu() {
    this.menuClicked.emit();
  }
}
