import { Route } from '@angular/router';
import { PricingComponent } from './components/pricing/pricing.component';

export const pricingRoutes: Route[] = [
	{
		path: '',
		component: PricingComponent
	},
	{
		path: '**',
		loadChildren: () => import('../not-found/not-found.module').then((m) => m.NotFoundModule)
	}
];
