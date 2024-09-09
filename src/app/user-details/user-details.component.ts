import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CacheService } from '../services/cache.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatCardModule, MatButtonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
  providers: [UserDataService, UtilService],
})
export class UserDetailsComponent {
  userId: string | null = '';
  userDetails: User = {
    avatar: '',
    email: '',
    first_name: '',
    id: 0,
    last_name: '',
  };
  constructor(
    private userDataService: UserDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cacheService: CacheService,
    private utilService: UtilService
  ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getSingleUserData();
  }

  getSingleUserData(): void {
    this.cacheService.loader.next(true);
    const userData = this.cacheService.fetchedUsersList.get(
      Number(this.userId)
    );
    if (userData) {
      this.userDetails = userData;
      this.cacheService.loader.next(false);
    } else {
      this.userDataService.getSingleUser(this.userId).subscribe(
        (result) => {
          this.userDetails = result.data;
          this.cacheService.fetchedUsersList.set(
            this.userDetails.id,
            this.userDetails
          );
        },
        () => {
          this.cacheService.loader.next(false);
          this.utilService.showErrorMessage(
            'Something went wrong! Please try again!',
            true
          );
        },
        () => {
          this.utilService.showErrorMessage(
            'Fetched Successfully!',
            false
          );
          this.cacheService.loader.next(false);
        }
      );
    }
  }

  navigateToHomePage(): void {
    this.router.navigateByUrl('/home');
  }
}
