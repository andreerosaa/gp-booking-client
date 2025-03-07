import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MainComponent } from './components/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { DateTabsComponent } from './components/date-tabs/date-tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import localePt from '@angular/common/locales/pt-PT';
import { registerLocaleData } from '@angular/common';
import { DayPanelComponent } from './components/day-panel/day-panel.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SessionCardComponent } from './components/session-card/session-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { authInterceptor } from './services/auth/interceptor/auth.inteceptor';
import { refreshTokenInterceptor } from './services/auth/interceptor/refresh-token.inteceptor';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { CreateEditSessionDialogComponent } from './components/create-edit-session-dialog/create-edit-session-dialog.component';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { CreateFromTemplateDialogComponent } from './components/create-from-template-dialog/create-from-template-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AdminBookingDialogComponent } from './components/admin-booking-dialog/admin-booking-dialog.component';
import { SharedModule } from './modules/shared/shared.module';

registerLocaleData(localePt);

@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		HeaderComponent,
		DateTabsComponent,
		DayPanelComponent,
		SessionCardComponent,
		AdminBookingDialogComponent,
		SnackBarComponent,
		ConfirmationDialogComponent,
		CreateEditSessionDialogComponent,
		CreateFromTemplateDialogComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		SharedModule,
		MatTabsModule,
		MatProgressSpinnerModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		ReactiveFormsModule,
		MatSnackBarLabel,
		MatSnackBarActions,
		MatSnackBarAction,
		MatCheckboxModule,
		MatSlideToggleModule,
		MatTooltipModule,
		MatMenuModule,
		MatTimepickerModule,
		MatAutocompleteModule,
		MatSelectModule,
		MatDatepickerModule
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'pt-PT' },
		provideAnimationsAsync(),
		provideHttpClient(withInterceptors([authInterceptor, refreshTokenInterceptor])),
		provideNativeDateAdapter(),
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
