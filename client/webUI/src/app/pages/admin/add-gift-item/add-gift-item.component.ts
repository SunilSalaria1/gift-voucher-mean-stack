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
import { MatToolbarModule } from '@angular/material/toolbar';
import { UsersService } from '../../../services/users.service';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-add-gift-item',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './add-gift-item.component.html',
  styleUrl: './add-gift-item.component.css',
})
export class AddGiftItemComponent {
  submitted: boolean = false;
  addGiftItemForm: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
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

  onSubmit() {
    this.submitted = true;
    if (this.addGiftItemForm.valid) {
      console.log('@@@@@', this.addGiftItemForm?.value);
    }
  }

  selectedFiles: any;
  selectFiles(event: any): void {
    this.selectedFiles = event.target.files[0];
  }

  removeImage() {
    this.selectedFiles = '';
    this.addGiftItemForm.get('productImage').setValue('');
  }
}
