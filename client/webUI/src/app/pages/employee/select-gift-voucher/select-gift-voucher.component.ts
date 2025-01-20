import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-select-gift-voucher',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './select-gift-voucher.component.html',
  styleUrls: ['./select-gift-voucher.component.css'],
  animations: [
    trigger('zoomInOut', [
      state('void', style({
        transform: 'scale(0)',  // Initially scale down (for closing)
        opacity: 0,             // Initially invisible
      })),
      state('in', style({
        transform: 'scale(1)',  // Scale up to normal size (for opening)
        opacity: 1,             // Fully visible
      })),
      transition('void => in', [
        animate('0.3s ease-out') // Animation for opening (zoom-out)
      ]),
      transition('in => void', [
        animate('0.3s ease-in')  // Animation for closing (zoom-in)
      ])
    ])
  ]
})
  

export class SelectGiftVoucherComponent {
  private _snackBar = inject(MatSnackBar);
  constructor(private snackBar: MatSnackBar) { }
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
  isConfirmVisible:boolean=false;
  zoomState = 'void';
  
  claimGiftBtn(index: number): void {
    this.activeIndex = index;
    this.isConfirmVisible=true
    // Trigger zoom-out animation (for opening)    
    this.zoomState = 'in';     
  }

  // notSelected
  notSelected(){
    console.log("dfdghfgn");
    this.isConfirmVisible=false 
    // Close with zoom-in effect
    this.zoomState = 'void'; 
    // show error snackbar
    this.snackBar.open('Gift not selected. You can select another gift', 'close', {
      duration: 5000,
      panelClass: ['snackbar-error'],
      horizontalPosition: "center",
      verticalPosition: "top",
    });   
  }

  // selected
  selected(){
    // show success snackbar
    this.snackBar.open('Enjoy your exclusive reward.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }

  // logout
  logOut(){
    localStorage.removeItem('loginUser')
    // show success snackbar
    this.snackBar.open('You have successfully logged out.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
}
