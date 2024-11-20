import { Component, OnInit } from '@angular/core';
import { DatesService } from '../../services/dates/dates.service';

@Component({
	selector: 'app-date-tabs',
	standalone: false,

	templateUrl: './date-tabs.component.html',
	styleUrl: './date-tabs.component.scss'
})
export class DateTabsComponent implements OnInit {
	selectedDate!: Date;
	dateRange: Date[] = [];

	constructor(private _datesService: DatesService) {}

	ngOnInit(): void {
		this._datesService.selectedDate$.subscribe((date) => {
			this.selectedDate = date;
		});

		this.dateRange = this._datesService.getDateRange();
	}
}
