import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { templatesRoutes } from './templates.routes';

@NgModule({
	imports: [RouterModule.forChild(templatesRoutes)],
	exports: [RouterModule]
})
export class TemplatesRoutingModule {}
