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
    MatButtonModule,],
  templateUrl: './generate-emp-code.component.html',
  styleUrl: './generate-emp-code.component.css'
})
export class GenerateEmpCodeComponent implements AfterViewInit {
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
    'couponCode',
    'productTitle',
    'department',
    'productImage',
    'joiningDate',
    'Action',
  ];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
}

export interface PeriodicElement {
  position: number;
  couponCode: string;
  productTitle: string;
  department: string;
  productImage: string;
  joiningDate:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    couponCode: 'Hydrogen',
    productTitle: 'tile2345',
    department: 'Frontend',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'25/11/2021',
  },
  {
    position: 2,
    couponCode: 'Helium',
    productTitle: 'tile2345',
    department: 'Backend',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 3,
    couponCode: 'Lithium',
    productTitle: 'tile2345',
    department: 'HR',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'28/12/2023',
  },
  {
    position: 4,
    couponCode: 'Beryllium',
    productTitle: 'tile2345',
    department: 'Audit',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 5,
    couponCode: 'Boron',
    productTitle: 'tile2345',
    department: 'Bidding',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 6,
    couponCode: 'Carbon',
    productTitle: 'tile2345',
    department: 'Audit',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 7,
    couponCode: 'Nitrogen',
    productTitle: 'tile2345',
    department: 'HR',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 8,
    couponCode: 'Oxygen',
    productTitle: 'tile2345',
    department: 'Frontend',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 9,
    couponCode: 'Fluorine',
    productTitle: 'tile2345',
    department: 'Backend',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 10,
    couponCode: 'Neon',
    productTitle: 'tile2345',
    department: 'Frontend',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 11,
    couponCode: 'Sodium',
    productTitle: 'tile2345',
    department: 'Frontend',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 12,
    couponCode: 'Magnesium',
    productTitle: 'tile2345',
    department: 'Audit',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 13,
    couponCode: 'Aluminum',
    productTitle: 'tile2345',
    department: 'Audit',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 14,
    couponCode: 'Silicon',
    productTitle: 'tile2345',
    department: 'Audit',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 15,
    couponCode: 'Phosphorus',
    productTitle: 'tile2345',
    department: 'Bidding',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 16,
    couponCode: 'Sulfur',
    productTitle: 'tile2345',
    department: 'Bidding',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 17,
    couponCode: 'Chlorine',
    productTitle: 'tile2345',
    department: 'Bidding',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 18,
    couponCode: 'Argon',
    productTitle: 'tile2345',
    department: 'HR',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 19,
    couponCode: 'Potassium',
    productTitle: 'tile2345',
    department: 'HR',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
  {
    position: 20,
    couponCode: 'Calcium',
    productTitle: 'tile2345',
    department: 'HR',
    productImage: '/assets/images/banner-1.png',
    joiningDate:'26/12/2023',
  },
];
