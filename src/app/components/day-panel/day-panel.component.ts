import { Component, inject, input, OnInit } from '@angular/core';
import { SessionByDateModel } from '../../models/session.model';
import { SessionService } from '../../services/session/session.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditSessionDialogComponent } from '../create-edit-session-dialog/create-edit-session-dialog.component';

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

	readonly authService = inject(AuthService);

	searching = true;
	daySessions: SessionByDateModel[] = [];

	ngOnInit(): void {
		if(this.authService.isLoggedIn()) {
			this.getDaySessionsDetailed();
		} else {
			this.getDaySessions();
		}
	}

	getDaySessions() {
		this._sessionService.getSessionsByDate(this.date()).subscribe({
			next: (sessions: SessionByDateModel[]) => {
				this.daySessions = sessions;
			},
			complete: () => {
				this.searching = false;
			},
			error: (error: HttpErrorResponse) => {
				console.log(error);
				this.searching = false;
			}
		});
	}

	getDaySessionsDetailed() {
		this._sessionService.getSessionsByDateDetailed(this.date()).subscribe({
			next: (sessions: SessionByDateModel[]) => {
				this.daySessions = sessions;
			},
			complete: () => {
				this.searching = false;
			},
			error: (error: HttpErrorResponse) => {
				console.log(error);
				this.searching = false;
			}
		});
	}

	openAddSessionDialog(){
		const dialogRef = this._dialog.open(CreateEditSessionDialogComponent, {
			data:{
			  date: this.date()
			}
		  });
		  dialogRef.afterClosed().subscribe((result) => {
			if(result) {
			  this.getDaySessions();
			}
		  });
	}
}
