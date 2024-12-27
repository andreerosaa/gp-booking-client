import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
	const token = inject(AuthService).getAccessToken();

	if (token) {
		const cloned = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
		return next(cloned);
	}
	return next(req);
}
