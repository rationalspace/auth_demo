import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user';
import { JwtResponse } from  './models/jwt-response';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  [x: string]: any;
  constructor(private httpClient: HttpClient) { }
  AUTH_SERVER = "http://localhost:3000";
  authSubject  =  new  BehaviorSubject(false);

  public login(userInfo: User){
      localStorage.setItem('ACCESS_TOKEN',"access_token");
  }

  public isLoggedIn(){
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }

  public logout(){
    localStorage.removeItem("ACCESS_TOKEN");
  }

  register(user: User): Observable<JwtResponse> {
    return this.httpClient.post<JwtResponse>(`${this.AUTH_SERVER}/register`, user).pipe(
      tap((res:  JwtResponse ) => {
        if (res.user) {
          localStorage.setItem("ACCESS_TOKEN", res.user.access_token);
          //localStorage.setItem("EXPIRES_IN", res.user.expires_in);
          this.authSubject.next(true);
        }
      })
    );
  }
  
  signIn(user: User): Observable<JwtResponse> {
    return this.httpClient.post(`${this.AUTH_SERVER}/login`, user).pipe(
      tap(async (res: JwtResponse) => {
        if (res.user) {
          localStorage.setItem("ACCESS_TOKEN", res.user.access_token);
          // localStorage.setItem("EXPIRES_IN", res.user.expires_in);
          this.authSubject.next(true);
        }
      })
    );
  }
  signOut() {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
    this.authSubject.next(false);
  }
  isAuthenticated() {
    return  this.authSubject.asObservable();
  }
}