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

  editEventForm!: FormGroup;
  eventImage: any;
  imageId: any;
  submitted: boolean = false;
  displayFileName: string = '';
  whyYouAttendList: any; // Array to store multiple "Why You Attend" reasons

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
    this.editEventForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', Validators.required],
      city: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      imageId: [''],
      address: ['', Validators.required],
      note: '',
      whyYouAttend: '',
      about: ['', Validators.required],
    });
    this.getEvent();
  }
  getEvent() {
    this.eventsService
      .getEventById(this.currentEventId)
      .subscribe((data: any) => {
        console.log('get request is successfull', data);
        this.imageId = data.eventImageDetails._id;
        this.whyYouAttendList = data.whyYouAttend;
        this.displayFileName = data.eventImageDetails.fileName;

        this.editEventForm.patchValue({
          title: data.title,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          city: data.city,
          // imageId: data.eventImageDetails._id,
          address: data.address,
          note: data.note,
          about: data.about,
        });
        console.log(
          'Patched department value:',
          this.editEventForm.value.department
        );
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
      this.displayFileName = response.fileDetails.fileName;
    });
  }

  // Method to add a reason to the list
  addReason() {
    const reason = this.editEventForm.value.whyYouAttend.trim();
    if (reason) {
      this.whyYouAttendList.push(reason);
      this.editEventForm.patchValue({ whyYouAttend: '' }); // Clear input field
    }
  }

  // Remove reason from list
  removeReason(index: number) {
    this.whyYouAttendList.splice(index, 1);
  }

  // update event
  submitForm(): void {
    this.submitted = true;
    if (this.editEventForm.valid) {
      const formData = {
        ...this.editEventForm.value,
        whyYouAttend: this.whyYouAttendList,
        imageId: this.imageId, // Include the array of reasons
      };
      console.log(this.currentEventId);
      this.eventsService
        .updateEvent(this.currentEventId, formData)
        .subscribe((response) => {
          this.router.navigate(['/admin/events']);
          // Show success snackbar
          this.snackBar.open(
            'You have successfully updated an event!.',
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
