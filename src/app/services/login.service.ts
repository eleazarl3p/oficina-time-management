import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User, UserToken } from '../models/user.model';
import { map, Observable, tap } from 'rxjs';

import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

export interface Credentials {
  username: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private BASE_URL = environment.baseUrl;

  user = signal<User | null | undefined>(undefined);

  login(credentials: Credentials): Observable<User | null | undefined> {
    return this.http
      .post(this.BASE_URL + 'auth/login/', credentials, {
        responseType: 'text',
      })
      .pipe(
        tap((token: any) => {
          // const { token, user } = result;
          localStorage.setItem('token', token);

          const decoded = jwtDecode<UserToken>(token);
          const _user = new User(
            decoded._id,

            decoded.first_name,
            decoded.last_name,
            decoded.username,
            '', // password
            decoded.role
          );
          this.user.set(_user);
        }),

        map((result: any) => {
          return this.user();
        })
      );
  }

  getUser() {
    //: Observable<User | null | undefined>
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<UserToken>(token);
      const _user = new User(
        decoded._id,

        decoded.first_name,
        decoded.last_name,
        decoded.username,
        '', // password
        decoded.role
      );
      this.user.set(_user);
    }
    // return this.http.get(this.BASE_URL + '').pipe(
    //   tap((result: any) => {
    //     const user = new User(
    //       result._id,
    //       result.username,
    //       result.email,
    //       result.firstName,
    //       result.lastName,
    //       result.role
    //     );

    //     this.user.set(user);
    //   }),
    //   map((result: any) => {
    //     return this.user();
    //   })
    // );
  }

  logout(): Observable<null> {
    localStorage.removeItem('token');
    this.user.set(null);
    return this.http.get(this.BASE_URL).pipe(
      tap((result: any) => {
        localStorage.removeItem('token');
        this.user.set(null);
      })
    );
  }
}
