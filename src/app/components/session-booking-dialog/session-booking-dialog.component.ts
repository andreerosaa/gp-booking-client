import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessionBookingDialogData } from '../../models/session.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from '../../services/session/session.service';

@Component({
	selector: 'app-session-booking-dialog',
	standalone: false,

	templateUrl: './session-booking-dialog.component.html',
	styleUrl: './session-booking-dialog.component.scss'
})
export class SessionBookingDialogComponent {
	readonly dialogRef = inject(MatDialogRef<SessionBookingDialogComponent>);
	readonly data = inject<SessionBookingDialogData>(MAT_DIALOG_DATA);
	readonly _maxLength = 50;
	readonly sessionForm = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.maxLength(this._maxLength)]),
		email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(this._maxLength)])
	});

	readonly emailErrorMessage = signal('');
	readonly nameErrorMessage = signal('');

	constructor(
    readonly _sessionService: SessionService
  ) {
		merge(this.getEmailControl.statusChanges, this.getEmailControl.valueChanges)
			.pipe(takeUntilDestroyed())
			.subscribe(() => this.updateErrorMessage());
		merge(this.getNameControl.statusChanges, this.getNameControl.valueChanges)
			.pipe(takeUntilDestroyed())
			.subscribe(() => this.updateErrorMessage());
	}

	updateErrorMessage() {
		if (this.getEmailControl.hasError('required')) {
			this.emailErrorMessage.set('Campo obrigatório');
		} else if (this.getEmailControl.hasError('email')) {
			this.emailErrorMessage.set('Not a valid email');
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
		console.log('submitted');
	}

	get getNameControl(): FormControl {
		return this.sessionForm.get('name') as FormControl;
	}
	get getEmailControl(): FormControl {
		return this.sessionForm.get('email') as FormControl;
	}
}
