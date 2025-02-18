import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  // upload product image
  uploadProductImage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/upload`, data);
  }

  // add products
  addProducts(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/products`, data)
  }

  // check coupon code already exists
  checkCouponCode(couponCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/couponCode/${couponCode}`)
  }

  // get all products
  getProducts(page: number, limit: number, searchItem: string = '', sortBy: string = ''): Observable<any> {
    const params: any = {
      page: page,
      limit: limit,
      sortBy: "",
      searchItem: "",
    };
    if (searchItem) {
      params.searchItem = searchItem;
    }
    if (sortBy) {
      params.sortBy = sortBy;
    }
    return this.http.get(`${this.apiUrl}/api/products`, { params })
  }

  // get product by id
  getProductById(productId:any):Observable<any>{
    return this.http.get(`${this.apiUrl}/api/products/${productId}`)
  }

  // update product
  updateProduct(productId: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/users/${productId}`,data)
  }

  // delete request (delete product by id)
  deleteProduct(productId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/products/${productId}`, productId);
  }
}
