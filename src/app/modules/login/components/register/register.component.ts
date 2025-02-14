import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SnackBarService } from '../../../../services/snack-bar/snack-bar.service';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginUnverifiedUserResponse, RegisterForm, RegisterUserResponse } from '../../../../models/user.model';
import { UserService } from '../../../../services/user/user.service';

@Component({
	selector: 'app-register',
	standalone: false,
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss'
})
export class RegisterComponent {
	verifyEmail = output<LoginUnverifiedUserResponse>();

	private readonly _destroyRef = inject(DestroyRef);
	private readonly _userService = inject(UserService);
	private readonly _snackBarService = inject(SnackBarService);

	protected readonly maxLength = 50;

	readonly hide = signal(true);
	readonly hideConfirmation = signal(true);
	readonly nameErrorMessage = signal('');
	readonly surnameErrorMessage = signal('');
	readonly emailErrorMessage = signal('');
	readonly passwordErrorMessage = signal('');
	readonly passwordConfirmationErrorMessage = signal('');

	readonly registerForm = new FormGroup<RegisterForm>(
		{
			name: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)]),
			surname: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)]),
			email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(this.maxLength)]),
			password: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)]),
			passwordConfirmation: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)]),
			terms: new FormControl(false, [Validators.requiredTrue])
		},
		{ validators: matchingValuesValidator }
	);

	loading = false;
	userId = '';

	constructor() {
		merge(this.getNameControl.statusChanges, this.getNameControl.valueChanges)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this.updateErrorMessage());
		merge(this.getSurnameControl.statusChanges, this.getSurnameControl.valueChanges)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this.updateErrorMessage());
		merge(this.getEmailControl.statusChanges, this.getEmailControl.valueChanges)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this.updateErrorMessage());
		merge(this.getPasswordControl.statusChanges, this.getPasswordControl.valueChanges)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this.updateErrorMessage());
		merge(this.getPasswordConfirmationControl.statusChanges, this.getPasswordConfirmationControl.valueChanges)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this.updateErrorMessage());
	}

	updateErrorMessage() {
		if (this.getNameControl.hasError('required')) {
			this.nameErrorMessage.set('Campo obrigatório');
		} else {
			this.nameErrorMessage.set('');
		}

		if (this.getSurnameControl.hasError('required')) {
			this.surnameErrorMessage.set('Campo obrigatório');
		} else {
			this.surnameErrorMessage.set('');
		}

		if (this.getEmailControl.hasError('required')) {
			this.emailErrorMessage.set('Campo obrigatório');
		} else if (this.getEmailControl.hasError('email')) {
			this.emailErrorMessage.set('Introduza um email válido');
		} else {
			this.emailErrorMessage.set('');
		}

		if (this.getPasswordControl.hasError('required')) {
			this.passwordErrorMessage.set('Campo obrigatório');
		} else if (this.getPasswordControl.hasError('noMatch')) {
			this.passwordErrorMessage.set('As passwords têm de ser iguais');
		} else {
			this.passwordErrorMessage.set('');
		}

		if (this.getPasswordConfirmationControl.hasError('required')) {
			this.passwordConfirmationErrorMessage.set('Campo obrigatório');
		} else if (this.getPasswordConfirmationControl.hasError('noMatch')) {
			this.passwordConfirmationErrorMessage.set('As passwords têm de ser iguais');
		} else {
			this.passwordConfirmationErrorMessage.set('');
		}
	}

	register() {
		this.loading = true;
		this._userService
			.register(
				this.getNameControl.value.trim(),
				this.getSurnameControl.value.trim(),
				this.getEmailControl.value.trim(),
				this.getPasswordControl.value.trim()
			)
			.subscribe({
				next: (registeredUser: RegisterUserResponse) => {
					this.userId = registeredUser.id;
				},
				complete: () => {
					this.loading = false;
					this.verifyEmail.emit({ userId: this.userId, email: this.getEmailControl.value, password: this.getPasswordControl.value });
				},
				error: (error: HttpErrorResponse) => {
					this.loading = false;
					this.registerForm.reset();
					console.error(error);
					switch (error.status) {
						case HttpStatusCode.BadRequest:
							this._snackBarService.openErrorSnackBar('Dados inválidos');
							break;
						case HttpStatusCode.UnprocessableEntity:
							this._snackBarService.openErrorSnackBar('Dados inválidos');
							break;
						case HttpStatusCode.Forbidden:
							this._snackBarService.openErrorSnackBar('Utilizador já existe');
							break;
						default:
							this._snackBarService.openErrorSnackBar('Erro a efetuar registo');
							break;
					}
				}
			});
	}

	togglePasswordVisibility(event: MouseEvent, passwordConfirmation = false) {
		if (passwordConfirmation) {
			this.hideConfirmation.set(!this.hideConfirmation());
		} else {
			this.hide.set(!this.hide());
		}
		event.stopPropagation();
	}

	get getNameControl(): FormControl {
		return this.registerForm.get('name') as FormControl;
	}
	get getSurnameControl(): FormControl {
		return this.registerForm.get('surname') as FormControl;
	}
	get getEmailControl(): FormControl {
		return this.registerForm.get('email') as FormControl;
	}
	get getPasswordControl(): FormControl {
		return this.registerForm.get('password') as FormControl;
	}
	get getPasswordConfirmationControl(): FormControl {
		return this.registerForm.get('passwordConfirmation') as FormControl;
	}
	get getTermsControl(): FormControl {
		return this.registerForm.get('terms') as FormControl;
	}
}

export const matchingValuesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	const password = control.get('password');
	const passwordConfirmation = control.get('passwordConfirmation');

	if (password?.value !== passwordConfirmation?.value) {
		password?.setErrors({ noMatch: true });
		passwordConfirmation?.setErrors({ noMatch: true });
		return { noMatch: true };
	}

	password?.setErrors(null);
	passwordConfirmation?.setErrors(null);
	return null;
};
