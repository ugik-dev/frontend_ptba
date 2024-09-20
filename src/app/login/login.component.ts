import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { env } from '../../env';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient) { }
  onSubmit() {
    this.http.post(`${env.baseUrl}/auth/login`, {
      username: this.username,
      password: this.password
    }).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('name', response.user.name);
        localStorage.setItem('title', response.user.title);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        // console.log(error.error.message)
        alert(error.error.message);
      }
    );
  }
}
