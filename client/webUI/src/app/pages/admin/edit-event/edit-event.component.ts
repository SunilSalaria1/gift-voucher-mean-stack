import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent {
constructor(
    private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router,private eventsService: EventsService,private productsService: ProductsService
  ) { }

  
}
