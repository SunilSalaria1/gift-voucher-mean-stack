import {
  AfterViewInit,
  Component,
  inject,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsService } from '../../../services/products.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-gift-inventory',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    ClipboardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './gift-inventory.component.html',
  styleUrl: './gift-inventory.component.css',
})
export class GiftInventoryComponent {
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  constructor(private snackBar: MatSnackBar, private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
    });
  }
  private _productsService = inject(ProductsService);
  readonly dialog = inject(MatDialog);
  // Create a map to store copied state for each coupon code
  copiedMap = new Map<string, boolean>();

  products: any[] = [];
  selectedProductId: string | null = null;
  searchForm: FormGroup;
  totalPages = 0;
  currentPage = 1;
  totalUsers: number;
  pageSize: number = 10;
  isLoading = false; // To track loading state

  // ngOnInIt
  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>([]); // Initialize with an empty array
    this.loadUsers(this.currentPage, this.pageSize, this.searchForm.value);
    // search
    this.searchForm
      .get('searchTerm')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.loadUsers(this.currentPage, this.pageSize, searchTerm);
      });
  }

  // get products
  loadUsers(page: number, limit: number, searchTerm: any, sortBy: string = '') {
    this.isLoading = true; // Show spinner before API call starts
    this._productsService
      .getProducts(page, limit, searchTerm, sortBy)
      .subscribe(
        (data) => {
          this.products = data.products;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;
          this.totalUsers = data.totalProducts;
          this.dataSource.data = this.products;
          console.log(data, this.totalUsers);
          this.isLoading = false; // Hide spinner after data is received
        },
        (error) => {
          console.error('Error fetching users', error);
          this.isLoading = false; // Hide spinner after data is received
        }
      );
  }

  // onPageChange
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1; // MatPaginator uses 0-based index
    this.pageSize = event.pageSize;
    this.totalUsers = event.length;
    this.loadUsers(this.currentPage, this.pageSize, this.searchForm.value); // Fetch data for the new page
  }

  index(i: number): number {
    return (this.currentPage - 1) * this.pageSize + i + 1;
  }

  // dialog box
  openDialog(id: string): void {
    this.selectedProductId = id;
    // Use the TemplateRef for the dialog
    const dialogRef = this.dialog.open(this.dialogTemplate);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  //delete
  matDelete() {
    this._productsService
      .deleteProduct(this.selectedProductId)
      .subscribe((data: any) => {
        console.log('delete request is successfull', data);
      });
    // Remove the deleted user from the table
    this.products = this.products.filter(
      (product) => product._id !== this.selectedProductId
    );
    this.dataSource.data = [...this.products];
    // Show success snackbar
    this.snackBar.open('You have successfully deleted the reward!.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  // this is for filtering the table data
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // displaying columns
  displayedColumns: string[] = [
    'position',
    'couponCode',
    'productTitle',
    'productDescription',
    'productImage',
    'Action',
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  // Method to handle copying
  copied(employeeCode: string) {
    // Set copied state to true for this couponCode
    this.copiedMap.set(employeeCode, true);
    setTimeout(() => {
      this.copiedMap.set(employeeCode, false);
    }, 1500);
  }
}

export interface PeriodicElement {
  position: number;
  couponCode: string;
  productTitle: string;
  productDescription: string;
  productImage: string;
}
