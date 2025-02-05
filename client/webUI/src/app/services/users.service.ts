import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'localhost:3000';

  constructor(private http: HttpClient) { }

  login(data:any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  public getUsers() {
    return this.http.get<any>('assets/data/user.json')
  }

}
