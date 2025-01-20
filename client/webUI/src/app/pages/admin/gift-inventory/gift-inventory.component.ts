import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddGiftItemComponent } from '../add-gift-item/add-gift-item.component';

@Component({
  selector: 'app-gift-inventory',
  standalone: true,
  imports: [RouterLink, AddGiftItemComponent],
  templateUrl: './gift-inventory.component.html',
  styleUrl: './gift-inventory.component.css',
})
export class GiftInventoryComponent {
  constructor() {}
}
