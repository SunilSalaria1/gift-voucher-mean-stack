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
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { ProductsService } from '../../../services/products.service';
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
  constructor(
    private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute
  ) { }
  private _productsService = inject(ProductsService)
  submitted: boolean = false;
  productData: any;
  currentProductId: any;
  currentImage: any;
  productImg: any;
  editGiftItemForm!: FormGroup;

  ngOnInit(): void {
    // accessing product id through params
    this.route.params.subscribe(
      (params: Params) => {
        console.log(params['id']);
        this.currentProductId = params['id']
        console.log(this.currentProductId)
      })
    // form
    this.editGiftItemForm = this.formBuilder.group({
      productTitle: ['', Validators.required],
      productDescription: [
        '',
        [Validators.required, Validators.maxLength(200)],
      ],
      couponCode: ['', Validators.required],
      productImage: ['', Validators.required],
    });
    this.getProduct()
  }

  getProduct() {
    this._productsService.getProductById(this.currentProductId).subscribe(
      (data: any) => {
        console.log('get request is successfull', data)
        this.productData = data;
        this.editGiftItemForm.patchValue({
          productTitle: this.productData.productTitle,
          productDescription: this.productData.productDescription,
          couponCode: this.productData.couponCode,
          productImage: this.productData.productImg,
        })
      }
    )
  }
  // update reward button
  onSubmit() : void{
    this.submitted = true;
    if (this.editGiftItemForm.valid) {
      const payload={
        productTitle:this.editGiftItemForm.value.productTitle,
        productDescription:this.editGiftItemForm.value.productDescription,
        couponCode:this.editGiftItemForm.value.couponCode,
        productImg:this.editGiftItemForm.value.productImage
      };
      this._productsService.updateProduct(this.currentProductId, payload).subscribe(
        (response) => {
          console.log('Post updated:', response);
          this.router.navigate(['/admin/gift-inventory']);
          // Show success snackbar
          this.snackBar.open('You have successfully updated the reward!.', 'close', {
            duration: 5000,
            panelClass: ['snackbar-success'],
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        },
        (error) => {
          console.error('Error checking coupon code:', error);
        }
      )
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
    this._productsService.uploadProductImage(formData).subscribe(
      (response) => {
        this.currentImage = response.imageUrl
        this.productImg = response.fileDetails._id
        this.editGiftItemForm.patchValue({
          productImage: response.fileDetails.fileName
        })
      }
    )
  }

  // deleting image
  removeImage() {
    this.selectedFiles = '';
    this.editGiftItemForm.get('productImage')?.setValue('');
  }
}
