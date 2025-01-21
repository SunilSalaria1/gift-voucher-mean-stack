import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { AddGiftItemComponent } from '../add-gift-item/add-gift-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-gift-inventory',
  standalone: true,
  imports: [
    RouterLink,
    AddGiftItemComponent,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './gift-inventory.component.html',
  styleUrl: './gift-inventory.component.css',
})
export class GiftInventoryComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  displayedColumns: string[] = [
    'position',
    'CouponCode',
    'productTitle',
    'productDescription',
    'productImage',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
}

export interface PeriodicElement {
  position: number;
  CouponCode: string;
  productTitle: string;
  productDescription: string;
  productImage: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    CouponCode: 'Hydrogen',
    productTitle: 'tile2345',
    productDescription: 'cvbHdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 2,
    CouponCode: 'Helium',
    productTitle: 'tile2345',
    productDescription: 'Hedfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 3,
    CouponCode: 'Lithium',
    productTitle: 'tile2345',
    productDescription: 'Lidfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 4,
    CouponCode: 'Beryllium',
    productTitle: 'tile2345',
    productDescription: 'Bdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghe',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 5,
    CouponCode: 'Boron',
    productTitle: 'tile2345',
    productDescription: 'Bdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 6,
    CouponCode: 'Carbon',
    productTitle: 'tile2345',
    productDescription: 'Cdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 7,
    CouponCode: 'Nitrogen',
    productTitle: 'tile2345',
    productDescription: 'dfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghN',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 8,
    CouponCode: 'Oxygen',
    productTitle: 'tile2345',
    productDescription: 'Odfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 9,
    CouponCode: 'Fluorine',
    productTitle: 'tile2345',
    productDescription: 'dfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghF',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 10,
    CouponCode: 'Neon',
    productTitle: 'tile2345',
    productDescription: 'Ndfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghe',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 11,
    CouponCode: 'Sodium',
    productTitle: 'tile2345',
    productDescription: 'Ndfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgha',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 12,
    CouponCode: 'Magnesium',
    productTitle: 'tile2345',
    productDescription: 'Mdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghg',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 13,
    CouponCode: 'Aluminum',
    productTitle: 'tile2345',
    productDescription: 'Aldfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 14,
    CouponCode: 'Silicon',
    productTitle: 'tile2345',
    productDescription: 'Sdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghi',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 15,
    CouponCode: 'Phosphorus',
    productTitle: 'tile2345',
    productDescription: 'dfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghP',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 16,
    CouponCode: 'Sulfur',
    productTitle: 'tile2345',
    productDescription: 'Sdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 17,
    CouponCode: 'Chlorine',
    productTitle: 'tile2345',
    productDescription: 'Cdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghl',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 18,
    CouponCode: 'Argon',
    productTitle: 'tile2345',
    productDescription: 'Adfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfghr',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 19,
    CouponCode: 'Potassium',
    productTitle: 'tile2345',
    productDescription: 'Kdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgh',
    productImage: './/assets.//sg.//df./.dfdf',
  },
  {
    position: 20,
    CouponCode: 'Calcium',
    productTitle: 'tile2345',
    productDescription: 'Cdfgdg dfgdfg dfgdfgfdg dfgdfgdfg gfhfgha',
    productImage: './/assets.//sg.//df./.dfdf',
  },
];
