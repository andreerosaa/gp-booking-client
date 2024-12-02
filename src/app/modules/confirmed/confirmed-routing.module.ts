import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { confirmedRoutes } from './confirmed.routes';

@NgModule({
	imports: [RouterModule.forChild(confirmedRoutes)],
	exports: [RouterModule]
})
export class ConfirmedRoutingModule {}
