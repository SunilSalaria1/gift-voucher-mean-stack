import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EmployeeHeaderComponent } from '../../../shared/employee-header/employee-header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../../services/events.service';
import { EmployeeFooterComponent } from '../../../shared/employee-footer/employee-footer.component';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, EmployeeHeaderComponent, EmployeeFooterComponent, MatIconModule, MatDialogModule],
  templateUrl: './upcoming-events.component.html',
  styleUrl: './upcoming-events.component.css'
})
export class UpcomingEventsComponent {
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);
  dialogRef: MatDialogRef<any> | null = null;
  private _eventsService = inject(EventsService)
  currentPage: any;
  pageSize: any;
  events: any[] = [];
  selectedEvent: any = null;
  whyYouAttendList: any[] = []

  ngOnInit() {
    this.loadUpcomingEvents(this.currentPage, this.pageSize);
  }


  loadUpcomingEvents(page: number,
    limit: number,
    searchTerm?: any,
    sortBy: string = '') {
    this._eventsService.getEvents(page, limit, { searchTerm: '' }, sortBy).subscribe(
      (response) => {
        this.whyYouAttendList = response.events.whyYouAttend
        this.events = response.events
        console.log(this.events)
      }, (error) => {
        console.log(error, 'error fetching events')
      }
    )
  }



  // dialog box
  openDialog(event: any): void {
    this.selectedEvent = event; // Set selected event
    this.whyYouAttendList = event.whyYouAttend || [];
    // Use the TemplateRef for the dialog
    const dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '1200px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.selectedEvent = null; // Clear selected event after closing dialog
      this.whyYouAttendList = []; // Reset list after closing
    });
  }

  
  

}
