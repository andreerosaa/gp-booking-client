import { Route } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';

export const profileRoutes: Route[] = [
	{
		path: '',
		component: ProfileComponent
	},
	{
		path: '**',
		loadChildren: () => import('../not-found/not-found.module').then((m) => m.NotFoundModule)
	}
];
