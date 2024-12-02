import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { notFoundRoutes } from './not-found.routes';

@NgModule({
	imports: [RouterModule.forChild(notFoundRoutes)],
	exports: [RouterModule]
})
export class NotFoundRoutingModule {}
