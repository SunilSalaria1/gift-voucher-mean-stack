import {
  Component,
  inject,
  TemplateRef,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { trigger, style, animate, transition } from '@angular/animations';
import { UsersService } from '../../../services/users.service';

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
export class GenerateEmpCodeComponent implements AfterViewInit {
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute) { }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  readonly dialog = inject(MatDialog);
  private _usersService = inject(UsersService)
  userData: any[] = [];
  selectedEmpId: string | null = null;
  // Create a map to store copied state for each coupon code
  copiedMap = new Map<string, boolean>();

  // ngOnInIt
  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>([]); // Initialize with an empty array
    this._usersService.getUser().subscribe(
      (data) => {
        this.userData = data; // Set data here
        console.log(this.userData)
        this.dataSource.data = this.userData;
      },
      (error) => {
        console.error('Error fetching posts', error);
      }
    );
  }

  // dialog box
  openDialog(id:string): void {
    this.selectedEmpId=id;
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

