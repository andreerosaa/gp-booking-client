import { Component, Input, OnInit } from '@angular/core';
import { SessionModel } from '../../models/session.model';
import { SessionService } from '../../services/session/session.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-day-panel',
	standalone: false,

	templateUrl: './day-panel.component.html',
	styleUrl: './day-panel.component.scss'
})
export class DayPanelComponent implements OnInit {
	@Input() date!: Date;

	searching = true;
	daySessions: SessionModel[] = [];

	constructor(readonly _sessionService: SessionService) {}

	ngOnInit(): void {
		this._sessionService.getSessionsByDate(this.date).subscribe({
			next: (sessions: SessionModel[]) => {
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
}
