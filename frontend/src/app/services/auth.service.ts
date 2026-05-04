import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  register(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}`, formData);
  }

  login(loginData: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }
  
}