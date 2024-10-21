import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { Location } from '@angular/common';
@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
  constructor(private location: Location) { }
//== go back btn
goBack(): void {
  this.location.back();
}
}
