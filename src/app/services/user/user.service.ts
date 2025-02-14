import { DestroyRef, inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RegisterUserRequest, RegisterUserResponse, UserModel, VerifyUserRequest } from '../../models/user.model';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _http = inject(HttpClient);
	private readonly _apiUrl = `${environment.API_BASE_URL}/user`;

	register(name: string, surname: string, email: string, password: string): Observable<RegisterUserResponse> {
		const request: RegisterUserRequest = {
			name: name,
			surname: surname,
			email: email,
			password: password
		};

		return this._http.post<RegisterUserResponse>(`${this._apiUrl}/register`, request, { withCredentials: true }).pipe(
			takeUntilDestroyed(this._destroyRef)
		);
	}

	verifyUser(userId: string, verificationCode: number): Observable<UserModel> {
		const request: VerifyUserRequest = { verificationCode: verificationCode };

		return this._http.post<UserModel>(`${this._apiUrl}/verify/${userId}`, request).pipe(takeUntilDestroyed(this._destroyRef));
	}

	getVerificationCode(userId: string): Observable<UserModel> {

		return this._http.get<UserModel>(`${this._apiUrl}/code/${userId}`).pipe(takeUntilDestroyed(this._destroyRef));
	}

	getUsers(): Observable<UserModel[]> {

		return this._http.get<UserModel[]>(this._apiUrl).pipe(takeUntilDestroyed(this._destroyRef));
	}

	getPersonalDataById(userId: string): Observable<UserModel> {

		return this._http.get<UserModel>(`${this._apiUrl}/me/${userId}`).pipe(takeUntilDestroyed(this._destroyRef));
	}
}
