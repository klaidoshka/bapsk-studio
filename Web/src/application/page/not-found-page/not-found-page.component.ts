import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'not-found-page',
  templateUrl: './not-found-page.component.html',
  imports: [
    TranslatePipe
  ],
  styleUrls: ['./not-found-page.component.css']
})
export class NotFoundPageComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private readonly defaultValue = 5;
  private routerSubscription!: Subscription;
  private interval!: NodeJS.Timeout;
  protected readonly redirectSeconds = signal(this.defaultValue);

  ngOnInit() {
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

  private startRedirectCountdown() {
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
