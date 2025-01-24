import { Component, computed, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { DatesService } from '../../services/dates/dates.service';
import { MatTabGroup } from '@angular/material/tabs';
import { AuthService } from '../../services/auth/auth.service';
import { MatCalendar } from '@angular/material/datepicker';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
	selector: 'app-date-tabs',
	standalone: false,
	templateUrl: './date-tabs.component.html',
	styleUrl: './date-tabs.component.scss'
})
export class DateTabsComponent implements OnInit {
	@ViewChild('tabGroup') tabGroup!: MatTabGroup;
	@ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
	@ViewChild('drawer', { static: true }) drawer!: MatDrawer;

	private readonly _datesService = inject(DatesService);
	private readonly _authService = inject(AuthService);

	dateRange: Date[] = [];
	today = new Date();
	minDate = new Date();
	maxDate = new Date();

	selectedDate = signal<Date | null>(this.today);
	selectedIndex = computed<number>(() =>
		this.dateRange.findIndex(
			(date) =>
				date.getDate() === this.selectedDate()?.getDate() &&
				date.getMonth() === this.selectedDate()?.getMonth() &&
				date.getFullYear() === this.selectedDate()?.getFullYear()
		)
	);
	effect = effect(() => {
		this.selectedIndex();
		if (!this.drawer.opened) {
			this.drawer.toggle();
		}
	});

	ngOnInit(): void {
		this.dateRange = this._datesService.getDateRange();
		this.minDate = this.dateRange[0];
		this.maxDate = this.dateRange[this.dateRange.length - 1];
	}

	resetSelectedTab() {
		this.tabGroup.selectedIndex = this.dateRange.findIndex((date) => date.getDate() === this.today.getDate());
		this.selectedDate.set(this.today);
		this.calendar._goToDateInView(this.today, 'month');
	}

	setSelectedDate(index: number) {
		this.selectedDate.set(this.dateRange[index]);
	}
}
