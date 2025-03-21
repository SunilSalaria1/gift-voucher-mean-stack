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
import { ProductsService } from '../../../services/products.service';

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
  currentImage: any;
  productImage: any; 
  addGiftItemForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router, private productsService: ProductsService
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

     // Reset error when coupon code changes
  // this.addGiftItemForm.get('couponCode')?.valueChanges.subscribe(() => {
  //   this.isCouponCodeAlreadyExists = false;
  // });
  }

  // validating coupon code
  validateCouponCode() {    
    const couponCode = this.addGiftItemForm.get('couponCode')?.value;
    if (couponCode) {
      this.productsService.checkCouponCode(couponCode).subscribe(
        (response) => {
          if (response) {            
            this.addGiftItemForm.get('couponCode')?.setErrors({ couponExists: true });
            console.log('Coupon code already exists!');
          }
        },
        (error) => {
          console.error('Error checking coupon code:', error);
        }
      );
    }
  }
  // selecting image
  selectedFiles: any;
  selectFiles(event: any): void {
    this.selectedFiles = event.target.files[0];
    if (this.selectedFiles) {
      // Upload image when a file is selected
      this.uploadImage(this.selectedFiles);
    }
  }

  // image upload to api
  uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file, file.name)
    this.productsService.uploadProductImage(formData).subscribe(
      (response) => {
        this.currentImage = response.imageUrl
        this.productImage = response.fileDetails._id
        this.addGiftItemForm.patchValue({
          productImage: response.fileDetails.fileName
        })
      }
    )
  }
  // deleting image
  removeImage() {
    this.selectedFiles = '';
    this.addGiftItemForm.get('productImage')?.setValue('');
  }

  // create reward button
  onSubmit() {
    this.submitted = true;
    if (this.addGiftItemForm.valid) {
      const payload = {
        couponCode: this.addGiftItemForm.value.couponCode,
        productImageId: this.productImage,
        productDescription: this.addGiftItemForm.value.productDescription,
        productTitle: this.addGiftItemForm.value.productTitle
      }
      this.productsService.addProducts(payload).subscribe(
        (response) => {
          this.router.navigate(['/admin/gift-inventory']);
          // Show success snackbar
          this.snackBar.open('You have successfully created a reward!.', 'close', {
            duration: 5000,
            panelClass: ['snackbar-success'],
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        }
      )
    }
  }
}
