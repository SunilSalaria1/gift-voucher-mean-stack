import { Component } from '@angular/core';
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
@Component({
  selector: 'app-edit-gift-item',
  standalone: true,
  imports: [CommonModule,
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      FormsModule,
      MatInputModule,
      MatFormFieldModule,
      ReactiveFormsModule,],
  templateUrl: './edit-gift-item.component.html',
  styleUrl: './edit-gift-item.component.css'
})
export class EditGiftItemComponent {

  submitted: boolean = false;
    addGiftItemForm!: FormGroup;
    constructor(
      private formBuilder: FormBuilder,private snackBar: MatSnackBar,private router: Router
    ) { }
  
    ngOnInit(): void {
      // form
      this.addGiftItemForm = this.formBuilder.group({
        productTitle: ['', Validators.required],
        productDescription: [
          '',
          [Validators.required, Validators.maxLength(200)],
        ],
        couponCode: ['', Validators.required],
        productImage: ['', Validators.required],
      });
    }
  
    // update reward button
    onSubmit() {
      this.submitted = true;
      if (this.addGiftItemForm.valid) {
        console.log('@@@@@', this.addGiftItemForm?.value);
        this.router.navigate(['/admin/gift-inventory']);
      // Show success snackbar
      this.snackBar.open('You have successfully updated the reward!.', 'close', {
        duration: 5000,
        panelClass: ['snackbar-success'],
        horizontalPosition: "center",
        verticalPosition: "top",
      });
      }
    }
  
    // selecting image
    selectedFiles: any;
    selectFiles(event: any): void {
      this.selectedFiles = event.target.files[0];
    }
  
    // deleting image
    removeImage() {
      this.selectedFiles = '';
      this.addGiftItemForm.get('productImage')?.setValue('');
    }
}
