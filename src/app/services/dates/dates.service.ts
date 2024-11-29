import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
	providedIn: 'root'
})
export class DatesService {
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
}
