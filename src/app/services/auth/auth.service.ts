import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { LoginUserRequest, LoginUserResponse } from '../../models/user.model';
import { environment } from '../../../environments/environment.development';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseResponse } from '../../models/base.model';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _http = inject(HttpClient);
	private readonly _apiUrl = `${environment.API_BASE_URL}/user`;

	login(username: string, password: string): Observable<LoginUserResponse> {
		const credentials: LoginUserRequest = { username: username, password: password };

		return this._http.post<LoginUserResponse>(`${this._apiUrl}/login`, credentials, { withCredentials: true }).pipe(
			takeUntilDestroyed(this._destroyRef),
			tap((loginResponse: LoginUserResponse) => this.setAccessToken(loginResponse.accessToken))
		);
	}

	logout(): Observable<BaseResponse> {
		return this._http.post<BaseResponse>(`${this._apiUrl}/logout`, {}).pipe(
			takeUntilDestroyed(this._destroyRef),
			tap(() => this.setAccessToken(''))
		);
	}

	setAccessToken(token: string): void {
		localStorage.setItem('accessToken', token);
	}

	getAccessToken(): string | null {
		return localStorage.getItem('accessToken');
	}

	isLoggedIn(): boolean {
		return !!this.getAccessToken();
	}

	refreshToken(): Observable<LoginUserResponse | BaseResponse> {
		return this._http.post<LoginUserResponse>(`${this._apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
			takeUntilDestroyed(this._destroyRef),
      catchError(() => this.logout()),
			tap((refreshTokenResponse: LoginUserResponse | BaseResponse) => {
        if('accessToken' in refreshTokenResponse) {
          this.setAccessToken(refreshTokenResponse.accessToken)
        }
      })
		);
	}
}
