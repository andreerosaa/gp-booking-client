import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUserRequest, LoginUserResponse } from '../../models/user.model';
import { environment } from '../../../environments/environment.development';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = `${environment.API_BASE_URL}/user`;
  
  private accessToken: string | null = null;
  
  login(username: string, password: string): Observable<LoginUserResponse> {
    const credentials: LoginUserRequest = { username: username, password: password };

    return this._http.post<LoginUserResponse>(`${this._apiUrl}/login`, credentials).pipe(takeUntilDestroyed(this._destroyRef));
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  // refreshToken(): Observable<string> {
  //   return this.http.post<{ accessToken: string }>('/api/refresh-token', {}).pipe(
  //     tap((response) => {
  //       this.accessToken = response.accessToken;
  //     })
  //   );
  // }
}
