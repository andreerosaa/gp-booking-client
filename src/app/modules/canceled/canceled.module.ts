import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanceledComponent } from './components/canceled/canceled.component';
import { CanceledRoutingModule } from './canceled-routing.module';



@NgModule({
  declarations: [CanceledComponent],
  imports: [
    CommonModule,
    CanceledRoutingModule
  ]
})
export class CanceledModule { }
