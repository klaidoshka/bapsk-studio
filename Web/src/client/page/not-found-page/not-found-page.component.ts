import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.css'],
})
export class NotFoundPageComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private interval!: NodeJS.Timeout;
  private defaultValue = 5;
  private routerSubscription!: Subscription;

  public redirectSeconds = signal(this.defaultValue);

  ngOnInit(): void {
    this.startRedirectCountdown();

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.startRedirectCountdown();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private startRedirectCountdown(): void {
    const initialUrl = this.router.url;

    if (this.interval) {
      clearInterval(this.interval);
    }

    this.redirectSeconds.set(this.defaultValue);

    this.interval = setInterval(() => {
      if (this.redirectSeconds() <= 1) {
        clearInterval(this.interval);

        if (this.router.url === initialUrl) {
          this.router.navigate(['/']);
        }
      } else {
        this.redirectSeconds.update(v => v - 1);
      }
    }, 1000);
  }
}
