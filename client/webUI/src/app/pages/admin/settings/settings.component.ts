import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../../services/users.service';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatPaginator,
    MatPaginatorModule,
    MatDialogModule,
    MatTableModule,
    RouterLink,
    CommonModule,
    ClipboardModule,
    MatTooltipModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
    });
  }
  readonly dialog = inject(MatDialog);
  private _usersService = inject(UsersService);
  userData: any[] = [];
  selectedEmpId: string | null = null;
  searchForm: FormGroup;
  totalPages = 0;
  currentPage = 1;
  totalUsers: number;
  pageSize: number = 10;
  role = 'admin';
  // Create a map to store copied state for each coupon code
  copiedMap = new Map<string, boolean>();
  // ngOnInIt
  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>([]); // Initialize with an empty array
    this.loadUsers(this.currentPage, this.pageSize, this.searchForm.value);
    this.searchForm
      .get('searchTerm')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.loadUsers(this.currentPage, this.pageSize, searchTerm);
      });
  }

  loadUsers(
    page: number,
    limit: number,
    searchTerm: any,
    sortBy: string = '',
    role = this.role
  ) {
    this._usersService
      .getUsers(page, limit, searchTerm, sortBy, role)
      .subscribe(
        (data) => {
          // Assuming data has a structure like { users: [], totalPages: number, currentPage: number, totalUsers: number }
          this.userData = data.users.sort(
            (a, b) => b.isPrimaryAdmin - a.isPrimaryAdmin
          ); // Sort the array
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;
          this.totalUsers = data.totalUsers;
          this.dataSource.data = this.userData;
        },
        (error) => {
          console.error('Error fetching admin', error);
        }
      );
  }

  onPageChange(event: PageEvent) {
    console.log(event, 'kkkk');
    this.currentPage = event.pageIndex + 1; // MatPaginator uses 0-based index
    this.pageSize = event.pageSize;
    this.totalUsers = event.length;
    this.loadUsers(this.currentPage, this.pageSize, this.searchForm.value); // Fetch data for the new page
  }

  // dialog box
  openDialog(element: any): void {
    // Check if the user is a primary admin
    if (element.isPrimaryAdmin === true) {
      console.log('Primary admin cannot be deleted');
      return;
    }
    this.selectedEmpId = element._id;
    // Use the TemplateRef for the dialog
    const dialogRef = this.dialog.open(this.dialogTemplate);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  matDelete() {
    let payload: any;
    let id = this.selectedEmpId;
    payload = {
      isAdmin: false,
    };
    this._usersService
      .createAdminRemoveAdmin(id, payload)
      .subscribe((data: any) => {
        console.log('delete request is successfull', data);
      });
    // Remove the deleted user from the table
    this.userData = this.userData.filter(
      (user) => user._id !== this.selectedEmpId
    );
    this.dataSource.data = [...this.userData];
    // Show success snackbar
    this.snackBar.open('You have successfully deleted the admin!.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  // this is for the filter the table data
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // displaying table headings
  displayedColumns: string[] = [
    'position',
    'name',
    'adminCode',
    'adminKey',
    'email',
    'department',
    'dob',
    'joiningDate',
    'Action',
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  // copy
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
  employeeCode: string;
  name: string;
  department: string;
  dob: string;
  joiningDate: string;
  email: string;
}
