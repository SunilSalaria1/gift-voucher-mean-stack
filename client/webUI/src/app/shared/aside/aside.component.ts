import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { DashboardComponent } from '../../pages/admin/dashboard/dashboard.component';
import { GiftInventoryComponent } from '../../pages/admin/gift-inventory/gift-inventory.component';
import { EmployeePicksComponent } from '../../pages/admin/employee-picks/employee-picks.component';
import { SettingsComponent } from '../../pages/admin/settings/settings.component';
import {GenerateEmpCodeComponent } from '../../pages/admin/generate-emp-code/generate-emp-code.component';
import { FeedbackComponent } from '../../pages/admin/feedback/feedback.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [RouterLink,DashboardComponent,GiftInventoryComponent,EmployeePicksComponent,SettingsComponent,GenerateEmpCodeComponent,FeedbackComponent,MatIconModule,CommonModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {
  @Input() isSidebarOpen = true;
}
