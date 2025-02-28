import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-events',
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
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  constructor(
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

  // dialog box
  openDialog(id: string): void {
    this.selectedEmpId = id;
    // Use the TemplateRef for the dialog
    const dialogRef = this.dialog.open(this.dialogTemplate);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
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
    'Action',
  ];

  dataSource = new MatTableDataSource<any>([]);



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


