import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, tap, Observable } from "rxjs";
import { AuthService } from "./auth.service";
import User from "../../core/models/user.model";

@Injectable({
    providedIn: 'root',
  })
  export class UserService {
    users: Set<User> = new Set<User>();
  
    private readonly userAddedSource = new Subject<User>();
    userAddedObservable = this.userAddedSource.asObservable();
  
    private readonly userRemovedSource = new Subject<User>();
    userRemovedObservable = this.userRemovedSource.asObservable();
  
    constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}
  
    addUser = (user: User) =>
      this.http
        .post('http://localhost:4200/signup', user)
        .pipe(tap((r) => this.userAddedSource.next(user)));

    listUsers = (): Observable<User[]> =>
      this.http.get<User[]>('http://localhost:4200/users', {
        headers: this.authService.buildHeaders(),
    });
      
    returnUser = (id: string) =>
      this.http.get<User>(`http://localhost:4200/users/${id}`, {
        headers: this.authService.buildHeaders(),
    });
  
    updateUser = (user: User) =>
      this.http.put(`http://localhost:4200/users/${user._id}`, user, {
        headers: this.authService.buildHeaders(),
    });
  
    removeUser = (user: User) =>
      this.http
        .delete(`http://localhost:4200/users/${user._id}`, {
          headers: this.authService.buildHeaders(),
        })
        .pipe(
          tap((r) => this.userRemovedSource.next(user))
        );
  
    searchUser = (name: string): Observable<User[]> =>
      this.http.get<User[]>(`http://localhost:4200/search?name=${name}`, {
        headers: this.authService.buildHeaders(),
      });
      
    insertUser = (user: User) => this.users.add(user);
}