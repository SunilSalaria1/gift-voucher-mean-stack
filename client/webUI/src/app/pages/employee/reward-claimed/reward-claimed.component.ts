import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reward-claimed',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatCardModule,RouterLink],
  templateUrl: './reward-claimed.component.html',
  styleUrl: './reward-claimed.component.css'
})
export class RewardClaimedComponent {

}
