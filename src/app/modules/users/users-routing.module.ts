import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { usersRoutes } from './users.routes';

@NgModule({
	imports: [RouterModule.forChild(usersRoutes)],
	exports: [RouterModule]
})
export class UsersRoutingModule {}
