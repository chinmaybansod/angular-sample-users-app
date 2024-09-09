import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { CacheService } from './services/cache.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, UserListComponent, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [CacheService]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-sample-users-app';
  loader = true;
  loaderSubscription: Subscription = new Subscription();

  constructor(private cacheService: CacheService) {}

  ngOnInit(): void {
    this.loaderSubscription = this.cacheService.loader.subscribe(result => { this.loader = result });
  }

  ngOnDestroy(): void {
    this.loaderSubscription.unsubscribe();
  }

}
