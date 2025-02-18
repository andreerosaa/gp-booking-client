import { Route } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { authGuard } from '../../guards/auth/auth.guard';
import { RoleEnum } from '../../models/user.model';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserSessionsComponent } from './components/user-sessions/user-sessions.component';

export const usersRoutes: Route[] = [
	{
		path: '',
		pathMatch: 'full',
		canActivate: [authGuard],
		data: { roles: [RoleEnum.ADMIN] },
		component: UsersComponent
	},
	{
		path: ':id',
		pathMatch: 'full',
		canActivate: [authGuard],
		data: { roles: [RoleEnum.ADMIN, RoleEnum.PATIENT] },
		component: UserDetailsComponent,
	},
	{
		path: ':id/sessions',
		pathMatch: 'full',
		canActivate: [authGuard],
		data: { roles: [RoleEnum.PATIENT] },
		component: UserSessionsComponent,
	},
	{
		path: '**',
		loadChildren: () => import('../not-found/not-found.module').then((m) => m.NotFoundModule)
	}
];
