import { DestroyRef, inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BookSessionRequestModel, BookSessionResponse, CreateSessionFormValue, CreateSessionRequestModel, SessionByDateModel, SessionByDateRequestModel, SessionModel, SessionStatusEnum } from '../../models/session.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseResponse } from '../../models/base.model';

@Injectable({
	providedIn: 'root'
})
export class SessionService {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _http = inject(HttpClient);
	private readonly _apiUrl = `${environment.API_BASE_URL}/session`;

	getSessionsByDate(selectedDate: Date): Observable<SessionByDateModel[]> {
		const request: SessionByDateRequestModel = { date: selectedDate };

		return this._http.post<SessionByDateModel[]>(`${this._apiUrl}/date`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	getSessionsByDateDetailed(selectedDate: Date): Observable<SessionByDateModel[]> {
		const request: SessionByDateRequestModel = { date: selectedDate };

		return this._http.post<SessionByDateModel[]>(`${this._apiUrl}/date-detailed`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	bookSession(sessionId: string, name: string, email: string): Observable<BookSessionResponse> {
		const request: BookSessionRequestModel = { patientName: name, email: email };

		return this._http.post<BookSessionResponse>(`${this._apiUrl}/book/${sessionId}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	createSession(createSessionForm: CreateSessionFormValue): Observable<SessionModel> {
		const request: CreateSessionRequestModel = { 
			date: createSessionForm.date,
			therapistId: createSessionForm.therapist._id,
			durationInMinutes: createSessionForm.durationInMinutes,
			vacancies: createSessionForm.vacancies,
			status: SessionStatusEnum.AVAILABLE
		};

		return this._http.post<SessionModel>(`${this._apiUrl}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	deleteSession(sessionId: string): Observable<BaseResponse> {

		return this._http.delete<BaseResponse>(`${this._apiUrl}/delete/${sessionId}`).pipe(takeUntilDestroyed(this._destroyRef));
	}
}
