import { Component, inject, OnInit } from '@angular/core';
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
import { EmployeeFooterComponent } from '../../../shared/employee-footer/employee-footer.component';
import { EmployeeHeaderComponent } from '../../../shared/employee-header/employee-header.component';

@Component({
  selector: 'app-employee-code',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, FormsModule, MatInputModule, MatFormFieldModule, RouterLink, ReactiveFormsModule, EmployeeFooterComponent, EmployeeHeaderComponent],
  templateUrl: './employee-code.component.html',
  styleUrl: './employee-code.component.css'
})
export class EmployeeCodeComponent implements OnInit {
  employeeCodeForm: any;
  private _snackBar = inject(MatSnackBar);
  private _usersService = inject(UsersService)
  userData: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private snackBar: MatSnackBar) { }

  // Initialize the form group inside ngOnInit to avoid 'formBuilder' is used before its initialization
  ngOnInit(): void {
    this.employeeCodeForm = this.formBuilder.group({
      employeeCode: ['', Validators.required],
    });
    // user data
    this._usersService.getUsers().subscribe(response => {
      this.userData = response;
    })
  }


  //on submit
  onSubmit() {
    // const matchedEmployee = this.userData.employee.find(
    //   (emp: { empCode: any }) => emp.empCode === this.employeeCodeForm.value.employeeCode
    // );
    // console.log(matchedEmployee);
    if (this.employeeCodeForm.valid) {
      const data = {
        empCode: this.employeeCodeForm.value.employeeCode,
        role:"employee"
      };

      this._usersService.login(data).subscribe(
        (response) => {
          console.log(response);
          localStorage.setItem('loginUser', JSON.stringify(response.userDetails));
          this._usersService.saveToken(response.token); // Store token
          this.router.navigate(['/select-gift-voucher']);
          this.snackBar.open('Welcome! Now you can access your rewards.', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-success'],
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        },
        (error) => {
          console.error('Login failed:', error);
          this.snackBar.open('Invalid employee code, try again.', 'Close', {
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




