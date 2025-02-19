import { Component, inject, viewChild } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { MatTabGroup } from '@angular/material/tabs';
import { LoginComponent } from '../login/login.component';
import { LoginUnverifiedUserResponse } from '../../../../models/user.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { SnackBarService } from '../../../../services/snack-bar/snack-bar.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
	selector: 'app-login-register',
	standalone: false,

	templateUrl: './login-register.component.html',
	styleUrl: './login-register.component.scss'
})
export class LoginRegisterComponent {
	registerComponent = viewChild.required(RegisterComponent);
	loginComponent = viewChild.required(LoginComponent);
	loginRegisterTabs = viewChild.required<MatTabGroup>('loginRegisterTabs');

	private readonly _authService = inject(AuthService);
	private readonly _snackBarService = inject(SnackBarService);
	private readonly _router = inject(Router);

	verifyLogin = false;
	verifyRegister = false;
	loading = false;
	userId = '';
	email = '';
	password = '';

	handleVerifyEmail(unverifiedUserResponse: LoginUnverifiedUserResponse, login = false) {
		this.userId = unverifiedUserResponse.userId;
		this.email = unverifiedUserResponse.email;
		this.password = unverifiedUserResponse.password;
		if (login) {
			this.verifyLogin = true;
		} else {
			this.verifyRegister = true;
		}
	}

	handleVerifiedUser() {
		this._authService.login(this.email, this.password).subscribe({
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
					default:
						this._snackBarService.openErrorSnackBar('Erro a efetuar login');
						break;
				}
			}
		});
	}

	handleGoBack() {
		this.verifyLogin = false;
		this.verifyRegister = false;
	}

	handleTabChange(tabIndex: number) {
		this.verifyLogin = false;
		this.verifyRegister = false;
		this.loading = false;
		this.userId = '';
		this.email = '';
		this.password = '';
		if(tabIndex === 0) {
			this.registerComponent().registerForm.reset();
		} else {
			this.loginComponent().loginForm.reset({email: this.loginComponent().emailInitialValue});
		}
	}
}
