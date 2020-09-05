import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_model/User';
import { PaginatedResult } from '../_model/pagination';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseurl = environment.apiURL + 'users/';
  constructor(private http: HttpClient) {}

  getUsers(page?: number, itemsPerPage?: number, userParams?: any, likeParams?: string): Observable<PaginatedResult<User[]>> {
    const paginatedUsers = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (page) {
      params = params.append('pageNumber', page.toString());
    }
    if (itemsPerPage) {
      params = params.append('pageSize', itemsPerPage.toString());
    }
    if (userParams) {
      params = params.append('gender', userParams.gender);
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('orderBy', userParams.orderBy);
    }
    if (likeParams) {
      params = params.append(likeParams, 'true');
    }

    return this.http
      .get<User[]>(this.baseurl, { observe: 'response', params})
      .pipe(
        map((response) => {
          paginatedUsers.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedUsers.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedUsers;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseurl + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseurl + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(
      this.baseurl + userId + '/photos/' + id + '/SetMain',
      {}
    );
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseurl + userId + '/photos/' + id);
  }

  likeUser(userId: number, recipientId: number) {
    return this.http.post(this.baseurl + userId + '/like/' + recipientId, {});
  }
}
