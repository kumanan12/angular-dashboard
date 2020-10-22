import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthenticatedUser } from '../models/authenticated-user';

const url = '/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  // This data comes from the social login provider
  authenticatedUser: BehaviorSubject<AuthenticatedUser> = new BehaviorSubject(null);

  // This is the real user in the system.
  user: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  add(data: User): Observable<any> {
    const response = this.http.post(url, data);
    response.toPromise().then( (newUser: User) => {
      this.user.next(newUser);
    }).catch( err => console.error);
    return response;
  }

  getById(id: string): Observable<any> {
    const fullUrl = `${url}/?userId=${id}`;
    const response = this.http.get<User>(fullUrl);
    return response;
  }

  update(data: User): void {

  }

  delete(userId: string): void {

  }
}

