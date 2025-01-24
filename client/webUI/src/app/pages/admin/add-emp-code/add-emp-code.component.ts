import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
@Component({
  selector: 'app-add-emp-code',
  standalone: true,
  imports: [CommonModule,
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      FormsModule,
      MatInputModule,
      MatFormFieldModule,
      ReactiveFormsModule,
      MatSelectModule,
      MatDatepickerModule,
      ],
      providers: [provideNativeDateAdapter()],
  templateUrl: './add-emp-code.component.html',
  styleUrl: './add-emp-code.component.css'
})
export class AddEmpCodeComponent {
submitted: boolean = false;
departments = ['HR', 'Frontend', 'Backend', 'Audit', 'Bidding'];
  addGiftItemForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,private snackBar: MatSnackBar,private router: Router
  ) { }

  ngOnInit(): void {
    // form
    this.addGiftItemForm = this.formBuilder.group({
      employeeName: ['', Validators.required],      
      department: ['', Validators.required],
      dob: ['', Validators.required],
      joiningDate: ['', Validators.required],
    });
  }

  // create reward button
  onSubmit() {
    this.submitted = true;
    if (this.addGiftItemForm.valid) {
      console.log('@@@@@', this.addGiftItemForm?.value);
      this.router.navigate(['/admin/gift-inventory']);
      // Show success snackbar
      this.snackBar.open('You have successfully created a reward!.', 'close', {
        duration: 5000,
        panelClass: ['snackbar-success'],
        horizontalPosition: "center",
        verticalPosition: "top",
      });
    }
  }

  
}


