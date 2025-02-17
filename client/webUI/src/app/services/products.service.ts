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

    addProducts(data:any):Observable<any>{
      return this.http.post(`${this.apiUrl}/api/products`,data)
    }

    checkCouponCode(couponCode:string):Observable<any>{
      return this.http.get(`${this.apiUrl}/api/couponCode/{ params: { couponCode: couponCode } }`)
    }

    getProducts(page: number, limit: number , searchItem: string = '', sortBy: string = ''):Observable<any>{
      const params: any = {       
        page:page,
        limit:limit,
        sortBy:"",
        searchItem:"",
      };     
        if (searchItem) {
          params.searchItem = searchItem;
        }
        if (sortBy) {
          params.sortBy = sortBy;
        }      
      return this.http.get(`${this.apiUrl}/api/products`,{ params })
    }
}
