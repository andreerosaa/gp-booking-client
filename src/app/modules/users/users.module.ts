import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './components/users/users.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UsersRoutingModule } from './users-routing.module';
import { UserSessionsComponent } from './components/user-sessions/user-sessions.component';

@NgModule({
	declarations: [UsersComponent, UserDetailsComponent, UserSessionsComponent],
	imports: [CommonModule, UsersRoutingModule]
})
export class UsersModule {}
