import { Route } from '@angular/router';
import { ConfirmedComponent } from './components/confirmed/confirmed.component';

export const confirmedRoutes: Route[] = [
	{
		path: '',
		component: ConfirmedComponent
	},
	{
		path: '**',
		loadChildren: () => import('../not-found/not-found.module').then((m) => m.NotFoundModule)
	}
];
