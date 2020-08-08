import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiURL + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
    .pipe(
      map((response: any) => {
        const loginResponse = response;
        if (loginResponse){
          localStorage.setItem('token', loginResponse.token);
          localStorage.setItem('user', JSON.stringify( loginResponse.user));
          this.currentUser = loginResponse.user;
          this.decodedToken = this.jwtHelper.decodeToken(loginResponse.token);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
