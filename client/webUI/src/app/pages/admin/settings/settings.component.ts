import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatCardModule,MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule ,],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  addAdminForm!: FormGroup;
  constructor(
      private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
      // form
      this.addAdminForm = this.formBuilder.group({
        adminName: ['', Validators.required],
        adminKey: [
          '',
          [Validators.required],
        ],
        adminCode: ['', Validators.required],
       
      });
    }
}
