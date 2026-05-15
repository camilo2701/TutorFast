import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

  private headers() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getMe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, this.headers());
  }

  updateMe(formData: FormData): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/me`, formData, this.headers());
  }

  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reviews`, this.headers());
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/reviews/${id}`, this.headers());
  }

  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bookings`, this.headers());
  }

  getAds(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ads`, this.headers());
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, this.headers());
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/${id}`, data, this.headers());
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`, this.headers());
  }

  deleteUserImage(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/${id}/delete-image`, {}, this.headers());
  }
}