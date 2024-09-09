import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserDataService } from '../services/user-data.service';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { CacheService } from '../services/cache.service';
import { UtilService } from '../services/util.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [UserDataService, UtilService],
})
export class UserListComponent implements OnInit, OnDestroy {
  currentPage = 0;
  totalPages = 0;
  perPage = 0;
  userData: User[] = [];
  searchedUserData: User[] = [];
  totalUsers = 0;

  hidePageSize = false;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  disabled = false;
  searchString = '';

  searchSubject: Subject<string> = new Subject<string>();
  searchSubscription: Subscription = new Subscription();

  constructor(
    private userDataService: UserDataService,
    private router: Router,
    private cacheService: CacheService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.searchSubscription.add(
      this.searchSubject.pipe(debounceTime(500)).subscribe(result => {
        this.search(result);
      })
    )
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  getData(): void {
    this.cacheService.loader.next(true);
    const page = this.currentPage + 1;
    const currentPageData = this.cacheService.userApiDataStore.get(page);
    if (!currentPageData) {
      this.disabled = true;
      this.userDataService.getUsersList(page).subscribe(
        (result) => {
          this.cacheService.userApiDataStore.set(page, result);
          this.userData = result.data;
          this.searchedUserData = this.userData;
          this.totalPages = result.total_pages;
          this.perPage = result.per_page;
          this.totalUsers = result.total;
          this.disabled = false;
        },
        () => {
          this.utilService.showErrorMessage(
            'Something went wrong! Please try again!',
            true
          );
          this.cacheService.loader.next(false);
        },
        () => {
          this.utilService.showErrorMessage('Fetched Successfully!', false);
          this.cacheService.loader.next(false);
        }
      );
    } else {
      this.userData = currentPageData.data;
      this.searchedUserData = this.userData;
      this.totalPages = currentPageData.total_pages;
      this.perPage = currentPageData.per_page;
      this.totalUsers = currentPageData.total;
      this.cacheService.loader.next(false);
    }
  }

  handlePageEvent(e: PageEvent): void {
    this.currentPage = e.pageIndex;
    this.getData();
  }

  viewUserDetails(userId: number): void {
    this.router.navigateByUrl('/user-details/' + userId);
  }

  search(searchString: string): void {
    if(searchString !== '') {
      this.searchedUserData = this.userData.filter(
        (val) =>
          val.first_name.toLowerCase().includes(searchString.toLowerCase()) ||
          val.last_name.toLowerCase().includes(searchString.toLowerCase()) ||
          val.email.toLowerCase().includes(searchString.toLowerCase()) ||
          val.id === Number(searchString)
      );
    } else {
      this.searchedUserData = this.userData;
    }
    this.cacheService.loader.next(false);
  }

  searchHandler(): void {
    this.cacheService.loader.next(true);
    this.searchSubject.next(this.searchString);
  }
}
