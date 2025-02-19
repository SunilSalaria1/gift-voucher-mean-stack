import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Color, LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { UsersService } from '../../../services/users.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatTabsModule, NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private _productsService = inject(ProductsService)
  totalEmployees: any;
  userData: any;
  totalProducts: any;
  employeesPickedGift: any;
  employeesDidNotPickedGift: any
  pickedPercentage:any;
  notPickedPercentage:any;
  pieChartData:any;
  currentPage: any;
  pageSize: any;
  // pie chart
  view: [number, number] = [700, 400];
  ngOnInit() {
    this.loadEmployeePicks(this.currentPage, this.pageSize)
  }
  loadEmployeePicks(page: number, limit: number, searchTerm: string = '', sortBy: string = '') {
    this._productsService.employeePicks(page, limit, searchTerm, sortBy).subscribe
      (data => {
        this.userData = data.giftInventoryData;
        this.totalEmployees = data.totalUsers;
        this.totalProducts = data.totalProducts;
        this.employeesPickedGift = data.usersPickedGift;
        this.employeesDidNotPickedGift = data.userDidNotPickedGift;
        console.log(data)
        // Calculate percentages
      this.pickedPercentage = this.totalEmployees ? (this.employeesPickedGift / this.totalEmployees) * 100 : 0;
      this.notPickedPercentage = this.totalEmployees ? (this.employeesDidNotPickedGift / this.totalEmployees) * 100 : 0;
      // pie chart
  this.pieChartData = [
    {
      "name": `Completed (${this.pickedPercentage.toFixed(1)}%)`,
      "value": this.pickedPercentage
    },
    {
      "name": `Pending (${this.notPickedPercentage.toFixed(1)}%)`,
      "value": this.notPickedPercentage
    },
  ];
      }, error => console.error('Error fetching users', error));
  }

  formatLabel(value: any): string {
    return `${value.toFixed(1)}%`;
  }

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Right;

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor() {
    Object.assign(this, { pieChartData: this.pieChartData });
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
