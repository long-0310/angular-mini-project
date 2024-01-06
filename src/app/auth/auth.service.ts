import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { AdminUser } from './interfaces/admin-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public listAdminUser: AdminUser[] = [];
  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

  redirectUrl: string = '';
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getListUsers() {
    this.userService.getListUsers().subscribe({
      next: (data) => {
        if (data) {
          console.log({ data });
          this.listAdminUser = data;
        }
      },
    });
  }
}
