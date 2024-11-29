import { DestroyRef, inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { SessionModel } from '../../models/session.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BookSessionRequestModel, BookSessionResponse } from '../../models/bookSessionRequest.model';
import { SessionByDateRequestModel } from '../../models/sessionByDateRequest.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
	providedIn: 'root'
})
export class SessionService {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _http = inject(HttpClient);
	private readonly _apiUrl = `${environment.API_BASE_URL}/session`;

	getSessionsByDate(selectedDate: Date): Observable<SessionModel[]> {
		const request: SessionByDateRequestModel = { date: selectedDate };

		return this._http.post<SessionModel[]>(`${this._apiUrl}/date`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	bookSession(sessionId: string, name: string, email: string): Observable<BookSessionResponse> {
		const request: BookSessionRequestModel = { patientName: name, email: email };

		return this._http.post<BookSessionResponse>(`${this._apiUrl}/book/${sessionId}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}
}
