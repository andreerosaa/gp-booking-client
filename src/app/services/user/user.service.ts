import { DestroyRef, inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CreatePatientRequest, GetPatientByEmailRequest, PatientModel, UpdatePatientNameRequest, VerifyPatientRequest } from '../../models/patient.model';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserModel } from '../../models/user.model';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _http = inject(HttpClient);
	private readonly _apiUrl = `${environment.API_BASE_URL}/user`;

	verifyPatient(userId: string, verificationCode: number): Observable<UserModel> {
		const request: VerifyPatientRequest = { verificationCode: verificationCode };

		return this._http.post<UserModel>(`${this._apiUrl}/verify/${userId}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	getVerificationCode(userId: string): Observable<UserModel> {

		return this._http.get<UserModel>(`${this._apiUrl}/code/${userId}`).pipe(takeUntilDestroyed(this._destroyRef));
	}

	// getPatientByEmail(patiendEmail: string): Observable<UserModel> {
	// 	const request: GetPatientByEmailRequest = { email: patiendEmail };

	// 	return this._http.post<UserModel>(`${this._apiUrl}/email`, request).pipe(takeUntilDestroyed(this._destroyRef));
	// }

	// createPatient(patiendEmail: string, patientName: string): Observable<PatientModel> {
	// 	const request: CreatePatientRequest = { email: patiendEmail, name: patientName, verified: false };

	// 	return this._http.post<PatientModel>(`${this._apiUrl}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	// }

	// updatePatientName(patientId: string, patientEmail: string, patientName: string): Observable<PatientModel> {
	// 	const request: UpdatePatientNameRequest = { name: patientName, email: patientEmail };

	// 	return this._http.post<PatientModel>(`${this._apiUrl}/name/${patientId}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	// }

	getUsers(): Observable<UserModel[]> {

		return this._http.get<UserModel[]>(this._apiUrl).pipe(takeUntilDestroyed(this._destroyRef));
	}
}
