import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmedComponent } from './components/confirmed/confirmed.component';
import { ConfirmedRoutingModule } from './confirmed-routing.module';



@NgModule({
  declarations: [ConfirmedComponent],
  imports: [
    CommonModule,
    ConfirmedRoutingModule
  ]
})
export class ConfirmedModule { }
