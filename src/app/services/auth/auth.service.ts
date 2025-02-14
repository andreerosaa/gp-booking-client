import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { LoginUserRequest, LoginUserResponse, RoleEnum } from '../../models/user.model';
import { environment } from '../../../environments/environment.development';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseResponse } from '../../models/base.model';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _http = inject(HttpClient);
	private readonly _router = inject(Router);
	private readonly _apiUrl = `${environment.API_BASE_URL}/user`;
	private readonly jwtHelper = new JwtHelperService();

	login(email: string, password: string): Observable<LoginUserResponse> {
		const credentials: LoginUserRequest = { email: email, password: password };

		return this._http.post<LoginUserResponse>(`${this._apiUrl}/login`, credentials, { withCredentials: true }).pipe(
			takeUntilDestroyed(this._destroyRef),
			tap((loginResponse: LoginUserResponse) => this.setAccessToken(loginResponse.accessToken))
		);
	}

	logout(): Observable<BaseResponse> {
		return this._http.post<BaseResponse>(`${this._apiUrl}/logout`, {}).pipe(
			takeUntilDestroyed(this._destroyRef),
			tap(() => {
				this.setAccessToken('');
				this._router.navigate(['/']).then(() => window.location.reload());
			})
		);
	}

	setAccessToken(token: string): void {
		localStorage.setItem('accessToken', token);
	}

	getAccessToken(): string | null {
		return localStorage.getItem('accessToken');
	}

	getUserRole(): string | null {
		const token = this.getAccessToken();
		if (token) {
			const decodedToken = this.jwtHelper.decodeToken(token);
			return decodedToken?.role || null;
		}
		return null;
	}

	getUserId(): string | null {
		const token = this.getAccessToken();
		if (token) {
			const decodedToken = this.jwtHelper.decodeToken(token);
			return decodedToken?.sub || null;
		}
		return null;
	}

	isLoggedIn(): boolean {
		return !!this.getAccessToken();
	}

	isAdmin(): boolean {
		return this.getUserRole() === RoleEnum.ADMIN;
	}

	isPatient(): boolean {
		return this.getUserRole() === RoleEnum.PATIENT;
	}

	refreshToken(): Observable<LoginUserResponse | BaseResponse> {
		return this._http.post<LoginUserResponse>(`${this._apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
			takeUntilDestroyed(this._destroyRef),
			catchError(() => this.logout()),
			tap((refreshTokenResponse: LoginUserResponse | BaseResponse) => {
				if ('accessToken' in refreshTokenResponse) {
					this.setAccessToken(refreshTokenResponse.accessToken);
				}
			})
		);
	}
}
