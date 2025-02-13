import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
	readonly nameErrorMessage = signal('');
	readonly surnameErrorMessage = signal('');
	readonly emailErrorMessage = signal('');
	readonly passwordErrorMessage = signal('');

	readonly registerForm = new FormGroup<RegisterForm>({
		name: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)]),
		surname: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)]),
		email: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)]),
		password: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)]),
		terms: new FormControl(false, [Validators.requiredTrue])
	});

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
		} else {
			this.emailErrorMessage.set('');
		}

		if (this.getPasswordControl.hasError('required')) {
			this.passwordErrorMessage.set('Campo obrigatório');
		} else {
			this.passwordErrorMessage.set('');
		}
	}

	register() {
		this.loading = true;
		this._userService.register(this.getNameControl.value, this.getSurnameControl.value, this.getEmailControl.value, this.getPasswordControl.value).subscribe({
			next: (registeredUser: RegisterUserResponse) => {
				this.userId = registeredUser.id;
			},
			complete: () => {
				this.loading = false;
				this.verifyEmail.emit({userId: this.userId, email: this.getEmailControl.value, password: this.getPasswordControl.value});
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

	togglePasswordVisibility(event: MouseEvent) {
		this.hide.set(!this.hide());
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
	get getTermsControl(): FormControl {
		return this.registerForm.get('terms') as FormControl;
	}
}
