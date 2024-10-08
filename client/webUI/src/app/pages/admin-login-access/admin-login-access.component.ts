import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-login-access',
  standalone: true,
  imports: [MatButtonModule,MatIconModule,FormsModule,MatInputModule,MatFormFieldModule, RouterLink],
  templateUrl: './admin-login-access.component.html',
  styleUrl: './admin-login-access.component.css'
})
export class AdminLoginAccessComponent {

}
