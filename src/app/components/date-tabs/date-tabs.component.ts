import { AfterViewInit, Component, computed, effect, inject, OnDestroy, OnInit, Renderer2, signal, viewChild } from '@angular/core';
import { DatesService } from '../../services/dates/dates.service';
import { MatTabGroup } from '@angular/material/tabs';
import { MatCalendar } from '@angular/material/datepicker';
import { debounceTime, Subscription } from 'rxjs';
import { SessionService } from '../../services/session/session.service';
import { DayStatusByMonth, DayStatusEnum, DayStatusMap } from '../../models/session.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-date-tabs',
	standalone: false,
	templateUrl: './date-tabs.component.html',
	styleUrl: './date-tabs.component.scss'
})
export class DateTabsComponent implements OnInit, AfterViewInit, OnDestroy {
	tabGroup = viewChild.required<MatTabGroup>('tabGroup');
	calendar = viewChild.required<MatCalendar<Date>>(MatCalendar);

	private readonly _datesService = inject(DatesService);
	private readonly _sessionService = inject(SessionService);
	private readonly _renderer = inject(Renderer2);

	private _subscription!: Subscription;

	today = new Date();
	minDate = new Date();
	maxDate = new Date();
	monthYearView: number[] = [this.today.getMonth(), this.today.getFullYear()];
	dayDates!: DayStatusByMonth;

	selectedDate = signal<Date>(this.today);
	dateRange = computed<Date[]>(() => {
		const dates: Date[] = [];
		for (let i = 0; i <= 6; i++) {
			let newDay = new Date(this.selectedDate());
			newDay.setDate(newDay.getDate() + i);

			dates.push(newDay);
		}
		return dates;
	});
	selectedIndex = effect(() => {
		this.tabGroup().selectedIndex = this.dateRange().findIndex((date) => date.getTime() === this.selectedDate().getTime());
	});

	ngOnInit() {
		const dateInterval = this._datesService.getDateRange();
		this.minDate = dateInterval.startDate;
		this.maxDate = dateInterval.endDate;
		this.getMonthlySessions();
	}

	ngAfterViewInit() {
		this._subscription = this.calendar()
			.stateChanges.pipe(debounceTime(200))
			.subscribe(() => {
				const currentMonthYearView = [this.calendar().activeDate.getMonth(), this.calendar().activeDate.getFullYear()];
				if (!this._compareArrays(this.monthYearView, currentMonthYearView)) {
					this.monthYearView = [this.calendar().activeDate.getMonth(), this.calendar().activeDate.getFullYear()];
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
		this.selectedDate.set(this.today);
		this.calendar()._goToDateInView(this.today, 'month');
	}

	setSelectedDate(index: number) {
		this.selectedDate.set(this.dateRange()[index]);
	}

	getMonthlySessions() {
		this._sessionService.getMonthlySessions(this.monthYearView).subscribe({
			next: (response: DayStatusByMonth) => {
				this.dayDates = response;
				let spanDates = document.querySelectorAll('.mat-calendar-body-cell:not(.mat-calendar-body-disabled) .mat-calendar-body-cell-content');
				if (spanDates?.length > 0) {
					spanDates.forEach((spanDate) => {
						const dateValue = Number(spanDate.textContent);
						const dateObj = new Date(this.monthYearView[1], this.monthYearView[0], dateValue);
						const dateMap = this._getDateClass(dateObj);
						const dateClass = DayStatusMap.get(dateMap)?.dateClass;
						const dateTooltip = DayStatusMap.get(dateMap)?.toolTip;

						if (dateClass && dateTooltip) {
							const ball = this._renderer.createElement('span');
							this._renderer.addClass(ball, 'ball');
							this._renderer.addClass(ball, dateClass);
							this._renderer.appendChild(spanDate.parentElement, ball);
						}
					});
				}
			},
			error: (error: HttpErrorResponse) => {
				console.error(error);
			}
		});
	}

	private _getDateClass(date: Date): DayStatusEnum {
		if (!this.dayDates) {
			return DayStatusEnum.NONE;
		}

		const isAvailable = this._findDates(date, this.dayDates.available);

		if (isAvailable !== undefined) {
			return DayStatusEnum.AVAILABLE;
		}

		const isPending = this._findDates(date, this.dayDates.pending);

		if (isPending !== undefined) {
			return DayStatusEnum.PENDING;
		}

		const isFull = this._findDates(date, this.dayDates.full);

		if (isFull !== undefined) {
			return DayStatusEnum.FULL;
		}

		const isCompleted = this._findDates(date, this.dayDates.completed);

		if (isCompleted !== undefined) {
			return DayStatusEnum.COMPLETED;
		}

		return DayStatusEnum.NONE;
	}

	private _findDates(date: Date, dayDates: Date[]) {
		if (!dayDates || dayDates.length === 0) {
			return;
		}
		return dayDates.find((day) => {
			const dayObj = new Date(day);
			const compareDay = dayObj.getDate() === date.getDate();
			const compareMonth = dayObj.getMonth() === date.getMonth();
			const compareYear = dayObj.getFullYear() === date.getFullYear();
			return compareDay && compareMonth && compareYear;
		});
	}

	private _compareArrays(arr1: number[], arr2: number[]) {
		return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
	}
}
