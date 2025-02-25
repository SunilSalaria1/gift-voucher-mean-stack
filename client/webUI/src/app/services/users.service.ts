import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}
  // login
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/login`, data);
  }
  // Store token
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }
  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // POST request
  registerUser(postData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/users`, postData);
  }
  // Get request
  getUsers(
    page: number,
    limit: number,
    searchItem: any,
    sortBy: string = '',
    role: string = ''
  ): Observable<any> {
    const params: any = {
      role: role,
      page: page,
      limit: limit,
    };
    if (searchItem.searchTerm != '') {
      console.log('222222222222');
      params.searchItem = searchItem;
    }
    if (sortBy) {
      params.sortBy = sortBy;
    }

    return this.http.get(`${this.apiUrl}/api/users`, { params });
  }

  //get user by id
  getUserById(userId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/users/${userId}`);
  }

  // put request
  updateUser(userId: any, postData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/users/${userId}`, postData);
  }

  // delete request (delete user by id)
  deleteUser(userId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/users/${userId}`);
  }

  // create and remove admin
  createAdminRemoveAdmin(id,data): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/users/${id}/role`, data);
  }

  // get all admins
  getAllAdmins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/getAllAdmins`);
  }

  // add feedback
  addSuggestions(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/suggestion`, data);
  }

  // get feedbacks
  getSuggestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/suggestion`);
  }

  // logOut request
  logout(): void {
    this.http.post(`${this.apiUrl}/api/logout`, {}).subscribe({
      next: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('loginUser'); // Remove token
      },
      error: (err) => {
        console.error('Logout failed', err);
      },
    });
  }

  // local file data
  // public getUsers() {
  //   return this.http.get<any>('assets/data/user.json')
  // }
}
