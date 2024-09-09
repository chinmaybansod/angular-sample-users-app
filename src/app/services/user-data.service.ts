import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleUserApiResponse, UserApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient) { }

  getUsersList(page: number): Observable<UserApiResponse> {
    const url = 'https://reqres.in/api/users?page=' + page;
    return this.http.get<UserApiResponse>(url);
  }

  getSingleUser(id: string | null): Observable<SingleUserApiResponse> {
    const url = 'https://reqres.in/api/users/' + id;
    return this.http.get<SingleUserApiResponse>(url);
  }

}
