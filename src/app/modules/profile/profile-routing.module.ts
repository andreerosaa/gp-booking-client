import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { profileRoutes } from './profile.routes';

@NgModule({
	imports: [RouterModule.forChild(profileRoutes)],
	exports: [RouterModule]
})
export class ProfileRoutingModule {}
