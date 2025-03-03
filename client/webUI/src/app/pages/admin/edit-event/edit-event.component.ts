import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EventsService } from '../../../services/events.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    MatCardModule,
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
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css',
})
export class EditEventComponent {
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private productsService: ProductsService
  ) {}
  currentEventId: any;

  addEventForm!: FormGroup;
  eventImage: any;
  imageId: any;
  submitted: boolean = false;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      console.log(params['id']);
      this.currentEventId = params['id'];
      console.log(
        '@@@@@@@@@@@@@@@',
        typeof this.currentEventId,
        this.currentEventId
      );
    });
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
    this.getUser();
  }
  getUser() {
    this.eventsService
      .getEventById(this.currentEventId)
      .subscribe((data: any) => {
        console.log('get request is successfull', data);
        
        // this.addEventForm.patchValue({
        //   name: data.name,
        //   date: data.date,
        //   time: data.time ,
        //   image: data.image,
        //   address: data.,
        //   note: data.,
        //   attend: data.,
        //   about: data.,
        // })
        // console.log("Patched department value:", this.addEventForm.value.department);
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
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.productsService.uploadProductImage(formData).subscribe((response) => {
      this.eventImage = response.imageUrl;
      this.imageId = response.fileDetails._id;
      this.addEventForm.patchValue({
        productImage: response.fileDetails.fileName,
      });
    });
  }

  // deleting image
  removeImage() {
    this.selectedFiles = '';
    this.addEventForm.get('eventImage')?.setValue('');
  }
  submitForm(): void {
    this.submitted = true;
    if (this.addEventForm.valid) {
      const payload = {
        title: this.addEventForm.value.name,
        imageId: this.imageId,
        about: this.addEventForm.value.about,
        address: this.addEventForm.value.address,
        date: this.addEventForm.value.date,
        time: this.addEventForm.value.time,
        note: this.addEventForm.value.note,
        whyYouAttend: this.addEventForm.value.attend,
      };
      this.eventsService.addEvent(payload).subscribe((response) => {
        this.router.navigate(['/admin/events']);
        // Show success snackbar
        this.snackBar.open(
          'You have successfully created an event!.',
          'close',
          {
            duration: 5000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
      });
    }
  }
}
