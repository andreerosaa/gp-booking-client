import { Component, ElementRef, inject, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessionBookingDialogData } from '../../models/session.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from '../../services/session/session.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BookSessionResponse } from '../../models/bookSessionRequest.model';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';

@Component({
	selector: 'app-session-booking-dialog',
	standalone: false,

	templateUrl: './session-booking-dialog.component.html',
	styleUrl: './session-booking-dialog.component.scss'
})
export class SessionBookingDialogComponent implements OnInit {
	@ViewChildren('codeInput') codeVerificationInputs!: QueryList<ElementRef>;

	readonly dialogRef = inject(MatDialogRef<SessionBookingDialogComponent>);
	readonly data = inject<SessionBookingDialogData>(MAT_DIALOG_DATA);
	readonly _maxLength = 50;

	readonly sessionForm = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.maxLength(this._maxLength)]),
		email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(this._maxLength)])
	});

	readonly verificationForm = new FormGroup({
		first: new FormControl('', [Validators.required, Validators.maxLength(1)]),
		second: new FormControl('', [Validators.required, Validators.maxLength(1)]),
		third: new FormControl('', [Validators.required, Validators.maxLength(1)]),
		fourth: new FormControl('', [Validators.required, Validators.maxLength(1)])
	});

	readonly emailErrorMessage = signal('');
	readonly nameErrorMessage = signal('');

	bookingSession = false;
	newPatient = false;

	constructor(readonly _sessionService: SessionService, readonly _snackBarService: SnackBarService) {
		merge(this.getEmailControl.statusChanges, this.getEmailControl.valueChanges)
			.pipe(takeUntilDestroyed())
			.subscribe(() => this.updateErrorMessage());
		merge(this.getNameControl.statusChanges, this.getNameControl.valueChanges)
			.pipe(takeUntilDestroyed())
			.subscribe(() => this.updateErrorMessage());
	}

	ngOnInit() {
		this.handleCodeInputsFocusChange();
	}

	handleCodeInputsFocusChange() {
		const codeControls = Object.keys(this.verificationForm.controls);
		codeControls.forEach((controlName, index) => {
			const control = this.verificationForm.get(controlName);

			control?.valueChanges.subscribe((value) => {
				if (value && value.length === 1 && index < codeControls.length - 1) {
					this.codeVerificationInputs.get(index + 1)?.nativeElement.focus();
				} else if (value && value.length === 1 && index === codeControls.length - 1) {
					this.verifyCode();
				}
			});
		});
	}

	updateErrorMessage() {
		if (this.getEmailControl.hasError('required')) {
			this.emailErrorMessage.set('Campo obrigatório');
		} else if (this.getEmailControl.hasError('email')) {
			this.emailErrorMessage.set('Email inválido');
		} else if (this.getEmailControl.hasError('maxlength')) {
			this.emailErrorMessage.set(`Número máx. de caracteres: ${this._maxLength}`);
		} else {
			this.emailErrorMessage.set('');
		}

		if (this.getNameControl.hasError('required')) {
			this.nameErrorMessage.set('Campo obrigatório');
		} else if (this.getNameControl.hasError('maxlength')) {
			this.nameErrorMessage.set(`Número máx. de caracteres: ${this._maxLength}`);
		} else {
			this.nameErrorMessage.set('');
		}
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	bookSession() {
		this.bookingSession = true;
		this._sessionService.bookSession(this.data.session._id, this.getNameControl.value, this.getEmailControl.value).subscribe({
			next: (bookSessionResponse: BookSessionResponse) => {
				if (bookSessionResponse.newPatient) {
					this.newPatient = true;
				} else {
					this._snackBarService.openSuccessSnackBar('Sessão reservada, aguarda confirmação até 24 horas antes');
				}
			},
			complete: () => {
				this.bookingSession = false;
			},
			error: (error: HttpErrorResponse) => {
				this.bookingSession = false;
				this._snackBarService.openErrorSnackBar('Erro ao reservar sessão');
				console.log(error);
			}
		});
	}

	verifyCode() {
		console.log('Verifying code');
	}

	resendVerificationCode() {
		console.log('Resend verification code');
	}

	get getNameControl(): FormControl {
		return this.sessionForm.get('name') as FormControl;
	}
	get getEmailControl(): FormControl {
		return this.sessionForm.get('email') as FormControl;
	}
	get getFirstNumberControl(): FormControl {
		return this.verificationForm.get('first') as FormControl;
	}
	get getSecondNumberControl(): FormControl {
		return this.verificationForm.get('second') as FormControl;
	}
	get getThirdNumberControl(): FormControl {
		return this.verificationForm.get('third') as FormControl;
	}
	get getFourthNumberControl(): FormControl {
		return this.verificationForm.get('fourth') as FormControl;
	}
}
