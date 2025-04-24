import {Directive, ElementRef, OnDestroy, output} from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective implements OnDestroy {
  clickOutside = output();

  private listener = (event: MouseEvent) => {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.clickOutside.emit();
    }
  };

  constructor(private elementRef: ElementRef) {
    document.addEventListener('click', this.listener, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.listener, true);
  }
}
