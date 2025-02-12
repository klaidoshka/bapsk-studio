import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.css'],
})
export class NotFoundPageComponent {
  private router = inject(Router);

  private readonly interval: NodeJS.Timeout;

  public redirectSeconds = signal(5);

  constructor() {
    this.interval = setInterval(() => {
      if (this.redirectSeconds() <= 1) {
        clearInterval(this.interval);
        this.router.navigate(['/']);
      } else {
        this.redirectSeconds.update(v => v - 1);
      }
    }, 1000);
  }
}
