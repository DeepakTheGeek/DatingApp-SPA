import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_model/User';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseurl = environment.apiURL + 'users/';
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseurl);
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseurl + id);
  }

  updateUser(id, user) {
    return this.http.put(this.baseurl + id, user);
  }

  setMainPhoto(userId, id) {
    return this.http.post(this.baseurl + userId + '/photos/' + id + '/SetMain', {});
  }
}
