import { Route } from '@angular/router';
import { MainComponent } from './components/main/main.component';

export const appRoutes: Route[] = [
	{
		path: '',
		component: MainComponent
	},
	{
		path: 'login',
		pathMatch: 'full',
		loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule)
	},
	{
		path: 'confirmed',
		pathMatch: 'full',
		loadChildren: () => import('./modules/confirmed/confirmed.module').then((m) => m.ConfirmedModule)
	},
	{
		path: 'canceled',
		pathMatch: 'full',
		loadChildren: () => import('./modules/canceled/canceled.module').then((m) => m.CanceledModule)
	},
	{
		path: 'terms',
		pathMatch: 'full',
		loadChildren: () => import('./modules/terms/terms.module').then((m) => m.TermsModule)
	},
	{
		path: 'pricing',
		pathMatch: 'full',
		loadChildren: () => import('./modules/pricing/pricing.module').then((m) => m.PricingModule)
	},
	{
		path: '**',
		loadChildren: () => import('./modules/not-found/not-found.module').then((m) => m.NotFoundModule)
	}
];
