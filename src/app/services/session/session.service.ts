import { DestroyRef, inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
	BookSessionRequestModel,
	BookSessionResponse,
	CreateSessionFormValue,
	CreateEditSessionRequestModel,
	EditSessionFormValue,
	SessionByDateModel,
	SessionByDateRequestModel,
	SessionModel,
	SessionStatusEnum,
	CreateFromTemplateRequestModel,
	CreateFromTemplateFormValue,
	ClearDayRequestModel,
	GetDayStatusByMonthRequestModel,
	DayStatusByMonth
} from '../../models/session.model';
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

	bookSession(sessionId: string, email: string): Observable<BookSessionResponse> {
		const request: BookSessionRequestModel = { email: email };

		return this._http.post<BookSessionResponse>(`${this._apiUrl}/book/${sessionId}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	createSession(createSessionForm: CreateSessionFormValue): Observable<SessionModel> {
		const request: CreateEditSessionRequestModel = {
			date: createSessionForm.date,
			therapistId: createSessionForm.therapist.id,
			durationInMinutes: createSessionForm.durationInMinutes,
			vacancies: createSessionForm.vacancies,
			status: SessionStatusEnum.AVAILABLE
		};

		return this._http.post<SessionModel>(`${this._apiUrl}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	createRecurringSession(createSessionForm: CreateSessionFormValue): Observable<SessionModel[]> {
		const request: CreateEditSessionRequestModel = {
			date: createSessionForm.date,
			therapistId: createSessionForm.therapist.id,
			durationInMinutes: createSessionForm.durationInMinutes,
			vacancies: createSessionForm.vacancies,
			recurrence: createSessionForm.recurrence,
			status: SessionStatusEnum.AVAILABLE
		};

		return this._http.post<SessionModel[]>(`${this._apiUrl}/recurring`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	createFromTemplate(date: Date, createFromTemplateForm: CreateFromTemplateFormValue): Observable<SessionModel[]> {
		const request: CreateFromTemplateRequestModel = {
			date: date,
			templateId: createFromTemplateForm.template._id
		};

		return this._http.post<SessionModel[]>(`${this._apiUrl}/template`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	editSession(editSessionForm: EditSessionFormValue, sessionId: string): Observable<SessionModel> {
		const request: CreateEditSessionRequestModel = {
			date: editSessionForm.date,
			therapistId: editSessionForm.therapist.id,
			durationInMinutes: editSessionForm.durationInMinutes,
			status: editSessionForm.status,
			vacancies: editSessionForm.vacancies
		};

		return this._http.patch<SessionModel>(`${this._apiUrl}/update/${sessionId}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	deleteSession(sessionId: string): Observable<BaseResponse> {
		return this._http.delete<BaseResponse>(`${this._apiUrl}/delete/${sessionId}`).pipe(takeUntilDestroyed(this._destroyRef));
	}

	deleteRecurringSessions(seriesId: string): Observable<BaseResponse> {
		return this._http.delete<BaseResponse>(`${this._apiUrl}/recurring/delete/${seriesId}`).pipe(takeUntilDestroyed(this._destroyRef));
	}

	clearDaySessions(date: Date): Observable<BaseResponse> {
		const request: ClearDayRequestModel = {
			date: date
		};

		return this._http.post<BaseResponse>(`${this._apiUrl}/day/delete`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	getMonthlySessions(monthYearView: number[]): Observable<DayStatusByMonth> {
		const request: GetDayStatusByMonthRequestModel = {
			month: monthYearView[0],
			year: monthYearView[1]
		};

		return this._http.post<DayStatusByMonth>(`${this._apiUrl}/month`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}
}
