import { Component, inject } from '@angular/core';
import { EmployeeHeaderComponent } from '../../../shared/employee-header/employee-header.component';
import { EmployeeFooterComponent } from '../../../shared/employee-footer/employee-footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { ProductsService } from '../../../services/products.service';
import { UsersService } from '../../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-selected-gift-details',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, EmployeeHeaderComponent, EmployeeFooterComponent, MatCardModule],
  templateUrl: './selected-gift-details.component.html',
  styleUrl: './selected-gift-details.component.css'
})
export class SelectedGiftDetailsComponent {
  constructor(private snackBar: MatSnackBar, private router: Router) { }
  private _productsService = inject(ProductsService);
  private _usersService = inject(UsersService)
  userData: any = localStorage.getItem('loginUser');
  user: any = JSON.parse(this.userData);
  productId: any = this.user?.productId;
  product: any = {};

  ngOnInit() {
    this.getProducts()
    console.log(this.productId)
  }

// get claimed gift
  getProducts() {
    this._productsService.getProductById(this.productId).subscribe(
      (response) => {
        this.product = response;
        console.log(this.product);
      },
      (error) => {
        console.log(error, "error getting products")
      }
    )
  }

  // back to home
  logOut() {
    this._usersService.logout();
    this.router.navigateByUrl('/home')
    //success snackbar
    this.snackBar.open('You have successfully logged out.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }

}
