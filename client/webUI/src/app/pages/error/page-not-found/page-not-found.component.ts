import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { EmployeeHeaderComponent } from '../../../shared/employee-header/employee-header.component';
import { EmployeeFooterComponent } from '../../../shared/employee-footer/employee-footer.component';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [MatButtonModule, MatIconModule,RouterLink,EmployeeHeaderComponent,EmployeeFooterComponent],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
  constructor(private location: Location,private router: Router) { }
//== go back btn
goBack(): void {
  this.location.back();
}
}
