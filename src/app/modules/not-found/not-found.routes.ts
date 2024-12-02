import { Route } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const notFoundRoutes: Route[] = [
	{
		path: '',
		component: NotFoundComponent
	}
];
