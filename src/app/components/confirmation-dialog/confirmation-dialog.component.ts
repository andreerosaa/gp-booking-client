import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogData } from '../../models/base.model';

@Component({
	selector: 'app-confirmation-dialog',
	standalone: false,
	templateUrl: './confirmation-dialog.component.html',
	styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
	private readonly _dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
	
	protected readonly data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);

	onCancelClick() {
		this._dialogRef.close(false);
	}

	onConfirmClick() {
		this._dialogRef.close(true);
	}
}
