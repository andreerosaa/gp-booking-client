import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '../../../../services/snack-bar/snack-bar.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected readonly _maxLength = 50;

  readonly hide = signal(true);

  readonly loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(this._maxLength)]),
    password: new FormControl('', [Validators.required, Validators.maxLength(this._maxLength)]),
  });

  loading = false;

  constructor(
    readonly _authService: AuthService,
    readonly _snackBarService: SnackBarService,
  ) {}

  login() {
    this.loading = true;
    this._authService.login(this.getUsernameControl.value, this.getPasswordControl.value).subscribe({
      next: () => {
      },
      complete: () => {
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.log(error);
        switch (error.status) {
          case HttpStatusCode.BadRequest:
            this._snackBarService.openErrorSnackBar('Nome de utilizador ou palavra-passe incorretos');
            break;
          case HttpStatusCode.UnprocessableEntity:
            this._snackBarService.openErrorSnackBar('Nome de utilizador ou palavra-passe incorretos');
            break;
          case HttpStatusCode.Unauthorized:
            this._snackBarService.openErrorSnackBar('Credenciais inválidas');
            break;
          default:
            this._snackBarService.openErrorSnackBar('Erro a efetuar login');
            break;
        }
      }
    });
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  get getUsernameControl(): FormControl {
		return this.loginForm.get('username') as FormControl;
	}
	get getPasswordControl(): FormControl {
		return this.loginForm.get('password') as FormControl;
	}
}
