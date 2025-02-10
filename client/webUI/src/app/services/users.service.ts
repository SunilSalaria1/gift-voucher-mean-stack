import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }
  // login
  login(data:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/loginUser`, data);
  }

  // POST request
  registerUser(postData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/register`, postData);
  }
// Get request
  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/users`);
  }

  //get user by id
  getUserById(userId:any): Observable<any>{
    return this.http.get(`${this.apiUrl}/api/getUser/${userId}`);
  }

  // put request
updateUser(userId:any,postData:any): Observable<any>{
  return this.http.put(`${this.apiUrl}/api/updateUser/${userId}`,postData)
}

// delete request (delete user by id)
deleteUser(userId:any): Observable<any>{
  return this.http.post(`${this.apiUrl}/api/deleteUser/${userId}`,userId);
}



// local file data
  public getUsers() {
    return this.http.get<any>('assets/data/user.json')
  }
}