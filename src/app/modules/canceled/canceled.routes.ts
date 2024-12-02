import { Route } from '@angular/router';
import { CanceledComponent } from './components/canceled/canceled.component';

export const canceledRoutes: Route[] = [
	{
		path: '',
		component: CanceledComponent
	},
	{
		path: '**',
		loadChildren: () => import('../../modules/not-found/not-found.module').then((m) => m.NotFoundModule)
	}
];
