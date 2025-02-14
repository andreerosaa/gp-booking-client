import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HidePipe } from '../../pipes/hide/hide.pipe';
import { FocusDirective } from '../../directives/focus/focus.directive';
import { NoSpacesDirective } from '../../directives/no-spaces/no-spaces.directive';



@NgModule({
  declarations: [HidePipe, FocusDirective, NoSpacesDirective],
  exports: [HidePipe, FocusDirective, NoSpacesDirective],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
