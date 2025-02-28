import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ProductsService } from '../../../services/products.service';
@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [MatCardModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    RouterLink,
    NgxMaterialTimepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.css'
})
export class AddEventComponent {
  constructor(
    private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router,private productsService: ProductsService
  ) { }
  addEventForm!: FormGroup;
  eventImage: any;
  imageId: any; 

  ngOnInit(): void {
    // form
    this.addEventForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      image: ['', Validators.required],
      address: ['', Validators.required],
      note: '',
      attend: '',
      about: ['', Validators.required],
    });
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
        this.eventImage = response.imageUrl
        this.imageId = response.fileDetails._id
        this.addEventForm.patchValue({
          productImage: response.fileDetails.fileName
        })
      }
    )
  }

  // deleting image
  removeImage() {
    this.selectedFiles = '';
    this.addEventForm.get('eventImage')?.setValue('');
  }
  submitForm(): void { 
  }



}
