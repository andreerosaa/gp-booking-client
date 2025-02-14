import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '../../../../services/snack-bar/snack-bar.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LoginForm, LoginUnverifiedUserResponse } from '../../../../models/user.model';

@Component({
	selector: 'app-login',
	standalone: false,
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent {
	verifyEmail = output<LoginUnverifiedUserResponse>();

	private readonly _destroyRef = inject(DestroyRef);
	private readonly _authService = inject(AuthService);
	private readonly _snackBarService = inject(SnackBarService);
	private readonly _router = inject(Router);

	protected readonly maxLength = 50;

	readonly hide = signal(true);
	readonly emailErrorMessage = signal('');
	readonly passwordErrorMessage = signal('');

	readonly loginForm = new FormGroup<LoginForm>({
		email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(this.maxLength)]),
		password: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)])
	});

	loading = false;

	constructor() {
		merge(this.getEmailControl.statusChanges, this.getEmailControl.valueChanges)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this.updateErrorMessage());
		merge(this.getPasswordControl.statusChanges, this.getPasswordControl.valueChanges)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this.updateErrorMessage());
	}

	updateErrorMessage() {
		if (this.getEmailControl.hasError('required')) {
			this.emailErrorMessage.set('Campo obrigatório');
		} else if (this.getEmailControl.hasError('email')) {
			this.emailErrorMessage.set('Introduza um email válido');
		} else {
			this.emailErrorMessage.set('');
		}

		if (this.getPasswordControl.hasError('required')) {
			this.passwordErrorMessage.set('Campo obrigatório');
		} else {
			this.passwordErrorMessage.set('');
		}
	}

	login() {
		this.loading = true;
		this._authService.login(this.getEmailControl.value, this.getPasswordControl.value).subscribe({
			complete: () => {
				this.loading = false;
				this._router.navigate(['/']);
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				console.error(error);
				switch (error.status) {
					case HttpStatusCode.BadRequest:
						this._snackBarService.openErrorSnackBar('Credenciais inválidas');
						break;
					case HttpStatusCode.UnprocessableEntity:
						this._snackBarService.openErrorSnackBar('Credenciais inválidas');
						break;
					case HttpStatusCode.TooManyRequests:
						this._snackBarService.openErrorSnackBar('Demasiadas tentativas falhadas, tente novamente dentro de 15 minutos');
						break;
					case HttpStatusCode.Forbidden:
						this._snackBarService.openErrorSnackBar('O seu email ainda não foi verificado');
						if (error?.error?.userId) {
							this.verifyEmail.emit({
								userId: error.error.userId,
								email: this.getEmailControl.value,
								password: this.getPasswordControl.value
							});
						}
						break;
					default:
						this._snackBarService.openErrorSnackBar('Erro a efetuar login');
						break;
				}
				this.loginForm.reset();
			}
		});
	}

	togglePasswordVisibility(event: MouseEvent) {
		this.hide.set(!this.hide());
		event.stopPropagation();
	}

	get getEmailControl(): FormControl {
		return this.loginForm.get('email') as FormControl;
	}
	get getPasswordControl(): FormControl {
		return this.loginForm.get('password') as FormControl;
	}
}
