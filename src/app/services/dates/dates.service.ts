import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../auth/auth.service';
import { DateInterval } from '../../models/dates.model';

@Injectable({
	providedIn: 'root'
})
export class DatesService {
	private readonly _authService = inject(AuthService);

	getDateRange(): DateInterval {
		const daysRange = environment.DAYS_RANGE;
		
		// Get current Date
		const currentDate = new Date();
		currentDate.setUTCHours(0,0,0,0);

		// Check if logged in
		if (this._authService.isAdmin()) {
			const startDate = new Date();
			startDate.setUTCDate(currentDate.getUTCDate() - daysRange);
			startDate.setUTCHours(0,0,0,0);

			const endDate = new Date();
			endDate.setUTCDate(currentDate.getUTCDate() + daysRange);
			endDate.setUTCHours(0,0,0,0);
			return { startDate: startDate, endDate: endDate};
		} else {
			const endDate = new Date();
			endDate.setUTCDate(currentDate.getUTCDate() + daysRange);
			endDate.setUTCHours(0,0,0,0);
			return { startDate: currentDate, endDate: endDate};
		}
	}
}
