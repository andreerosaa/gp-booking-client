import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminBookingForm, AdminSessionBookingDialogData } from '../../models/session.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';
import { UserModel } from '../../models/user.model';
import { IdentificationWithEmail } from '../../models/base.model';
import { UserService } from '../../services/user/user.service';

@Component({
	selector: 'app-admin-booking-dialog',
	standalone: false,
	templateUrl: './admin-booking-dialog.component.html',
	styleUrl: './admin-booking-dialog.component.scss'
})
export class AdminBookingDialogComponent implements OnInit {
	private readonly _dialogRef = inject(MatDialogRef<AdminBookingDialogComponent>);
	private readonly _snackBarService = inject(SnackBarService);
	private readonly _userService = inject(UserService);

	protected readonly data = inject<AdminSessionBookingDialogData>(MAT_DIALOG_DATA);
	protected readonly maxLength = 50;

	readonly adminSessionForm = new FormGroup<AdminBookingForm>({
		user: new FormControl(null, [Validators.required, Validators.maxLength(this.maxLength)])
	});

	users: IdentificationWithEmail[] = [];
	filteredUsers!: Observable<IdentificationWithEmail[]>;
	loading = false;

	ngOnInit() {
		this.searchUsers();
	}

	closeDialog(user?: IdentificationWithEmail | null) {
		this._dialogRef.close(user);
	}

	bookSession() {
		this.closeDialog(this.getUserControl.value);
	}

	searchUsers() {
		this._userService
			.getUsers()
			.pipe(
				map((users: UserModel[]): IdentificationWithEmail[] => {
					return users.map((user: UserModel): IdentificationWithEmail => {
						return { id: user._id, name: user.name, email: user.email, surname: user.surname };
					});
				})
			)
			.subscribe({
				next: (users: IdentificationWithEmail[]) => {
					this.users = [...users];
				},
				complete: () => {
					this.loading = false;
					this.filterUsers();
				},
				error: (error: HttpErrorResponse) => {
					this.loading = false;
					console.error(error);
					this._snackBarService.openErrorSnackBar('Erro a pesquisar clientes');
				}
			});
	}

	filterUsers() {
		this.filteredUsers = this.getUserControl.valueChanges.pipe(
			startWith(''),
			map((filterValue: string | IdentificationWithEmail) =>
				this.users.filter((option) => {
					const filter = typeof filterValue === 'string' ? filterValue : this.autocompleteDisplay(filterValue);
					const optionString = this.autocompleteDisplay(option);
					return optionString.toLowerCase().includes(filter?.toLowerCase() ?? '');
				})
			)
		);
	}

	autocompleteDisplay(user: IdentificationWithEmail): string {
		return user?.name && user?.surname && user?.email ? `${user.name} ${user.surname} (${user.email})` : '';
	}

	get getUserControl(): FormControl {
		return this.adminSessionForm.get('user') as FormControl;
	}
}
