import { Component, inject, input, output } from '@angular/core';
import { SessionByDateModel, SessionStatusEnum, SessionStatusMessages } from '../../models/session.model';
import { MatDialog } from '@angular/material/dialog';
import { SessionBookingDialogComponent } from '../session-booking-dialog/session-booking-dialog.component';
import { AuthService } from '../../services/auth/auth.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { SessionService } from '../../services/session/session.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';
import { Router } from '@angular/router';

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
  readonly authService = inject(AuthService);
  readonly sessionService = inject(SessionService);
  readonly snackBarService = inject(SnackBarService);
  readonly router = inject(Router);

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

  openDeleteSessionDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data:{
        title: 'Eliminar sessão',
        message: 'Tem a certeza de que pretende eliminar esta sessão?'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.deleteSession();
      }
    });
  }

  openEditSessionDialog(){}
  
  deleteSession(){
    this.sessionService.deleteSession(this.session()._id).subscribe({
      complete: () => {
        this.refreshTabEmitter.emit();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        switch(error.status) {
          case HttpStatusCode.Forbidden:
            this.snackBarService.openErrorSnackBar('Sem permissões para eliminar sessão');
            break;
          case HttpStatusCode.NotFound:
            this.snackBarService.openErrorSnackBar('Sessão não encontrada');
            break;
          default:
            this.snackBarService.openErrorSnackBar('Erro ao eliminar sessão');
            break;
        }
      }
    });
  }

  editSession(){}

  cancelSession(){}

  clearSession(){}

  sendConfirmationEmail(){}
}