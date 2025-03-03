import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  // add event
  addEvent(postData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/events`, postData);
  }

  // get events
  getEvents(
    page?: number,
    limit?: number,
    searchItem?: any,
    sortBy: string = ''
  ): Observable<any> {
    const params: any = {
      page: page,
      limit: limit,
    };
    console.log(params);
    if (searchItem.searchTerm != '') {
      console.log('222222222222');
      params.searchItem = searchItem;
    }
    if (sortBy) {
      params.sortBy = sortBy;
    }
    return this.http.get(`${this.apiUrl}/api/events`, { params });
  }

  // update event
  updateEvent(eventId: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/events/${eventId}`, data);
  }
  //get event by id
  getEventById(eventId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/events/${eventId}`);
  }
// deleteEvent
  deleteEvent(eventId:any):Observable<any>{
    return this.http.delete(`${this.apiUrl}/api/events/${eventId}`);
  }

  // get notifications
  getNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/notifications`);
  }

  // update notifications
  updateNotifications(notificationId: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/notifications/${notificationId}`, data);
  }
}
