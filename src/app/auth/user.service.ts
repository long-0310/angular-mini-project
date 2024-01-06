import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { apiServiceBase } from 'src/module/api-services-base';

@Injectable({
  providedIn: 'root',
})
export class UserService extends apiServiceBase {
  constructor(private http: HttpClient) {
    super(http);
  }

  public getListUsers(): Observable<any> {
    return this.get('http://localhost:3000/user');
  }
  public addUser(params?: any): Observable<any> {
    return this.post('http://localhost:3000/user', params);
  }
  public deleteUser(id?: string | number): Observable<any> {
    return this.delete(`${'http://localhost:3000/user'}/${id}`);
  }
  public updateUser(params: any, id?: string | number): Observable<any> {
    return this.put(`${'http://localhost:3000/user'}/${id}`, params);
  }
}
