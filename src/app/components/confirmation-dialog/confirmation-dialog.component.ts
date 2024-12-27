import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessionBookingDialogData } from '../../models/session.model';
import { ConfirmationDialogData } from '../../models/base.model';

@Component({
	selector: 'app-confirmation-dialog',
	standalone: false,
	templateUrl: './confirmation-dialog.component.html',
	styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
	private readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
	protected readonly data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);

	onCancelClick(): void {
		this.dialogRef.close(false);
	}

	onConfirmClick(): void {
		this.dialogRef.close(true);
	}
}
