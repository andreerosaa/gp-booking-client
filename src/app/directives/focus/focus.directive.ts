import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[focus]',
  standalone: false
})
export class FocusDirective {
  constructor(private hostElement: ElementRef) {}

  @Input()
  set focus(focus: boolean) {
    if (focus) {
      this.hostElement.nativeElement.focus();
    }
  }
}
