import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule,TruncatePipe],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  private _usersService = inject(UsersService)
  totalStars: number = 5; // Total stars per card
  cards: Feedback[] = [];
  ngOnInit():void {
    this._usersService.getFeedbacks().subscribe(
      (response) => {
        this.cards = response.feedbacks.map(feedback => ({
          description: feedback.description,
          rating: parseInt(feedback.rating, 10), // Convert rating to number
          name: feedback.userDetails.name,
          empCode: feedback.userDetails.empCode || 'N/A',
          expanded: false // Initialize expanded state          
        }));
        console.log(this.cards);        
      }
    )
  } 
  toggleReadMore(card: Feedback) {
    card.expanded = !card.expanded;
  }
  // Generate stars for each card
  getStars(rating: number): string[] {
    return Array.from({ length: this.totalStars }, (_, i) =>
      i < rating ? 'star' : 'star_border'
    );
  }
// initials of first and last name
  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1][0]}` 
      : `${parts[0][0]}`;
  }
}
interface Feedback {
  description: string;
  rating: number;
  name: string;
  empCode: string; 
  expanded:boolean; 
}
