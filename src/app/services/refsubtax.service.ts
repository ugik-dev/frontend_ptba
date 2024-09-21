import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RefSubTaxService {
  private baseUrl = `${env.baseUrl}/manage-ref-sub-tax`;
  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders(this.authService.getAuthHeaders());
  }

  get(): Observable<any> {
    return this.http.get<any>(this.baseUrl, { headers: this.getAuthHeaders() });
  }
  create(reftaxData: any): Observable<any> {
    return this.http.post(this.baseUrl, reftaxData, { headers: this.getAuthHeaders() });
  }
  update(reftaxId: number, reftaxData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${reftaxId}`, reftaxData, { headers: this.getAuthHeaders() });
  }
  delete(reftaxId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${reftaxId}`, { headers: this.getAuthHeaders() });
  }
}
