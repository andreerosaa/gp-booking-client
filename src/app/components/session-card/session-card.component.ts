import { Component, inject, Input } from '@angular/core';
import { SessionModel, SessionStatusMessages } from '../../models/session.model';
import { MatDialog } from '@angular/material/dialog';
import { SessionBookingDialogComponent } from '../session-booking-dialog/session-booking-dialog.component';

@Component({
  selector: 'app-session-card',
  standalone: false,
  
  templateUrl: './session-card.component.html',
  styleUrl: './session-card.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionCardComponent {

  @Input() session!: SessionModel;

  readonly dialog = inject(MatDialog);

  SessionStatusMessages = SessionStatusMessages;
  
  openSessionBookingDialog() {
    const dialogRef = this.dialog.open(SessionBookingDialogComponent, {
      data:{
        session: this.session
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do something
      }
    });
  }  
}
