import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordVisible: boolean = false;
  showPasswordIcon: string = 'fa-regular fa-eye';
  errorMessage: { [key: string]: string } = {};

  constructor(
    private FormBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.showPasswordIcon = this.passwordVisible
      ? 'fa-regular fa-eye-slash'
      : 'fa-regular fa-eye';
  }

  ngOnInit(): void {
    this.loginForm = this.FormBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32),
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,32}$'
        ),
      ]),
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.http.get<any>('http://localhost:3000/user').subscribe({
        next: (res) => {
          const user = res.find((a: any) => {
            return (
              a.email === this.loginForm.value.email &&
              a.password === this.loginForm.value.password
            );
          });
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem(
              'accessToken',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjI1IiwiRW1haWwiOiJ2dXBoaWxvbmdnMDMxMEBnbWFpbC5jb20iLCJOYW1lIjoidnUgcGhpIGxvbmciLCJVc2VybmFtZSI6InZ1cGhpbG9uZ2cwMzEwIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzA0NjE5NjkxLCJleHAiOjE3MDQ2MzQwOTEsImlhdCI6MTcwNDYxOTY5MX0.3HSjDyCPH1c6YJ6IEIqEkKeFZrMm1he9bc1U7FcrGEY'
            );
            this.loginForm.reset();
            this.router.navigate(['/']);
          } else {
            alert('User not found !');
          }
        },
        error: (err) => {
          alert('Some thing went wrong !');
        },
      });
    } else {
      const controls = this.loginForm.controls;
      for (const key in controls) {
        if (controls[key].errors) {
          for (const errorKey in controls[key].errors) {
            this.errorMessage[key] = this.getErrorMessage(key, errorKey);
          }
        }
      }
    }
  }
  getErrorMessage(key: string, errorKey: string): string {
    // Define your error messages here
    const errorMessages: { [key: string]: { [errorKey: string]: string } } = {
      email: {
        required: 'Email is required.',
        email: 'Please enter a valid email.',
      },
      password: {
        required: 'Password is required.',
        minlength: 'Password must be at least 8 characters long.',
        maxlength: 'Password cannot be more than 32 characters long.',
        pattern:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      },
    };

    return errorMessages[key][errorKey];
  }
}
