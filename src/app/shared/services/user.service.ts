import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User, UserUpdate } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private readonly http: HttpClient) {}

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updateMe(changes: UserUpdate): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, changes);
  }

  deleteMe(): Observable<void> {
    return this.http.delete(`${this.apiUrl}/me`).pipe(map(() => void 0));
  }
}
