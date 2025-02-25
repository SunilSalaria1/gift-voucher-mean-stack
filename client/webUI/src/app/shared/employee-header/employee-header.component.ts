import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-employee-header',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatMenuModule,
  ],
  templateUrl: './employee-header.component.html',
  styleUrl: './employee-header.component.css',
})
export class EmployeeHeaderComponent {
  private _usersService = inject(UsersService);
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {}

  submitted: boolean = false;
  suggestionsForm!: FormGroup;
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);
  loggedUser = JSON.parse(localStorage.getItem('loginUser') || '{}');

  ngOnInit(): void {
    // form
    this.suggestionsForm = this.formBuilder.group({
      productDescription: [
        '',
        [Validators.required, Validators.maxLength(200)],
      ],
    });
    console.log('Form Initialized:', this.suggestionsForm);
  }

  isLoginPage(): boolean {
    return this.router.url === '/employee-code';
  }

  isSelectedGiftDetailsPage(): boolean {
    return this.router.url === '/selected-gift-details';
  }

  isSelectGiftPage(): boolean {
    return this.router.url === '/select-gift-voucher';
  }

  isRewardClaimedPage(): boolean {
    return this.router.url === '/reward-claimed';
  }

  isHomePage() {
    return this.router.url === '/home';
  }

  isAdminLoginPage() {
    return this.router.url === '/admin-login-access';
  }

  logOut() {
    this._usersService.logout();
    //success snackbar
    this.snackBar.open('You have successfully logged out.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // dialog
  openDialog(): void {
    this.suggestionsForm.reset();
    this.submitted = false;
    // Use the TemplateRef for the dialog
    const dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '1200px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // Method to handle Send button click (when form is valid)
  send(): void {
    if (this.suggestionsForm.valid) {
      // add feedback
      let payload: any;
      payload = {
        userId: this.loggedUser._id,
        description: this.suggestionsForm.value.productDescription,
      };
      this._usersService.addSuggestions(payload).subscribe(
        (response: any) => {
          console.log(this.suggestionsForm.value); // Log form values
          this.dialog.closeAll(); // Close dialog
          console.log('add feedback successfull:', response);
          //success snackbar
          this.snackBar.open(
            'You have successfully shared your feedback.',
            'close',
            {
              duration: 5000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        },
        (error) => {
          console.error('error in adding feedback:', error);
        }
      );
    } else {
      // this.suggestionsForm.markAllAsTouched(); // Trigger validation messages
      this.submitted = true;
    }
  }
}
