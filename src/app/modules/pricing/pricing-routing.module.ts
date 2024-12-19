import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { pricingRoutes } from './pricing.routes';

@NgModule({
	imports: [RouterModule.forChild(pricingRoutes)],
	exports: [RouterModule]
})
export class PricingRoutingModule {}
