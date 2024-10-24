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

@Component({
  selector: 'app-admin-login-access',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, FormsModule, MatInputModule, MatFormFieldModule, RouterLink, ReactiveFormsModule],
  templateUrl: './admin-login-access.component.html',
  styleUrl: './admin-login-access.component.css'
})
export class AdminLoginAccessComponent {
  administratorForm: any;
  private _snackBar = inject(MatSnackBar);
  constructor(private formBuilder: FormBuilder, private router: Router, private snackBar: MatSnackBar) { }

  // Initialize the form group inside ngOnInit to avoid 'formBuilder' is used before its initialization
  ngOnInit(): void {
    this.administratorForm = this.formBuilder.group({
      administratorCode: ['', Validators.required],
      administratorKey: ["", Validators.required]
    });
  }

  //on submit
  onSubmit() {
    if (this.administratorForm.valid) {
      console.log('Employee Code:', this.administratorForm.value.administratorCode);
      console.log('Employee Code:', this.administratorForm.value.administratorKey);
      if (this.administratorForm.value.administratorCode === 'Ad1234' && this.administratorForm.value.administratorKey === "123123") {
        this.router.navigate(['/dashboard']);
        // Show success snackbar
        this.snackBar.open('Welcome! now you can oversee the system.', 'close', {
          duration: 5000,
          panelClass: ['snackbar-success'],
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      } else {
        // Show error snackbar
        this.snackBar.open('Invalid administrator code + key, try again.', 'close', {
          duration: 5000,
          panelClass: ['snackbar-error'],
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      }
    }
  }
}
