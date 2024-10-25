import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { DashboardComponent } from '../../pages/admin/dashboard/dashboard.component';
import { GiftInventoryComponent } from '../../pages/admin/gift-inventory/gift-inventory.component';
import { EmployeePicksComponent } from '../../pages/admin/employee-picks/employee-picks.component';
import { ProductReportsComponent } from '../../pages/admin/product-reports/product-reports.component';
import { SettingsComponent } from '../../pages/admin/settings/settings.component';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [RouterLink,DashboardComponent,GiftInventoryComponent,EmployeePicksComponent,ProductReportsComponent,SettingsComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {

}
