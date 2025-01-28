import {
  AfterViewInit,
  Component,
  inject,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-picks',
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
    MatButtonModule,],
  templateUrl: './employee-picks.component.html',
  styleUrl: './employee-picks.component.css'
})
export class EmployeePicksComponent implements AfterViewInit {
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  constructor(private snackBar: MatSnackBar) {}
  readonly dialog = inject(MatDialog);
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openDialog(): void {
    // Use the TemplateRef for the dialog
    const dialogRef = this.dialog.open(this.dialogTemplate);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  matDelete(){
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

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
}

export interface PeriodicElement {
  position: number;
  employeeName:string;
  employeeCode:string;
  employeeDepartment:string;
  status:string;
  couponCode: string;
  productTitle: string; 
  productImage: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    employeeName:'Jyoti',
    employeeCode:'LPEMPJFR3478',
    employeeDepartment:'Frontend',
    status:'completed',
    couponCode: 'CODE23873',
    productTitle: 'tile2345',    
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 2,
    employeeName:'Aniket',
    employeeCode:'LPEMPAFR1275',
    employeeDepartment:'Frontend',
    status:'completed',
    couponCode: 'CODE78094',
    productTitle: 'tile2345',    
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 3,
    employeeName:'Sushma',
    employeeCode:'LPEMPSFR6032',
    employeeDepartment:'Frontend',
    status:'pending',
    couponCode: 'CODE56037',
    productTitle: 'tile2345',   
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 4,
    employeeName:'kanchan',
    employeeCode:'LPEMPKFR1250',
    employeeDepartment:'Frontend',
    status:'completed',
    couponCode: 'CODE80462',
    productTitle: 'tile2345',    
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 5,
    employeeName:'Jyoti',
    employeeCode:'LPEMPJBCK1049',
    employeeDepartment:'Backend',
    status:'pending',
    couponCode: 'CODE56037',
    productTitle: 'tile2345',
    
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 6,
    employeeName:'Jyoti',
    employeeCode:'LPEMPJFR3478',
    employeeDepartment:'Frontend',
    status:'completed',
    couponCode: 'CODE23873',
    productTitle: 'tile2345',    
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 7,
    employeeName:'Aniket',
    employeeCode:'LPEMPAFR1275',
    employeeDepartment:'Frontend',
    status:'completed',
    couponCode: 'CODE78094',
    productTitle: 'tile2345',    
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 8,
    employeeName:'Sushma',
    employeeCode:'LPEMPSFR6032',
    employeeDepartment:'Frontend',
    status:'pending',
    couponCode: 'CODE56037',
    productTitle: 'tile2345',   
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 9,
    employeeName:'kanchan',
    employeeCode:'LPEMPKFR1250',
    employeeDepartment:'Frontend',
    status:'completed',
    couponCode: 'CODE80462',
    productTitle: 'tile2345',    
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 10,
    employeeName:'Jyoti',
    employeeCode:'LPEMPJBCK1049',
    employeeDepartment:'Backend',
    status:'pending',
    couponCode: 'CODE56037',
    productTitle: 'tile2345',    
    productImage: '/assets/images/banner-1.png',
  },
 
]
