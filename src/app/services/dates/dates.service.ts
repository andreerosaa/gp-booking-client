import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../auth/auth.service';

@Injectable({
	providedIn: 'root'
})
export class DatesService {

	private readonly _authService = inject(AuthService);

	getDateRange(): Date[] {
		let daysRange = 0;
		let startIndex = 0;
		// Check if logged in
		if(this._authService.isLoggedIn()) {
			daysRange = environment.DAYS_RANGE_ADMIN;
			startIndex = -daysRange -1
		} else {
			daysRange = environment.DAYS_RANGE;
		}

		// Get current Date
		const currentDate = new Date();

		// Compute days list from current Date
		const daysList = [];
		for (let i = startIndex; i <= daysRange; i++) {
			let newDay = new Date();
			newDay.setDate(currentDate.getDate() + i);
			daysList.push(newDay);
		}
		return daysList;
	}
}
