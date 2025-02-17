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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-generate-emp-code',
  standalone: true,
  imports: [CommonModule,
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

  ],
  templateUrl: './generate-emp-code.component.html',
  styleUrl: './generate-emp-code.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        animate('200ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-5px)' }))
      ])
    ])
  ]
})
export class GenerateEmpCodeComponent {
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute,private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      searchTerm: ['']
    });
   }
   private cdr= inject(ChangeDetectorRef)
  // ngAfterViewInit(): void {
  //   this.dataSource.paginator = this.paginator;
  // }
  readonly dialog = inject(MatDialog);
  private _usersService = inject(UsersService)
  userData: any[] = [];
  selectedEmpId: string | null = null;
  searchForm: FormGroup;
  totalPages = 0;
  currentPage = 1;
  totalUsers:number;
  pageSize:number=10;

  // Create a map to store copied state for each coupon code
  copiedMap = new Map<string, boolean>();

  // ngOnInIt
  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>([]); // Initialize with an empty array
    this.loadUsers(this.currentPage,this.pageSize,this.searchForm.value)
    this.searchForm.get('searchTerm')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.loadUsers(this.currentPage, this.pageSize, searchTerm);
    });
  }

  

  loadUsers(page: number , limit: number , searchTerm: string = '', sortBy: string = '') {
    this._usersService.getUsers(page, limit, searchTerm, sortBy).subscribe(data => {
    
      this.userData = data.users;
      this.totalPages = data.totalPages;
      this.currentPage = data.currentPage;
      this.totalUsers = data.totalUsers;
      this.dataSource.data = this.userData;
      console.log(data, this.totalUsers)

    }, error => console.error('Error fetching users', error));
  }

  onPageChange(event: PageEvent) {
    console.log(event,'kkkk')
    this.currentPage = event.pageIndex + 1; // MatPaginator uses 0-based index    
    this.pageSize = event.pageSize;
    this.totalUsers= event.length;
    this.loadUsers(this.currentPage,this.pageSize,this.searchForm.value); // Fetch data for the new page          
  }
  
  // Admin toggle
  onAdminToggleChange(selectedValue: string, employeeId: any) {
    let payload: any;
    if (selectedValue === 'yes') {
      payload = {
        id: employeeId,
        isAdmin: "true"
      }
    }else if(selectedValue === 'no'){
      payload = {
        id: employeeId,
        isAdmin: "false"
      }
    }    
    console.log(payload)
    this._usersService.createAdminRemoveAdmin(payload).subscribe(
     (response) => {
        console.log("access granted :", response)
      },
      (error) => {
        console.error('error while granting admin access:', error);
      }    
    )
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
    this._usersService.deleteUser(this.selectedEmpId).subscribe(
      (data: any) => {
        console.log('delete request is successfull', data)
      })
    // Remove the deleted user from the table
    this.userData = this.userData.filter(user => user._id !== this.selectedEmpId);
    this.dataSource.data = [...this.userData];

    // Show success snackbar
    this.snackBar.open('You have successfully deleted the reward!.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: "center",
      verticalPosition: "top",
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
    'empCode',
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
  copied(empCode: string) {
    // Set copied state to true for this couponCode
    this.copiedMap.set(empCode, true);
    setTimeout(() => {
      this.copiedMap.set(empCode, false);
    }, 1500);
  }

}
export interface PeriodicElement {
  position: number;
  empCode: string;
  name: string;
  department: string;
  dob: string;
  joiningDate: string;
  email: string;
}

