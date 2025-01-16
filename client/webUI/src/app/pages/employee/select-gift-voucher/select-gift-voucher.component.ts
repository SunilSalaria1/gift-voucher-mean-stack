import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-select-gift-voucher',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './select-gift-voucher.component.html',
  styleUrls: ['./select-gift-voucher.component.css'],
  
})
export class SelectGiftVoucherComponent {
  //product list array object
  productList: any[] = [
    { id: 1, code: "CODE98547", image: "assets/images/products/water-bottle.png", name: "Copper bottle", description: "This product is most popular and most rated by customers.", text: "Claim Gift" },
    { id: 2, code: "CODE98981", image: "assets/images/products/perfume.png", name: "Engage perfume", description: "This product is most popular and most rated by customers.", text: "Claim Gift" },
    { id: 3, code: "CODE93457", image: "assets/images/products/ear-buds.png", name: "Ear buds", description: "This product is most popular and most rated by customers.", text: "Claim Gift" },
    { id: 4, code: "CODE34780", image: "assets/images/products/chair.png", name: "Office chair", description: "This product is most popular and most rated by customers.", text: "Claim Gift" },
    { id: 5, code: "CODE51547", image: "assets/images/products/tumbler.png", name: "Tumbler", description: "This product is most popular and most rated by customers.", text: "Claim Gift" },
    { id: 6, code: "CODE78456", image: "assets/images/products/power-bank.png", name: "Power bank", description: "This product is most popular and most rated by customers.", text: "Claim Gift" },
    { id: 7, code: "CODE90927", image: "assets/images/products/steel-water-bottle.png", name: "Cello water bottle", description: "This product is most popular and most rated by customers.", text: "Claim Gift" },
    { id: 8, code: "CODE76047", image: "assets/images/products/laptop-screen.png", name: "Laptop screen", description: "This product is most popular and most rated by customers.", text: "Claim Gift" },
    { id: 9, code: "CODE98264", image: "assets/images/products/bluetooth-speaker.png", name: "Bluetooth speaker", description: "This product is most popular and most rated by customers.", text: "Claim Gift" },
    { id: 10, code: "CODE63154", image: "assets/images/products/lunch-box.png", name: "Lunch box", description: "This product is most popular and most rated by customers.", text: "Claim Gift" },
  ];
  
  //active product card
  activeIndex: number | null = null;

  
  claimGiftBtn(index: number): void {
    this.activeIndex = index;    
  }

  notSelected(){
    console.log("dfdghfgn");
    
  }

  
  
}
