import { Route } from '@angular/router';
import { TermsComponent } from './components/terms/terms.component';

export const termsRoutes: Route[] = [
	{
		path: '',
		component: TermsComponent
	},
	{
		path: '**',
		loadChildren: () => import('../not-found/not-found.module').then((m) => m.NotFoundModule)
	}
];
