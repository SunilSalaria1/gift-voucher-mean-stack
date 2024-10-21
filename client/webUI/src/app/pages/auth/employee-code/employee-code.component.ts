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



@Component({
  selector: 'app-employee-code',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, FormsModule, MatInputModule, MatFormFieldModule, RouterLink, ReactiveFormsModule],
  templateUrl: './employee-code.component.html',
  styleUrl: './employee-code.component.css'
})
export class EmployeeCodeComponent implements OnInit {
  employeeCodeForm: any;
  private _snackBar = inject(MatSnackBar);
  constructor(private formBuilder: FormBuilder, private router: Router, private snackBar: MatSnackBar) { }

  // Initialize the form group inside ngOnInit to avoid 'formBuilder' is used before its initialization
  ngOnInit(): void {
    this.employeeCodeForm = this.formBuilder.group({
      employeeCode: ['', Validators.required]
    });
  }

  //on submit
  onSubmit() {
    if (this.employeeCodeForm.valid) {
      //console.log('Employee Code:', this.employeeCodeForm.value.employeeCode);
      if (this.employeeCodeForm.value.employeeCode === 'Lp1234') {
        this.router.navigate(['/select-gift-voucher']);
        // Show success snackbar
        this.snackBar.open('Enjoy your exclusive rewards.', 'close', {
          duration: 5000,
          panelClass: ['snackbar-success'],
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      } else {
        // Show error snackbar
        this.snackBar.open('Invalid employee code, try again.', 'close', {
          duration: 5000,
          panelClass: ['snackbar-error'],
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      }
    }
  }
}



