import { Route } from '@angular/router';
import { TemplatesComponent } from './components/templates/templates.component';

export const templatesRoutes: Route[] = [
	{
		path: '',
		component: TemplatesComponent
	},
	{
		path: '**',
		loadChildren: () => import('../not-found/not-found.module').then((m) => m.NotFoundModule)
	}
];
