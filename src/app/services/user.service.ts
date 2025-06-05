import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);

  url = `${environment.baseUrl}user`;

  create(user: User) {
    return this.http.post(this.url, user);
  }
  getAllUsers() {
    return this.http.get<User[]>(this.url);
  }

  update(user: User) {
    return this.http.patch(`${this.url}/${user._id}`, user);
  }

  updatePassword(user: User) {
    return this.http.patch(`${this.url}/${user._id}/password`, {
      password: user.password,
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  resetPassword(id: number) {
    return this.http.patch(`${this.url}/reset-password/${id}`, {});
  }
}
