import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = `${env.baseUrl}/role`;
  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders(this.authService.getAuthHeaders());
  }
  // constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get<any>(this.baseUrl, { headers: this.getAuthHeaders() });
  }
  getRolePermission(roleId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/permission/${roleId}`, { headers: this.getAuthHeaders() });
  }
  create(userData: any): Observable<any> {
    return this.http.post(this.baseUrl, userData, { headers: this.getAuthHeaders() });
  }
  update(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}`, userData, { headers: this.getAuthHeaders() });
  }
  delete(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }


}
