import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  login(data:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/loginUser`, data);
  }

  public getUsers() {
    return this.http.get<any>('assets/data/user.json')
  }

}