import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../../services/users.service';
import { EmployeeHeaderComponent } from '../../../shared/employee-header/employee-header.component';
import { EmployeeFooterComponent } from '../../../shared/employee-footer/employee-footer.component';

@Component({
  selector: 'app-admin-login-access',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, FormsModule, MatInputModule, MatFormFieldModule, RouterLink, ReactiveFormsModule, EmployeeHeaderComponent, EmployeeFooterComponent],
  templateUrl: './admin-login-access.component.html',
  styleUrl: './admin-login-access.component.css'
})
export class AdminLoginAccessComponent {
  administratorForm: any;
  userData: any;
  private _snackBar = inject(MatSnackBar);
  private _usersService = inject(UsersService)
  constructor(private formBuilder: FormBuilder, private router: Router, private snackBar: MatSnackBar) { }

  // Initialize the form group inside ngOnInit to avoid 'formBuilder' is used before its initialization
  ngOnInit(): void {
    this.administratorForm = this.formBuilder.group({
      administratorCode: ['', Validators.required],
      administratorKey: ["", Validators.required]
    });
    // admin data
    this._usersService.getUsers().subscribe(response => {
      this.userData = response;
    })
  }

  //on submit
  onSubmit() {
    if (this.administratorForm.valid) {
      console.log('Employee Code:', this.administratorForm.value);
      console.log('Employee Key:', this.administratorForm.value.administratorKey);  
      const data = {
        empCode: this.administratorForm.value.administratorCode,
        password: this.administratorForm.value.administratorKey
      };  
      console.log(data);      
      this._usersService.login(data).subscribe(
        (response) => {
          console.log(response);
          localStorage.setItem('loginUser', JSON.stringify(response.userDetails));
          this.router.navigate(['/admin/dashboard']);
          this.snackBar.open('Welcome! Now you can oversee the system.', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-success'],
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        },
        (error) => {
          console.error('Login failed:', error);
          this.snackBar.open('Invalid administrator code or key, try again.', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error'],
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        }
      );
    }
  }
  }
