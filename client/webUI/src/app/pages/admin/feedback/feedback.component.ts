import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [MatCardModule, MatIconModule,CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  totalStars: number = 5; // Total stars per card

  // Array of cards with rating, description, image, and name
  cards = [
    { id: 1, rating: 3, description: "Average product! The gift is okay, but it could be better. It meets basic expectations, but it's not very exciting or special.", image: "assets/images/user-profile.png", name: "Alice Johnson" },
    { id: 2, rating: 5, description: "Excellent Gift! Absolutely love this gift! It's thoughtful, high-quality, and truly appreciated.", image: "assets/images/user-profile.png", name: "Bob Smith" },
    { id: 3, rating: 2, description: "Could be better.The gift is not very impressive. It doesn’t meet expectations and could have been better in terms of quality or usefulness.", image: "assets/images/user-profile.png", name: "Charlie Brown" },
    { id: 4, rating: 4, description: "Nice quality.Really pleased with this gift! It's high-quality and thoughtful, though there’s a small area for improvement to make it perfect.", image: "assets/images/user-profile.png", name: "David Lee" },
    { id: 5, rating: 1, description: "Not satisfied.It doesn't meet expectations, and the quality or usefulness is lacking. Not something I'd recommend.", image: "assets/images/user-profile.png", name: "Ella White" },
    { id: 6, rating: 5, description: "Highly recommended! This is a fantastic choice. The gift is of excellent quality, thoughtful, and something I would definitely recommend to others. ", image:"assets/images/user-profile.png", name: "Franklin Adams" },
    { id: 7, rating: 3, description: "Okay product.The product is decent but not exceptional. It serves its purpose, though it's not something that stands out or exceeds expectations.", image: "assets/images/user-profile.png", name: "Grace Hall" },
    { id: 8, rating: 4, description: "Good value for money.It's affordable yet performs well, making it a great option if you're looking for value without breaking the bank.", image: "assets/images/user-profile.png", name: "Henry Clark" },
  ];

  // Generate stars for each card
  getStars(rating: number): string[] {
    return Array.from({ length: this.totalStars }, (_, i) =>
      i < rating ? 'star' : 'star_border'
    );
  }
}
