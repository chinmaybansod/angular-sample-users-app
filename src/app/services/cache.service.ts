import { Injectable } from '@angular/core';
import { User, UserApiResponse } from '../models/user.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  userApiDataStore = new Map<number, UserApiResponse>();
  fetchedUsersList = new Map<number, User>();
  public loader: Subject<boolean> = new Subject<boolean>();
}
