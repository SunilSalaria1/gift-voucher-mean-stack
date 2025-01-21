import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { EmployeeFooterComponent } from '../../../shared/employee-footer/employee-footer.component';
import { EmployeeHeaderComponent } from '../../../shared/employee-header/employee-header.component';

@Component({
  selector: 'app-reward-claimed',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatCardModule,RouterLink,EmployeeFooterComponent,EmployeeHeaderComponent],
  templateUrl: './reward-claimed.component.html',
  styleUrl: './reward-claimed.component.css'
})
export class RewardClaimedComponent {

}
