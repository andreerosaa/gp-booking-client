import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MainComponent } from './components/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { DateTabsComponent } from './components/date-tabs/date-tabs.component';

@NgModule({
	declarations: [AppComponent, MainComponent, HeaderComponent, DateTabsComponent],
	imports: [BrowserModule, AppRoutingModule],
	providers: [provideAnimationsAsync()],
	bootstrap: [AppComponent]
})
export class AppModule {}
