import {Component, effect, signal} from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'scroll-to-top',
  imports: [
    Button
  ],
  templateUrl: './scroll-to-top.component.html',
  styles: ``
})
export class ScrollToTopComponent {
  protected readonly show = signal<boolean>(false);

  constructor() {
    effect((onCleanup) => {
      const onScroll = () => this.show.set(window.scrollY > 250);
      window.addEventListener('scroll', onScroll);
      onScroll();
      onCleanup(() => window.removeEventListener('scroll', onScroll));
    });
  }

  protected scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
