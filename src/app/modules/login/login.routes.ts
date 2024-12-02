import { Route } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

export const loginRoutes: Route[] = [
	{
		path: '',
		component: LoginComponent
	},
	{
		path: '**',
		loadChildren: () => import('../not-found/not-found.module').then((m) => m.NotFoundModule)
	}
];
