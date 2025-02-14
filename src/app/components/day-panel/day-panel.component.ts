import { Component, inject, input, OnInit } from '@angular/core';
import { SessionByDateModel } from '../../models/session.model';
import { SessionService } from '../../services/session/session.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditSessionDialogComponent } from '../create-edit-session-dialog/create-edit-session-dialog.component';
import { CreateFromTemplateDialogComponent } from '../create-from-template-dialog/create-from-template-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';

@Component({
	selector: 'app-day-panel',
	standalone: false,
	templateUrl: './day-panel.component.html',
	styleUrl: './day-panel.component.scss'
})
export class DayPanelComponent implements OnInit {
	date = input.required<Date>();

	private readonly _dialog = inject(MatDialog);
	private readonly _sessionService = inject(SessionService);
	private readonly _snackBarService = inject(SnackBarService);

	readonly authService = inject(AuthService);

	searching = true;
	daySessions: SessionByDateModel[] = [];

	ngOnInit(): void {
		if (this.authService.isAdmin()) {
			this.getDaySessionsDetailed();
		} else {
			this.getDaySessions();
		}
	}

	getDaySessions() {
		this._sessionService.getSessionsByDate(this.date()).subscribe({
			next: (sessions: SessionByDateModel[]) => {
				this.daySessions = [...sessions];
			},
			complete: () => {
				this.searching = false;
			},
			error: (error: HttpErrorResponse) => {
				console.error(error);
				this.searching = false;
			}
		});
	}

	getDaySessionsDetailed() {
		this._sessionService.getSessionsByDateDetailed(this.date()).subscribe({
			next: (sessions: SessionByDateModel[]) => {
				this.daySessions = [...sessions];
			},
			complete: () => {
				this.searching = false;
			},
			error: (error: HttpErrorResponse) => {
				console.error(error);
				this.searching = false;
			}
		});
	}

	openAddSessionDialog() {
		const dialogRef = this._dialog.open(CreateEditSessionDialogComponent, {
			data: {
				date: this.date()
			}
		});
		dialogRef.afterClosed().subscribe((result: boolean) => {
			if (result) {
				this.getDaySessionsDetailed();
			}
		});
	}

	openCreateFromTemplateDialog() {
		const dialogRef = this._dialog.open(CreateFromTemplateDialogComponent, {
			data: {
				date: this.date()
			}
		});
		dialogRef.afterClosed().subscribe((result: boolean) => {
			if (result) {
				this.getDaySessionsDetailed();
			}
		});
	}

	openClearDayDialog() {
		const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
			data: {
				title: 'Limpar sessões deste dia',
				message: 'Tem a certeza de que pretende eliminar todas as sessões a decorrer neste dia?'
			}
		});
		dialogRef.afterClosed().subscribe((result: boolean) => {
			if (result) {
				this.clearDaySessions();
			}
		});
	}

	clearDaySessions() {
		this._sessionService.clearDaySessions(this.date()).subscribe({
			complete: () => {
				this._snackBarService.openSuccessSnackBar('Sessões eliminadas');
				this.getDaySessionsDetailed();
			},
			error: (error: HttpErrorResponse) => {
				console.error(error);
				switch (error.status) {
					case HttpStatusCode.Forbidden:
						this._snackBarService.openErrorSnackBar('Sem permissões para eliminar sessões');
						break;
					case HttpStatusCode.NotFound:
						this._snackBarService.openErrorSnackBar('Sessão não encontrada');
						break;
					default:
						this._snackBarService.openErrorSnackBar('Erro ao eliminar sessões');
						break;
				}
			}
		});
	}
}
