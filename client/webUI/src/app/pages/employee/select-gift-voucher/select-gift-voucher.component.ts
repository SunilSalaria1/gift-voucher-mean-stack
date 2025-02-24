import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { EmployeeFooterComponent } from '../../../shared/employee-footer/employee-footer.component';
import { EmployeeHeaderComponent } from '../../../shared/employee-header/employee-header.component';
import { ProductsService } from '../../../services/products.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-select-gift-voucher',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule, MatCardModule,MatProgressSpinnerModule, CommonModule, EmployeeFooterComponent, EmployeeHeaderComponent],
  templateUrl: './select-gift-voucher.component.html',
  styleUrls: ['./select-gift-voucher.component.css'],
  animations: [
    trigger('zoomInOut', [
      state('void', style({
        transform: 'scale(0)',  // Initially scale down (for closing)
        opacity: 0,             // Initially invisible
      })),
      state('in', style({
        transform: 'scale(1)',  // Scale up to normal size (for opening)
        opacity: 1,             // Fully visible
      })),
      transition('void => in', [
        animate('0.3s ease-out') // Animation for opening (zoom-out)
      ]),
      transition('in => void', [
        animate('0.3s ease-in')  // Animation for closing (zoom-in)
      ])
    ])
  ]
})


export class SelectGiftVoucherComponent {
  private _snackBar = inject(MatSnackBar);
  constructor(private snackBar: MatSnackBar, private router: Router) { }
  private _productsService = inject(ProductsService)
  products: any[];
  selectedProductId: any;
  userData: any = localStorage.getItem('loginUser');
  user: any = JSON.parse(this.userData);
  currentUserId: any = this.user?._id;
  currentPage: any;
  pageSize: any;
  isLoading = false; // To track loading state

  ngOnInit() {
    this.getProducts(this.currentPage, this.pageSize)
    console.log(this.currentUserId)
  }


  getProducts(page: number,
    limit: number,
    searchTerm?: any,
    sortBy: string = '') {
      this.isLoading = true; // Show spinner before API call starts
    this._productsService.getProducts(page, limit, { searchTerm: '' }, sortBy).subscribe(
      (response) => {
        this.products = response.products;
        console.log(this.products);
        this.isLoading = false; // Hide spinner after data is received
      },
      (error) => {
        console.log(error, "error getting products")
        this.isLoading = false; // Hide spinner after data is received
      }
    )
  }

  //active product card
  activeIndex: number | null = null;
  isConfirmVisible: boolean = false;
  zoomState = 'void';

  claimGiftBtn(index: number): void {
    this.activeIndex = index;
    this.isConfirmVisible = true
    // Trigger zoom-out animation (for opening)    
    this.zoomState = 'in';
    // Capturing the product ID
    this.selectedProductId = this.products[index]._id;
    console.log('Selected Product ID:', this.selectedProductId);
  }

  // notSelected
  notSelected() {
    console.log("dfdghfgn");
    this.isConfirmVisible = false
    // Close with zoom-in effect
    this.zoomState = 'void';
    // show error snackbar
    this.snackBar.open('Gift not selected. You can select another gift', 'close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }

  // selected
  selected() {
    if (this.user.role === "employee") {
      const payload = {
        isPicked: "true",
        productId: this.selectedProductId
      }
      this._productsService.giftPick(this.currentUserId, payload).subscribe(
        (response) => {
          console.log(response, "gift pick successfull")
          this.router.navigateByUrl("/reward-claimed")
          // show success snackbar
          this.snackBar.open('Enjoy your exclusive reward.', 'close', {
            duration: 5000,
            panelClass: ['snackbar-success'],
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        },
        (error) => {
          console.log(error, "error in gift pick");
        }
      )
    }

  }
}
