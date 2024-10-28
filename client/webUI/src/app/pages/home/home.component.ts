import { Component } from '@angular/core';
import { EmployeeCodeComponent } from '../../pages/auth/employee-code/employee-code.component';
import { AdminLoginAccessComponent } from '../../pages/auth/admin-login-access/admin-login-access.component';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [EmployeeCodeComponent,MatIconModule,AdminLoginAccessComponent, RouterLink,MatButtonModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
constructor(private router : Router){}
}
