import { Component, inject, input, output } from '@angular/core';
import { SessionByDateModel, SessionStatusEnum, SessionStatusMessages } from '../../models/session.model';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth/auth.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { SessionService } from '../../services/session/session.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';
import { CreateEditSessionDialogComponent } from '../create-edit-session-dialog/create-edit-session-dialog.component';
import { RoleEnum } from '../../models/user.model';
import { Router } from '@angular/router';
import { AdminBookingDialogComponent } from '../admin-booking-dialog/admin-booking-dialog.component';

@Component({
	selector: 'app-session-card',
	standalone: false,
	templateUrl: './session-card.component.html',
	styleUrl: './session-card.component.scss'
})
export class SessionCardComponent {
	refreshTabEmitter = output();
	session = input.required<SessionByDateModel>();

	private readonly _dialog = inject(MatDialog);
	private readonly _sessionService = inject(SessionService);
	private readonly _snackBarService = inject(SnackBarService);
  private readonly _router = inject(Router);

	readonly authService = inject(AuthService);
	readonly SessionStatusMessages = SessionStatusMessages;
	readonly SessionStatusEnum = SessionStatusEnum;

	handleSessionBooking() {
		switch (this.authService.getUserRole()) {
			case RoleEnum.ADMIN: {
				const dialogRef = this._dialog.open(AdminBookingDialogComponent, {
					data: {
						session: this.session()
					}
				});
				dialogRef.afterClosed().subscribe((email) => {
					if (email) {
						//TODO: handle confirmation with book session method
						this.bookSession(email);
					}
				});
				break;
			}
			case RoleEnum.PATIENT: {
				const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
					data: {
						title: 'Reservar sessão',
						message: 'Tem a certeza de que pretende reservar esta sessão?'
					}
				});
				dialogRef.afterClosed().subscribe((result) => {
					if (result) {
						const email = this.authService.getUserEmail();

						if (!email) {
							console.error('Email not found in token');
							this._snackBarService.openErrorSnackBar('Erro ao reservar sessão');
							return;
						}
						this.bookSession(email);
					}
				});
				break;
			}
			default: {
        //TODO: use dialog and bookSession if login successful
				this._router.navigate(['login']);
				break;
			}
		}
	}

	bookSession(email: string) {
		this._sessionService.bookSession(this.session()._id, email).subscribe({
			complete: () => {
				this.refreshTabEmitter.emit();
				this._snackBarService.openSuccessSnackBar('Sessão reservada, aguarda confirmação até 24 horas antes');
			},
			error: (error: HttpErrorResponse) => {
				this.refreshTabEmitter.emit();
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
					case HttpStatusCode.NotAcceptable:
						this._snackBarService.openErrorSnackBar('Atingiu o número máximo de sessões reservadas para este dia');
						break;
					default:
						this._snackBarService.openErrorSnackBar('Erro ao reservar sessão');
						break;
				}
			}
		});
	}

	openDeleteSessionDialog(series = false) {
		const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
			data: {
				title: series ? 'Eliminar série' : 'Eliminar sessão',
				message: series
					? 'Tem a certeza de que pretende eliminar esta série de sessões?'
					: 'Tem a certeza de que pretende eliminar esta sessão?'
			}
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.deleteSession(series);
			}
		});
	}

	openEditSessionDialog() {
		const dialogRef = this._dialog.open(CreateEditSessionDialogComponent, {
			data: {
				date: this.session().date,
				session: this.session()
			}
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.refreshTabEmitter.emit();
			}
		});
	}

	openCancelSessionDialog() {}

	openClearSessionDialog() {}

	openSendConfirmationEmailDialog() {}

	deleteSession(series = false) {
		const seriesId = this.session().seriesId;

		if (series && seriesId) {
			this._sessionService.deleteRecurringSessions(seriesId).subscribe({
				complete: () => {
					this._snackBarService.openSuccessSnackBar('Série eliminada');
					this.refreshTabEmitter.emit();
				},
				error: (error: HttpErrorResponse) => {
					console.error(error);
					switch (error.status) {
						case HttpStatusCode.Forbidden:
							this._snackBarService.openErrorSnackBar('Sem permissões para eliminar série');
							break;
						case HttpStatusCode.NotFound:
							this._snackBarService.openErrorSnackBar('Série não encontrada');
							break;
						default:
							this._snackBarService.openErrorSnackBar('Erro ao eliminar série');
							break;
					}
				}
			});
		} else {
			this._sessionService.deleteSession(this.session()._id).subscribe({
				complete: () => {
					this._snackBarService.openSuccessSnackBar('Sessão eliminada');
					this.refreshTabEmitter.emit();
				},
				error: (error: HttpErrorResponse) => {
					console.error(error);
					switch (error.status) {
						case HttpStatusCode.Forbidden:
							this._snackBarService.openErrorSnackBar('Sem permissões para eliminar sessão');
							break;
						case HttpStatusCode.NotFound:
							this._snackBarService.openErrorSnackBar('Sessão não encontrada');
							break;
						default:
							this._snackBarService.openErrorSnackBar('Erro ao eliminar sessão');
							break;
					}
				}
			});
		}
	}

	cancelSession() {}

	clearSession() {}

	sendConfirmationEmail() {}

	get computeEndTime() {
		return new Date(new Date(this.session().date).getTime() + this.session().durationInMinutes * 60000);
	}

	get statusColor() {
		let colorClass = '';
		switch (this.session().status) {
			case SessionStatusEnum.AVAILABLE:
				colorClass = 'green';
				break;
			case SessionStatusEnum.PENDING:
				colorClass = 'orange';
				break;
			case SessionStatusEnum.CONFIRMED:
				colorClass = 'red';
				break;
		}

		return colorClass;
	}
}
