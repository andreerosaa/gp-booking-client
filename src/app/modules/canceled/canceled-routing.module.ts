import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { canceledRoutes } from './canceled.routes';

@NgModule({
	imports: [RouterModule.forChild(canceledRoutes)],
	exports: [RouterModule]
})
export class CanceledRoutingModule {}
