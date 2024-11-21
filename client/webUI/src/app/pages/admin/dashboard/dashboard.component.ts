import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AddGiftItemComponent } from '../add-gift-item/add-gift-item.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, AddGiftItemComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) { }
}
