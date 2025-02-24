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
  imageUrl: any;
  productImageId: any;
  editGiftItemForm!: FormGroup;
  displayFileName: string = '';
  

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
      // productImage: ['', Validators.required],
    });
    this.getProduct()
  }

  // getProduct() {
  //   this._productsService.getProductById(this.currentProductId).subscribe(
  //     (data: any) => {
  //       console.log('get request is successfull', data)
  //       this.productData = data;
  //       this.currentImage = this.productData.productImageDetails.imageUrl
  //       this.editGiftItemForm.patchValue({
  //         productTitle: this.productData.productTitle,
  //         productDescription: this.productData.productDescription,
  //         couponCode: this.productData.couponCode,
  //         // productImage: this.productData.productImageDetails.fileName,
  //       })
  //     }
  //   )
  // }
  getProduct() {
    this._productsService.getProductById(this.currentProductId).subscribe(
      (data: any) => {
        console.log('get request is successfull', data);
        this.productData = data;
        this.imageUrl = this.productData.productImageDetails.imageUrl;
        // Store the filename in the component property
        this.displayFileName = this.productData.productImageDetails.fileName;
        this.productImageId=this.productData.productImageDetails._id
        this.editGiftItemForm.patchValue({
          productTitle: this.productData.productTitle,
          productDescription: this.productData.productDescription,
          couponCode: this.productData.couponCode,
        });
      }
    );
  }
  // update reward button
  onSubmit(): void {
    this.submitted = true;
    if (this.editGiftItemForm.valid) {
      const payload = {
        productTitle: this.editGiftItemForm.value.productTitle,
        productDescription: this.editGiftItemForm.value.productDescription,
        couponCode: this.editGiftItemForm.value.couponCode,
        productImageId: this.productImageId
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
          console.error('Error updating the reward', error);
        }
      )
    }
  }
  // selecting image
  selectedFiles: any;
  selectFiles(event: any): void {
    this.selectedFiles = event.target.files[0];
    if (this.selectedFiles) {
      this.uploadImage(this.selectedFiles);
       
    }
  }
  // image upload to api
  // uploadImage(file: File) {
  //   const formData = new FormData()
  //   formData.append('file', file, file.name)
  //   this._productsService.uploadProductImage(formData).subscribe(
  //     (response) => {
  //       this.currentImage = response.imageUrl
  //       this.productImgId = response.fileDetails._id
  //       this.editGiftItemForm.patchValue({
  //         productImage: response.fileDetails.fileName
  //       })
  //     }
  //   )
  // }

  uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file, file.name)
    this._productsService.uploadProductImage(formData).subscribe(
      (response) => {
        this.imageUrl = response.imageUrl;
        this.productImageId = response.fileDetails._id;
        this.displayFileName = response.fileDetails.fileName;
      }
    )
  }

  // deleting image
  // removeImage() {
  //   this.selectedFiles = null;
  //   this.currentImage = null;
  //   this.productImgId = null;
  // }
  // removeImage() {
  //   this.selectedFiles = null;
  //   this.imageUrl = null;
  //   this.productImgId = null;
  //   this.displayFileName = '';
    
  // }
}
