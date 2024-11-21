import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { SessionModel } from '../../models/session.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SessionByDateRequestModel } from '../../models/sessionByDateRequest.model';

@Injectable({
	providedIn: 'root'
})
export class SessionService {
	private _apiUrl = `${environment.API_BASE_URL}/session`;

	constructor(private http: HttpClient) {}

	getSessionsByDate(selectedDate: Date): Observable<SessionModel[]> {
		const request: SessionByDateRequestModel = { date: selectedDate };

		return this.http.post<SessionModel[]>(`${this._apiUrl}/date`, request);
	}
}
