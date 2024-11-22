import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  readonly _durationInSeconds = 50;
  readonly _snackBar = inject(MatSnackBar);

  openSuccessSnackBar(message: string, durationInSeconds = this._durationInSeconds) {
    this._snackBar.openFromComponent( SnackBarComponent, {
      duration: durationInSeconds * 1000,
      data: {
        iconName: 'done',
        message: message
      }
    });
  }

  openErrorSnackBar(message: string, durationInSeconds = this._durationInSeconds) {
    this._snackBar.openFromComponent( SnackBarComponent, {
      duration: durationInSeconds * 1000,
      data: {
        iconName: 'error',
        message: message
      }
    });
  }
}
