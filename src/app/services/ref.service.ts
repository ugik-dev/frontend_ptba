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

  getTax(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}tax`, { headers: this.getAuthHeaders() });
  }
  getSubTax(parent: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}sub-tax/${parent}`, { headers: this.getAuthHeaders() });
  }

  getRegion(parent = ""): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}region/${parent}`, { headers: this.getAuthHeaders() });
  }

  getProvince(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}region/province`, { headers: this.getAuthHeaders() });
  }

}
