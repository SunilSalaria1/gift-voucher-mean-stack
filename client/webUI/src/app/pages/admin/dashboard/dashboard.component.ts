import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import {
  Color,
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';
import { UsersService } from '../../../services/users.service';
import { ProductsService } from '../../../services/products.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    NgxChartsModule,
    ScrollingModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private _productsService = inject(ProductsService);
  loggedUserData: any = localStorage.getItem('loginUser');
  loggedUser: any = JSON.parse(this.loggedUserData);
  totalEmployees: any;
  userData: any;
  productData: any[] = [];
  totalProducts: any;
  employeesPickedGift: any;
  employeesDidNotPickedGift: any;
  pickedPercentage: any;
  notPickedPercentage: any;
  pieChartData: any;
  currentPage: any;
  pageSize: any;
  isLoading = false; // To track loading state
  productsLoading = false;
  allProductsLoaded = false; // Flag to stop loading when no more data
  // pie chart
  view: [number, number] = [700, 400];
  ngOnInit() {
    // this.loadEmployeePicks(this.currentPage, this.pageSize);
    this.loadProducts(this.currentPage, this.pageSize);
  }

  // gift api
  // loadEmployeePicks(
  //   page: number,
  //   limit: number,
  //   searchTerm?: string,
  //   sortBy: string = ''
  // ) {
  //   this._productsService
  //     .employeePicks(page, limit, searchTerm, sortBy)
  //     .subscribe(
  //       (data) => {
  //         this.userData = data.giftInventoryData;
  //         this.totalEmployees = data.totalUsers;
  //         this.totalProducts = data.totalProducts;
  //         this.employeesPickedGift = data.usersPickedGift;
  //         this.employeesDidNotPickedGift = data.userDidNotPickedGift;
  //         console.log(data);
  //         // Calculate percentages
  //         this.pickedPercentage = this.totalEmployees
  //           ? (this.employeesPickedGift / this.totalEmployees) * 100
  //           : 0;
  //         this.notPickedPercentage = this.totalEmployees
  //           ? (this.employeesDidNotPickedGift / this.totalEmployees) * 100
  //           : 0;
  //         // pie chart
  //         this.pieChartData = [
  //           {
  //             name: `Completed (${this.pickedPercentage.toFixed(1)}%)`,
  //             value: this.pickedPercentage,
  //           },
  //           {
  //             name: `Pending (${this.notPickedPercentage.toFixed(1)}%)`,
  //             value: this.notPickedPercentage,
  //           },
  //         ];
  //       },
  //       (error) => console.error('Error fetching users', error)
  //     );
  // }

  // products api

  loadProducts(
    page: number,
    limit: number,
    searchTerm?: any,
    sortBy: string = ''
  ) {
    
    if (this.productsLoading || this.allProductsLoaded) return;   
    this.productsLoading = true;
    this.isLoading = true; // Show spinner before API call starts
    this._productsService
      .getProducts(page, limit, { searchTerm: '' }, sortBy)
      .subscribe(
        (data) => {
          const products = data.products ?? []; // Ensure products is always an array
          this.totalEmployees = data.totalUsers;
          this.totalProducts = data.totalProducts;
          this.employeesPickedGift = data.usersPickedGift;
          this.employeesDidNotPickedGift = data.userDidNotPickedGift;
          this.pickedPercentage = this.totalEmployees
            ? (this.employeesPickedGift / this.totalEmployees) * 100
            : 0;
          this.notPickedPercentage = this.totalEmployees
            ? (this.employeesDidNotPickedGift / this.totalEmployees) * 100
            : 0;
          // pie chart
          this.pieChartData = [
            {
              name: `Completed (${this.pickedPercentage.toFixed(1)}%)`,
              value: this.pickedPercentage,
            },
            {
              name: `Pending (${this.notPickedPercentage.toFixed(1)}%)`,
              value: this.notPickedPercentage,
            },
          ];
          this.isLoading = false; // Hide spinner after data is received
          if (products.length === 0) {
            this.allProductsLoaded = true;
          } else {
            console.log('Before Update:', this.productData);
            this.productData = [...this.productData, ...products]; // Append new data
            console.log('Updated productData:', this.productData);
            this.currentPage++; // Increment page number
          }          
        },
        (error) =>{
          console.error('Error fetching users', error)
          this.isLoading = false; // Hide spinner after data is received
        }
      );
  }

  // Triggered when user scrolls near the end of the product list
  onScrollProducts() {
    if (!this.productsLoading && !this.allProductsLoaded) {
      this.loadProducts(this.currentPage, this.pageSize);
    }
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
