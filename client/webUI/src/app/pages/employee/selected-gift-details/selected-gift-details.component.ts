import { Component } from '@angular/core';
import { EmployeeHeaderComponent } from '../../../shared/employee-header/employee-header.component';
import { EmployeeFooterComponent } from '../../../shared/employee-footer/employee-footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-selected-gift-details',
  standalone: true,
  imports: [MatButtonModule, MatIconModule,RouterLink,EmployeeHeaderComponent,EmployeeFooterComponent],
  templateUrl: './selected-gift-details.component.html',
  styleUrl: './selected-gift-details.component.css'
})
export class SelectedGiftDetailsComponent {

}
