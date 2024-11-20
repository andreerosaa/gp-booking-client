import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
	providedIn: 'root'
})
export class DatesService {
	private _selectedDateSubject = new BehaviorSubject<Date>(new Date());

	selectedDate$ = this._selectedDateSubject.asObservable();

	getDateRange(): Date[] {
		// Get current Date
		const currentDate = new Date();

		// Compute days list from current Date
		const daysList = [];
		for (let i = 0; i < environment.DAYS_RANGE; i++) {
			let newDay = new Date();
			newDay.setDate(currentDate.getDate() + i);
			daysList.push(newDay);
		}
		return daysList;
	}

	setSelectedDate(date: Date) {
		this._selectedDateSubject.next(date);
	}
}
