import { DestroyRef, inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CreatePatientRequest, GetPatientByEmailRequest, PatientModel, UpdatePatientNameRequest, VerifyPatientRequest } from '../../models/patient.model';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
	providedIn: 'root'
})
export class PatientService {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _http = inject(HttpClient);
	private readonly _apiUrl = `${environment.API_BASE_URL}/patient`;

	verifyPatient(patiendId: string, verificationCode: number): Observable<PatientModel> {
		const request: VerifyPatientRequest = { verificationCode: verificationCode };

		return this._http.post<PatientModel>(`${this._apiUrl}/verify/${patiendId}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	getVerificationCode(patiendId: string): Observable<PatientModel> {

		return this._http.get<PatientModel>(`${this._apiUrl}/code/${patiendId}`).pipe(takeUntilDestroyed(this._destroyRef));
	}

	getPatientByEmail(patiendEmail: string): Observable<PatientModel> {
		const request: GetPatientByEmailRequest = { email: patiendEmail };

		return this._http.post<PatientModel>(`${this._apiUrl}/email`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	createPatient(patiendEmail: string, patientName: string): Observable<PatientModel> {
		const request: CreatePatientRequest = { email: patiendEmail, name: patientName, verified: false };

		return this._http.post<PatientModel>(`${this._apiUrl}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	updatePatientName(patientId: string, patientEmail: string, patientName: string): Observable<PatientModel> {
		const request: UpdatePatientNameRequest = { name: patientName, email: patientEmail };

		return this._http.post<PatientModel>(`${this._apiUrl}/name/${patientId}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	getPatients(): Observable<PatientModel[]> {

		return this._http.get<PatientModel[]>(this._apiUrl).pipe(takeUntilDestroyed(this._destroyRef));
	}
}
