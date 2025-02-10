import { Route } from '@angular/router';
import { LoginRegisterComponent } from './components/login-register/login-register.component';

export const loginRoutes: Route[] = [
	{
		path: '',
		component: LoginRegisterComponent
	},
	{
		path: '**',
		loadChildren: () => import('../not-found/not-found.module').then((m) => m.NotFoundModule)
	}
];
