import { AfterViewInit, Component, computed, effect, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { DatesService } from '../../services/dates/dates.service';
import { MatTabGroup } from '@angular/material/tabs';
import { MatCalendar } from '@angular/material/datepicker';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { SessionService } from '../../services/session/session.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DayStatusByMonth } from '../../models/session.model';

@Component({
	selector: 'app-date-tabs',
	standalone: false,
	templateUrl: './date-tabs.component.html',
	styleUrl: './date-tabs.component.scss'
})
export class DateTabsComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('tabGroup') tabGroup!: MatTabGroup;
	@ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
	@ViewChild('drawer', { static: true }) drawer!: MatDrawer;

	private readonly _datesService = inject(DatesService);
	private readonly _sessionService = inject(SessionService);
	private _subscription!: Subscription;

	dateRange: Date[] = [];
	today = new Date();
	minDate = new Date();
	maxDate = new Date();
	monthYearView: number[] = [this.today.getMonth(), this.today.getFullYear()];

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

	ngAfterViewInit() {
		this._subscription = this.calendar.stateChanges.subscribe(() => {
			const currentMonthYearView = [this.calendar.activeDate.getMonth(), this.calendar.activeDate.getFullYear()];
			if (!this._compareArrays(this.monthYearView, currentMonthYearView)) {
				this.monthYearView = [this.calendar.activeDate.getMonth(), this.calendar.activeDate.getFullYear()];
				this.getMonthlySessions();
			}
		});
	}

	ngOnDestroy() {
		if (this._subscription) {
			this._subscription.unsubscribe();
		}
	}

	resetSelectedTab() {
		this.tabGroup.selectedIndex = this.dateRange.findIndex((date) => date.getDate() === this.today.getDate());
		this.selectedDate.set(this.today);
		this.calendar._goToDateInView(this.today, 'month');
	}

	setSelectedDate(index: number) {
		this.selectedDate.set(this.dateRange[index]);
	}

	getMonthlySessions() {
		this._sessionService.getMonthlySessions(this.monthYearView).subscribe({
			next: (response: DayStatusByMonth) => {
				//TODO: get days with available sessions
				console.log(response);
			},
			error: (error: HttpErrorResponse) => {
				console.error(error);
			}
		});
	}

	private _compareArrays(arr1: number[], arr2: number[]) {
		return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
	}
}
