import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HidePipe } from '../../pipes/hide/hide.pipe';
import { FocusDirective } from '../../directives/focus/focus.directive';



@NgModule({
  declarations: [HidePipe, FocusDirective],
  exports: [HidePipe, FocusDirective],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
