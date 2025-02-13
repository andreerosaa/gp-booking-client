import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, inject, input, OnInit, output, viewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '../../../../services/snack-bar/snack-bar.service';
import { VerificationForm } from '../../../../models/user.model';
import { UserService } from '../../../../services/user/user.service';

@Component({
	selector: 'app-verify',
	standalone: false,
	templateUrl: './verify.component.html',
	styleUrl: './verify.component.scss'
})
export class VerifyComponent implements OnInit {
	userId = input('');
	email = input('');
	goBackEmitter = output();
	verifiedUser = output();

	codeInput = viewChild<ElementRef>('codeInput');
	
	private readonly _userService = inject(UserService);
	private readonly _snackBarService = inject(SnackBarService);

	protected readonly maxLength = 50;

	readonly verificationForm = new FormGroup<VerificationForm>({
		code: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)])
	});

	loading = false;
	gettingNewCode = false;

	ngOnInit() {
		this.sendVerificationCode();
	}

	verifyPatient() {
		const inputCode = parseInt(this.getCodeControl.value);

		if(!inputCode) {
			this.verificationForm.reset();
			this.codeInput()?.nativeElement.focus();
			this._snackBarService.openErrorSnackBar('Código inválido ou expirado');
			return;
		}

		this.loading = true;
		this._userService.verifyUser(this.userId(), inputCode).subscribe({
			complete: () => {
				this.loading = false;
				this.verificationForm.reset();
				this.verificationForm.disable();
				this.verifiedUser.emit();
				this._snackBarService.openSuccessSnackBar('Email validado com sucesso');
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				this.verificationForm.reset();
				console.error(error);
				switch (error.status) {
					case HttpStatusCode.BadRequest:
						this._snackBarService.openErrorSnackBar('Código inválido ou expirado');
						break;
					case HttpStatusCode.Forbidden:
						this._snackBarService.openErrorSnackBar('Código já confirmado');
						break;
					default:
						this._snackBarService.openErrorSnackBar('Erro a verificar código');
						break;
				}
			}
		});
	}

	sendVerificationCode() {
		this.gettingNewCode = true;
		this._userService.getVerificationCode(this.userId()).subscribe({
			complete: () => {
				this.gettingNewCode = false;
				this.codeInput()?.nativeElement.focus();
				this._snackBarService.openSuccessSnackBar('Novo código de confirmação enviado');
			},
			error: (error: HttpErrorResponse) => {
				this.gettingNewCode = false;
				this.codeInput()?.nativeElement.focus();
				console.error(error);
				switch (error.status) {
					case HttpStatusCode.Forbidden:
						this._snackBarService.openErrorSnackBar('Código já confirmado');
						break;
					default:
						this._snackBarService.openErrorSnackBar('Erro a obter novo código');
						break;
				}
			}
		});
	}

	goBack() {
		this.goBackEmitter.emit();
	}

	get getCodeControl(): FormControl {
		return this.verificationForm.get('code') as FormControl;
	}
}
