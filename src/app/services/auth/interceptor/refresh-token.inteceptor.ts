import { inject } from '@angular/core';
import { HttpRequest, HttpErrorResponse, HttpHandlerFn, HttpStatusCode } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { LoginUserResponse } from '../../../models/user.model';
import { BaseResponse } from '../../../models/base.model';
import { Router } from '@angular/router';

export function refreshTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
	const authService = inject(AuthService);
	const router = inject(Router);

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status === HttpStatusCode.Forbidden) {
				return authService.refreshToken().pipe(
					switchMap((refreshTokenResponse: LoginUserResponse | BaseResponse) => {
            if('accessToken' in refreshTokenResponse) {
              const cloned = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${refreshTokenResponse.accessToken}`
                }
              });
              return next(cloned);
            } else {
              router.navigate(['/'])
              return EMPTY;
            }
					})
				);
			}
			return throwError(() => error);
		})
	);
}
