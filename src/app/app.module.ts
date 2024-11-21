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
import { provideHttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

registerLocaleData(localePt);

@NgModule({
	declarations: [AppComponent, MainComponent, HeaderComponent, DateTabsComponent, DayPanelComponent],
	imports: [BrowserModule, AppRoutingModule, MatTabsModule, MatProgressSpinnerModule],
	providers: [{ provide: LOCALE_ID, useValue: 'pt-PT' }, provideAnimationsAsync(), provideHttpClient()],
	bootstrap: [AppComponent]
})
export class AppModule {}
