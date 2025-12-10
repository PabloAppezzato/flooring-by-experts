import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc;">
      <h2>Login</h2>
      <form (ngSubmit)="login()">
        <div style="margin-bottom: 15px;">
          <input
            [(ngModel)]="email"
            name="email"
            placeholder="Email"
            type="email"
            style="width: 100%; padding: 8px;"
          />
        </div>
        <div style="margin-bottom: 15px;">
          <input
            [(ngModel)]="password"
            name="password"
            type="password"
            placeholder="Password"
            style="width: 100%; padding: 8px;"
          />
        </div>
        <button type="submit" style="width: 100%; padding: 10px; cursor: pointer;">
          Login
        </button>
      </form>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('http://localhost:4000/api/auth/local', {
      email: this.email,
      password: this.password
    }).subscribe(
      res => {
        localStorage.setItem('fbe_token', res.token);
        this.router.navigate(['/workorders']);
      },
      error => {
        alert('Login failed: ' + error.error?.message);
      }
    );
  }
}
