import { Component, inject, model, OnInit, ViewChild } from '@angular/core';
import { DatesService } from '../../services/dates/dates.service';
import { MatTabGroup } from '@angular/material/tabs';
import { AuthService } from '../../services/auth/auth.service';

@Component({
	selector: 'app-date-tabs',
	standalone: false,

	templateUrl: './date-tabs.component.html',
	styleUrl: './date-tabs.component.scss'
})
export class DateTabsComponent implements OnInit {
	@ViewChild('tabGroup') tabGroup!: MatTabGroup;

	private readonly _datesService = inject(DatesService);
	private readonly _authService = inject(AuthService);

	selected = model<Date | null>(null);
	dateRange: Date[] = [];
	today = new Date();
	minDate = !this._authService.isLoggedIn() ? this.today : null; //TODO: set min date for logged user to be 1 year behind (env.variable)

	ngOnInit(): void {
		this.dateRange = this._datesService.getDateRange();
	}

	resetSelectedTab() {
		this.tabGroup.selectedIndex = this.dateRange.findIndex((date) => date.getDate() === this.today.getDate());
		this.selected.set(this.today);
	}
}
