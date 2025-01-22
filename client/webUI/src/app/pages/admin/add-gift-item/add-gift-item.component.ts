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
@Component({
  selector: 'app-add-gift-item',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule,
    MatCardModule,    
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,    
    ReactiveFormsModule,
  ],
  templateUrl: './add-gift-item.component.html',
  styleUrl: './add-gift-item.component.css',
})
export class AddGiftItemComponent {
  submitted: boolean = false;
  addGiftItemForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,    
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
submit(){
  console.log("addGiftItemForm.controls",this.addGiftItemForm.controls)
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
    this.addGiftItemForm.get('productImage')?.setValue('');
  }
}
