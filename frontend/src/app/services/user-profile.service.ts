import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}