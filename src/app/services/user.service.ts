import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { env } from '../../env'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  dummyUser = [
    {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com"
    },
  ];

  private baseUrl = `${env.baseUrl}/manage-user`;
  constructor(private http: HttpClient) { }
  getUsers(): Observable<any> {
    return of(this.dummyUser);
  }
}
