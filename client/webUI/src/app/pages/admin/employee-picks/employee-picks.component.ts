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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClipboardModule } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-employee-picks',
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
    MatProgressSpinnerModule,
    ClipboardModule,
  ],
  templateUrl: './employee-picks.component.html',
  styleUrl: './employee-picks.component.css',
})
export class EmployeePicksComponent {
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  constructor(private snackBar: MatSnackBar, private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
    });
  }
  readonly dialog = inject(MatDialog);
  private _productsService = inject(ProductsService);
  searchForm: FormGroup;
  userData: any[] = [];
  totalPages = 0;
  currentPage = 1;
  totalUsers: number;
  pageSize: number = 10;
  selectedEmpId: string | null = null;
  isLoading = false; // To track loading state

  // Create a map to store copied state for each coupon code
  copiedMap = new Map<string, boolean>();

  // ngOnInIt
  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>([]); // Initialize with an empty array
    this.loadEmployeePicks(
      this.currentPage,
      this.pageSize,
      this.searchForm.value
    );
    this.searchForm
      .get('searchTerm')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.loadEmployeePicks(this.currentPage, this.pageSize, searchTerm);
      });
  }

  loadEmployeePicks(
    page: number,
    limit: number,
    searchTerm: any,
    sortBy: string = ''
  ) {
    this.isLoading = true; // Show spinner before API call starts
    this._productsService
      .employeePicks(page, limit, searchTerm, sortBy)
      .subscribe(
        (data) => {
          this.userData = data.giftInventoryData;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;
          this.totalUsers = data.totalUsers;
          this.dataSource.data = this.userData;
          console.log(data, this.totalUsers);
          this.isLoading = false; // Hide spinner after data is received
        },
        (error) => {
          console.error('Error fetching users', error);
          this.isLoading = false;
        }
      );
  }

  onPageChange(event: PageEvent) {
    console.log(event, 'kkkk');
    this.currentPage = event.pageIndex + 1; // MatPaginator uses 0-based index
    this.pageSize = event.pageSize;
    this.totalUsers = event.length;
    this.loadEmployeePicks(
      this.currentPage,
      this.pageSize,
      this.searchForm.value
    ); // Fetch data for the new page
  }

  index(i: number): number {
    return (this.currentPage - 1) * this.pageSize + i + 1;
  }

  openDialog(id: string): void {
    this.selectedEmpId = id;
    // Use the TemplateRef for the dialog
    const dialogRef = this.dialog.open(this.dialogTemplate);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  matDelete() {
    this._productsService
      .deleteUser(this.selectedEmpId)
      .subscribe((data: any) => {
        console.log('delete request is successfull', data);
        // Remove the deleted user from the table
        this.userData = this.userData.filter(
          (user) => user._id !== this.selectedEmpId
        );
        this.loadEmployeePicks(
          this.currentPage,
          this.pageSize,
          this.searchForm.value
        );
        this.dataSource.data = [...this.userData];

        // Show success snackbar
        this.snackBar.open(
          'You have successfully deleted the gift pick!.',
          'close',
          {
            duration: 5000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
      });
  }
  // this is for the filter the table data
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayedColumns: string[] = [
    'position',
    'employeeName',
    'employeeCode',
    'employeeDepartment',
    'status',
    'couponCode',
    'productTitle',
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


export interface EmployeePick {
  _id: string;
  name: string;
  department: string;
  employeeCode: string;
  isPicked: boolean;
  productDetails: {
    couponCode: string;
    productTitle: string;
    imageUrl: string; // Assuming this exists in the full response
  };
}
