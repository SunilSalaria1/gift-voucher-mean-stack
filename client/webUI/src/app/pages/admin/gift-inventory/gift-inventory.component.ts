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
  ],
  templateUrl: './gift-inventory.component.html',
  styleUrl: './gift-inventory.component.css',
})
export class GiftInventoryComponent implements AfterViewInit {
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
    'productDescription',
    'productImage',
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
  productDescription: string;
  productImage: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    couponCode: 'Hydrogen',
    productTitle: 'tile2345',
    productDescription: 'cvbHdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 2,
    couponCode: 'Helium',
    productTitle: 'tile2345',
    productDescription: 'Hedfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 3,
    couponCode: 'Lithium',
    productTitle: 'tile2345',
    productDescription: 'Lidfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 4,
    couponCode: 'Beryllium',
    productTitle: 'tile2345',
    productDescription: 'Bdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghe',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 5,
    couponCode: 'Boron',
    productTitle: 'tile2345',
    productDescription: 'Bdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 6,
    couponCode: 'Carbon',
    productTitle: 'tile2345',
    productDescription: 'Cdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 7,
    couponCode: 'Nitrogen',
    productTitle: 'tile2345',
    productDescription: 'dfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghN',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 8,
    couponCode: 'Oxygen',
    productTitle: 'tile2345',
    productDescription: 'Odfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 9,
    couponCode: 'Fluorine',
    productTitle: 'tile2345',
    productDescription: 'dfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghF',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 10,
    couponCode: 'Neon',
    productTitle: 'tile2345',
    productDescription: 'Ndfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghe',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 11,
    couponCode: 'Sodium',
    productTitle: 'tile2345',
    productDescription: 'Ndfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgha',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 12,
    couponCode: 'Magnesium',
    productTitle: 'tile2345',
    productDescription: 'Mdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghg',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 13,
    couponCode: 'Aluminum',
    productTitle: 'tile2345',
    productDescription: 'Aldfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 14,
    couponCode: 'Silicon',
    productTitle: 'tile2345',
    productDescription: 'Sdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghi',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 15,
    couponCode: 'Phosphorus',
    productTitle: 'tile2345',
    productDescription: 'dfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghP',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 16,
    couponCode: 'Sulfur',
    productTitle: 'tile2345',
    productDescription: 'Sdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 17,
    couponCode: 'Chlorine',
    productTitle: 'tile2345',
    productDescription: 'Cdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghl',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 18,
    couponCode: 'Argon',
    productTitle: 'tile2345',
    productDescription: 'Adfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghr',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 19,
    couponCode: 'Potassium',
    productTitle: 'tile2345',
    productDescription: 'Kdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: '/assets/images/banner-1.png',
  },
  {
    position: 20,
    couponCode: 'Calcium',
    productTitle: 'tile2345',
    productDescription: 'Cdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgha',
    productImage: '/assets/images/banner-1.png',
  },
];
