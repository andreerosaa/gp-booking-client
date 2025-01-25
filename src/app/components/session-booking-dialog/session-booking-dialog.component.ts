import { Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookSessionResponse, SessionBookingDialogData, SessionBookingForm, VerificationForm } from '../../models/session.model';
import { FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from '../../services/session/session.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';
import { PatientService } from '../../services/patient/patient.service';
import { PatientModel } from '../../models/patient.model';

@Component({
	selector: 'app-session-booking-dialog',
	standalone: false,
	templateUrl: './session-booking-dialog.component.html',
	styleUrl: './session-booking-dialog.component.scss'
})
export class SessionBookingDialogComponent implements OnInit {
	@ViewChild('codeInput') codeInput!: ElementRef;

	private readonly _dialogRef = inject(MatDialogRef<SessionBookingDialogComponent>);
	private readonly _destroyRef = inject(DestroyRef);
	protected readonly data = inject<SessionBookingDialogData>(MAT_DIALOG_DATA);
	protected readonly maxLength = 50;

	readonly sessionForm = new FormGroup<SessionBookingForm>({
		name: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)]),
		email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(this.maxLength)]),
		terms: new FormControl(false, [Validators.requiredTrue])
	});

	readonly verificationForm = new FormGroup<VerificationForm>({
		code: new FormControl(null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)])
	});

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
			this.emailErrorMessage.set(`Número máx. de caracteres: ${this.maxLength}`);
		} else {
			this.emailErrorMessage.set('');
		}

		if (this.getNameControl.hasError('required')) {
			this.nameErrorMessage.set('Campo obrigatório');
		} else if (this.getNameControl.hasError('maxlength')) {
			this.nameErrorMessage.set(`Número máx. de caracteres: ${this.maxLength}`);
		} else {
			this.nameErrorMessage.set('');
		}
	}

	closeDialog(refresh?: boolean): void {
		this._dialogRef.close(refresh);
	}

	checkPatientExists() {
		this.loading = true;
		this._patientService.getPatientByEmail(this.getEmailControl.value).subscribe({
			next: (patient: PatientModel) => {
				if(patient.verified) {
					this.bookSession();
				} else {
					this.updatePatientName(patient._id);
				}
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				console.error(error);
				switch (error.status) {
					case HttpStatusCode.BadRequest:
						this._snackBarService.openErrorSnackBar('Email ou nome incorretos');
						break;
					case HttpStatusCode.NotFound:
						this.createPatient();
						break;
					default:
						this._snackBarService.openErrorSnackBar('Erro ao verificar dados');
						break;
				}
			}
		})
	}
	
	updatePatientName(patientId: string) {
		this.loading = true;
		this._patientService.updatePatientName(patientId, this.getEmailControl.value, this.getNameControl.value).subscribe({
			next: (patient: PatientModel) =>  {
				this.patientId = patient._id;
			},
			complete: () => {
				this.loading = false;
				this.newPatient = true;
				this.sendVerificationCode();
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				console.error(error)
				this._snackBarService.openErrorSnackBar('Erro ao criar utilizador');
			}
		})
	}

	createPatient() {
		this.loading = true;
		this._patientService.createPatient(this.getEmailControl.value, this.getNameControl.value).subscribe({
			next: (patient: PatientModel) =>  {
				this.patientId = patient._id;
			},
			complete: () => {
				this.loading = false;
				this.newPatient = true;
				this.sendVerificationCode();
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				console.error(error)
				this._snackBarService.openErrorSnackBar('Erro ao criar utilizador');
			}
		})
	}

	bookSession() {
		this.loading = true;
		this._sessionService.bookSession(this.data.session._id, this.getNameControl.value, this.getEmailControl.value).subscribe({
			next: (bookSessionResponse: BookSessionResponse) => {
				if (bookSessionResponse.newPatient) {
					this.newPatient = true;
					this.patientId = bookSessionResponse.session.patientId;
				} else {
					this.closeDialog(true);
					this._snackBarService.openSuccessSnackBar('Sessão reservada, aguarda confirmação até 24 horas antes');
				}
			},
			complete: () => {
				this.loading = false;
			},
			error: (error: HttpErrorResponse) => {
				this.loading = false;
				console.error(error);
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
				this.bookSession();
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

	sendVerificationCode(resend = false) {
		this.gettingNewCode = resend;
		this._patientService.getVerificationCode(this.patientId).subscribe({
			complete: () => {
				this.gettingNewCode = false;
				this.codeInput.nativeElement.focus();
				this.newPatient = true;
				if(resend) {
					this._snackBarService.openSuccessSnackBar('Novo código de confirmação enviado');
				}
			},
			error: (error: HttpErrorResponse) => {
				this.gettingNewCode = false;
				this.codeInput.nativeElement.focus();
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
