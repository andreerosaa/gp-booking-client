import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appNoSpaces]',
  standalone: false
})
export class NoSpacesDirective {
  private readonly _hostElement = inject(ElementRef)

  // Prevent space from being typed
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  // Prevent spaces from being pasted
  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');

    if (pastedText.includes(' ')) {
      event.preventDefault();
    }
  }

  // Remove spaces if any exist after input
  @HostListener('input', ['$event']) onInput(event: any) {
    this._hostElement.nativeElement.value = this._hostElement.nativeElement.value.replace(/\s/g, '');
  }
}
