import { Component, DestroyRef, ElementRef, inject, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessionBookingDialogData } from '../../models/session.model';
import { FormControl, FormControlStatus, FormGroup, StatusChangeEvent, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from '../../services/session/session.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { BookSessionResponse } from '../../models/bookSessionRequest.model';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';
import { PatientService } from '../../services/patient/patient.service';

@Component({
	selector: 'app-session-booking-dialog',
	standalone: false,
	templateUrl: './session-booking-dialog.component.html',
	styleUrl: './session-booking-dialog.component.scss'
})
export class SessionBookingDialogComponent implements OnInit {
	@ViewChild('codeInput') codeInput!: ElementRef;

	private readonly dialogRef = inject(MatDialogRef<SessionBookingDialogComponent>);
	private readonly _destroyRef = inject(DestroyRef);
	protected readonly data = inject<SessionBookingDialogData>(MAT_DIALOG_DATA);
	protected readonly _maxLength = 50;

	readonly sessionForm = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.maxLength(this._maxLength)]),
		email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(this._maxLength)]),
		terms: new FormControl(false, [Validators.requiredTrue])
	});

	readonly verificationForm = new FormGroup({code: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)])});

	readonly emailErrorMessage = signal('');
	readonly nameErrorMessage = signal('');

	loading = false;
	gettingNewCode = false;
	newPatient = false;
	patientId = '';

	constructor(
		readonly _sessionService: SessionService,
		readonly _snackBarService: SnackBarService,
		readonly _patientService: PatientService
	) {
		merge(this.getEmailControl.statusChanges, this.getEmailControl.valueChanges)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this.updateErrorMessage());
		merge(this.getNameControl.statusChanges, this.getNameControl.valueChanges)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this.updateErrorMessage());
	}

	ngOnInit() {
		this.handleCodeInputsFocusChange();
	}

	handleCodeInputsFocusChange() {
		this.verificationForm.statusChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value: FormControlStatus) => {
			if(value === "VALID") {
				this.verifyPatient();
			}
		})
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
		this.loading = true;
		this._sessionService.bookSession(this.data.session._id, this.getNameControl.value, this.getEmailControl.value).subscribe({
			next: (bookSessionResponse: BookSessionResponse) => {
				if (bookSessionResponse.newPatient) {
					this.newPatient = true;
					this.patientId = bookSessionResponse.session.patientId;
				} else {
					this.onNoClick();
					this._snackBarService.openSuccessSnackBar('Sessão reservada, aguarda confirmação até 24 horas antes');
				}
			},
			complete: () => {
				this.loading = false;
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				console.log(error);
				switch (error.status) {
					case HttpStatusCode.BadRequest:
						this._snackBarService.openErrorSnackBar('Email ou nome incorretos');
						break;
					case HttpStatusCode.NotFound:
						this._snackBarService.openErrorSnackBar('Sessão não encontrada');
						break;
					case HttpStatusCode.Forbidden:
						this._snackBarService.openErrorSnackBar('Sessão já reservada');
						break;
					default:
						this._snackBarService.openErrorSnackBar('Erro ao reservar sessão');
						break;
				}
			}
		});
	}

	verifyPatient() {
		const inputCode = parseInt(this.getCodeControl.value);

		if(!inputCode) {
			this.verificationForm.reset();
			this.codeInput.nativeElement.focus();
			this._snackBarService.openErrorSnackBar('Código inválido ou expirado');
			return;
		}

		this.loading = true;
		this._patientService.verifyPatient(this.patientId, inputCode).subscribe({
			complete: () => {
				this.loading = false;
				this.onNoClick();
				this._snackBarService.openSuccessSnackBar('Sessão reservada, aguarda confirmação até 24 horas antes');
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				this.verificationForm.reset();
				this.codeInput.nativeElement.focus();
				console.log(error);
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

	resendVerificationCode() {
		this.gettingNewCode = true;
		this._patientService.getVerificationCode(this.patientId).subscribe({
			complete: () => {
				this.gettingNewCode = false;
				this.codeInput.nativeElement.focus();
				this._snackBarService.openSuccessSnackBar('Novo código de confirmação enviado');
			},
			error: (error: HttpErrorResponse) => {
				this.gettingNewCode = false;
				this.codeInput.nativeElement.focus();
				console.log(error);
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

	get getNameControl(): FormControl {
		return this.sessionForm.get('name') as FormControl;
	}
	get getEmailControl(): FormControl {
		return this.sessionForm.get('email') as FormControl;
	}
	get getTermsControl(): FormControl {
		return this.sessionForm.get('terms') as FormControl;
	}
	get getCodeControl(): FormControl {
		return this.verificationForm.get('code') as FormControl;
	}
}
