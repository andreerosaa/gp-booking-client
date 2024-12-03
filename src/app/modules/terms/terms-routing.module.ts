import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { termsRoutes } from './terms.routes';

@NgModule({
	imports: [RouterModule.forChild(termsRoutes)],
	exports: [RouterModule]
})
export class TermsRoutingModule {}
