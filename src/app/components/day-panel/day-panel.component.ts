import { Component, input, OnInit } from '@angular/core';
import { SessionByDateModel } from '../../models/session.model';
import { SessionService } from '../../services/session/session.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-day-panel',
	standalone: false,
	templateUrl: './day-panel.component.html',
	styleUrl: './day-panel.component.scss'
})
export class DayPanelComponent implements OnInit {
	date = input.required<Date>();

	searching = true;
	daySessions: SessionByDateModel[] = [];

	constructor(readonly _sessionService: SessionService) {}

	ngOnInit(): void {
		this.getDaySessions();
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
}
