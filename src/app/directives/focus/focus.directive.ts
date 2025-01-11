import { Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({
  selector: '[focus]',
  standalone: false
})
export class FocusDirective {
  private readonly hostElement = inject(ElementRef)

  @Input()
  set focus(focus: boolean) {
    if (focus) {
      this.hostElement.nativeElement.focus();
    }
  }
}
