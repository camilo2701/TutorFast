import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {

  private apiUrl = 'https://tutorfast-api.onrender.com/api/users';

  constructor(private http: HttpClient) {}

  getUserProfile(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  activateSubscription(): Observable<any> {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch(
      `${this.apiUrl}/subscription`,
      {},
      { headers }
    );
  }
}