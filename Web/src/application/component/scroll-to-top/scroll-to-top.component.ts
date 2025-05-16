import {Component, effect, input, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'scroll-to-top',
  imports: [
    Button,
    TranslatePipe
  ],
  templateUrl: './scroll-to-top.component.html',
  styles: ``
})
export class ScrollToTopComponent {
  protected readonly show = signal<boolean>(false);
  readonly container = input<HTMLElement>();

  constructor() {
    effect((onCleanup) => {
      const container = this.container() || window;
      const isWindow = container === window;

      const onScroll = () => {
        const scrollPosition = isWindow
          ? container.scrollY
          : (container as HTMLElement).scrollTop;
        this.show.set(scrollPosition > 250);
      };

      container.addEventListener('scroll', onScroll);

      onScroll();

      onCleanup(() => {
        container.removeEventListener('scroll', onScroll);
      });
    });
  }

  protected scrollToTop() {
    const container = this.container() || window;
    if (container === window) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      (container as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
