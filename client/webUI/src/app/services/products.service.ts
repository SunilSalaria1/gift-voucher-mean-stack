import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
 private apiUrl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  // upload
  uploadProductImage(data: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/upload`, data);
    }
}
