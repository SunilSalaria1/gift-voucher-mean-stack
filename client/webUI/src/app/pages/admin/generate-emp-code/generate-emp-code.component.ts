import {
  Component,
  inject,
  TemplateRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
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
import { ClipboardModule } from '@angular/cdk/clipboard';
import { trigger, style, animate, transition } from '@angular/animations';
import { UsersService } from '../../../services/users.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-generate-emp-code',
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
    ClipboardModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './generate-emp-code.component.html',
  styleUrl: './generate-emp-code.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        animate(
          '200ms ease-in',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-out',
          style({ opacity: 0, transform: 'translateY(-5px)' })
        ),
      ]),
    ]),
  ],
})
export class GenerateEmpCodeComponent {
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
  isLoading = false; // To track loading state

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

  loadUsers(page: number, limit: number, searchTerm: any, sortBy: string = '') {
    this.isLoading = true; // Show spinner before API call starts
    this._usersService.getUsers(page, limit, searchTerm, sortBy).subscribe(
      (data) => {
        this.userData = data.users;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
        this.totalUsers = data.totalUsers;
        this.dataSource.data = this.userData;
        console.log(data, this.totalUsers);
        this.isLoading = false; // Hide spinner after data is received
      },
      (error) => {
        console.error('Error fetching users', error);
        this.isLoading = false; // Hide spinner even if there is an error
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

  index(i: number): number {
    return (this.currentPage - 1) * this.pageSize + i + 1;
  }

  // Admin toggle
  onAdminToggleChange(selectedValue: string, employeeId: any) {
    let payload: any;
    let id: any;
    if (selectedValue === 'yes') {
      id = employeeId;
      payload = {
        isAdmin: true,
      };
    } else if (selectedValue === 'no') {
      id = employeeId;
      payload = {
        isAdmin: false,
      };
    }
    console.log(payload);
    this._usersService.createAdminRemoveAdmin(id, payload).subscribe(
      (response) => {
        console.log('access granted :', response);
        // Show success snackbar
    this.snackBar.open('You have successfully changed the admin status!.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
      },
      (error) => {
        console.error('error while granting admin access:', error);
      }
    );
  }

  // dialog box
  openDialog(id: string): void {
    this.selectedEmpId = id;
    // Use the TemplateRef for the dialog
    const dialogRef = this.dialog.open(this.dialogTemplate);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  matDelete() {
    this._usersService.deleteUser(this.selectedEmpId).subscribe((data: any) => {
      console.log('delete request is successfull', data);
    });
    // Remove the deleted user from the table
    this.userData = this.userData.filter(
      (user) => user._id !== this.selectedEmpId
    );
    this.dataSource.data = [...this.userData];

    // Show success snackbar
    this.snackBar.open('You have successfully deleted the reward!.', 'close', {
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
    'employeeCode',
    'email',
    'department',
    'dob',
    'joiningDate',
    'isAdmin',
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
