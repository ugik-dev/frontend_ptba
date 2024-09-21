import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RefService {
  private baseUrl = `${env.baseUrl}/ref/`;
  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders(this.authService.getAuthHeaders());
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}roles`, { headers: this.getAuthHeaders() });
  }

  getPermission(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}permission`, { headers: this.getAuthHeaders() });
  }
}
