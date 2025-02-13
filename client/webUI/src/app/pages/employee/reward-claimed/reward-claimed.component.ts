import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { EmployeeFooterComponent } from '../../../shared/employee-footer/employee-footer.component';
import { EmployeeHeaderComponent } from '../../../shared/employee-header/employee-header.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-reward-claimed',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, MatButtonModule, MatCardModule, RouterLink, EmployeeFooterComponent, EmployeeHeaderComponent, MatDialogModule, MatFormFieldModule, CommonModule, MatInputModule],
  templateUrl: './reward-claimed.component.html',
  styleUrl: './reward-claimed.component.css'
})
export class RewardClaimedComponent {
  constructor(private formBuilder: FormBuilder, private router: Router) { }
  private _usersService = inject(UsersService)
  submitted: boolean = false;
  numbers = [1, 2, 3, 4, 5];
  feedbackForm!: FormGroup;
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);
  loggedUser = JSON.parse(localStorage.getItem('loginUser') || '{}');

  ngOnInit(): void {
    // form
    this.feedbackForm = this.formBuilder.group({
      productDescription: [
        '',
        [Validators.required, Validators.maxLength(200)],
      ],
    });
    console.log('Form Initialized:', this.feedbackForm);
  }

  // back to home
  logOut() {
    this._usersService.logout();
  }


  selectedNumber: number = 1; // Track the selected number
  setActive(num: number): void {
    this.selectedNumber = num; // Update the selected number
  }

  // dialog
  openDialog(): void {

    this.feedbackForm.reset();
    this.selectedNumber = 1;
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
    if (this.feedbackForm.valid) {
      // add feedback
      let payload: any;
      payload = {
        userId: this.loggedUser._id,
        rating: JSON.stringify(this.selectedNumber),
        description: this.feedbackForm.value.productDescription,
      }
      this._usersService.addFeedback(payload).subscribe(
        (response: any) => {
          console.log(this.feedbackForm.value); // Log form values
          this.dialog.closeAll(); // Close dialog
          this._usersService.logout();
          this.router.navigateByUrl('/home');
          console.log("add feedback successfull:", response)
        },
        (error) => {
          console.error('error in adding feedback:', error)
        }
      )

    } else {
      // this.feedbackForm.markAllAsTouched(); // Trigger validation messages
      this.submitted = true;
    }
  }
}
