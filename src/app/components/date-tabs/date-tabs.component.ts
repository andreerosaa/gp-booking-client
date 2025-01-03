import { Component, OnInit, ViewChild } from '@angular/core';
import { DatesService } from '../../services/dates/dates.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
	selector: 'app-date-tabs',
	standalone: false,

	templateUrl: './date-tabs.component.html',
	styleUrl: './date-tabs.component.scss'
})
export class DateTabsComponent implements OnInit {
	
	@ViewChild('tabGroup') tabGroup!: MatTabGroup;
	
	dateRange: Date[] = [];
	today = new Date();

	constructor(private readonly _datesService: DatesService) {}

	ngOnInit(): void {
		this.dateRange = this._datesService.getDateRange();
	}

	resetSelectedTab() {
		this.tabGroup.selectedIndex = this.dateRange.findIndex((date) => date.getDate() === this.today.getDate());
	}
}
