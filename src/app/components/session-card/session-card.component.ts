import { Component, inject, input, output } from '@angular/core';
import { SessionByDateModel, SessionStatusEnum, SessionStatusMessages } from '../../models/session.model';
import { MatDialog } from '@angular/material/dialog';
import { SessionBookingDialogComponent } from '../session-booking-dialog/session-booking-dialog.component';

@Component({
  selector: 'app-session-card',
  standalone: false,
  templateUrl: './session-card.component.html',
  styleUrl: './session-card.component.scss',
})
export class SessionCardComponent {

  refreshTabEmitter = output();
  session = input.required<SessionByDateModel>();

  readonly dialog = inject(MatDialog);

  SessionStatusMessages = SessionStatusMessages;
  SessionStatusEnum = SessionStatusEnum;
  
  openSessionBookingDialog() {
    const dialogRef = this.dialog.open(SessionBookingDialogComponent, {
      data:{
        session: this.session()
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.refreshTabEmitter.emit();
      }
    });
  }  
}