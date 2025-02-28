import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { DashboardComponent } from '../../pages/admin/dashboard/dashboard.component';
import { GiftInventoryComponent } from '../../pages/admin/gift-inventory/gift-inventory.component';
import { EmployeePicksComponent } from '../../pages/admin/employee-picks/employee-picks.component';
import {GenerateEmpCodeComponent } from '../../pages/admin/generate-emp-code/generate-emp-code.component';
import { FeedbackComponent } from '../../pages/admin/feedback/feedback.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventsComponent } from '../../pages/admin/events/events.component';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [RouterLink,DashboardComponent,EventsComponent,GiftInventoryComponent,EmployeePicksComponent,GenerateEmpCodeComponent,FeedbackComponent,MatIconModule,CommonModule,RouterModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {
  @Input() isSidebarOpen = true;
}
