import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-select-gift-voucher',
  standalone: true,
  imports: [MatIconModule, RouterLink,MatButtonModule,MatCardModule],
  templateUrl: './select-gift-voucher.component.html',
  styleUrl: './select-gift-voucher.component.css'
})
export class SelectGiftVoucherComponent {

}
