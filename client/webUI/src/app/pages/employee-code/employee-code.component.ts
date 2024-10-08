import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


@Component({
  selector: 'app-employee-code',
  standalone: true,
  imports: [MatButtonModule,MatIconModule,FormsModule,MatInputModule,MatFormFieldModule],
  templateUrl: './employee-code.component.html',
  styleUrl: './employee-code.component.css'
})
export class EmployeeCodeComponent {
}
