import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../../services/users.service';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatCardModule, MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatPaginator, MatPaginatorModule,
    MatDialogModule,
    MatTableModule,
    RouterLink,
    CommonModule ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent{
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
      this._usersService.getAllAdmins().subscribe(
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
      this._usersService.createAdmin(payload).subscribe({
        next: (response) => {
          console.log("access granted :", response)
        },
        error: (error) => {
          console.error('error while granting admin access:', error);
        }
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
    // matDelete() {
    //   this._usersService.deleteUser(this.selectedEmpId).subscribe(
    //     (data: any) => {
    //       console.log('delete request is successfull', data)
    //     })
    //   // Remove the deleted user from the table
    //   this.userData = this.userData.filter(user => user._id !== this.selectedEmpId);
    //   this.dataSource.data = [...this.userData];
  
    //   // Show success snackbar
    //   this.snackBar.open('You have successfully deleted the reward!.', 'close', {
    //     duration: 5000,
    //     panelClass: ['snackbar-success'],
    //     horizontalPosition: "center",
    //     verticalPosition: "top",
    //   });
    // }
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