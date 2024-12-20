import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '../../../../services/snack-bar/snack-bar.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly _destroyRef = inject(DestroyRef);

  protected readonly _maxLength = 50;

  readonly hide = signal(true);
  readonly usernameErrorMessage = signal('');
	readonly passwordErrorMessage = signal('');

  readonly loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(this._maxLength)]),
    password: new FormControl('', [Validators.required, Validators.maxLength(this._maxLength)]),
  });

  loading = false;

  constructor(
    readonly _authService: AuthService,
    readonly _snackBarService: SnackBarService,
    readonly _router: Router,
  ) {
    merge(this.getUsernameControl.statusChanges, this.getUsernameControl.valueChanges)
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe(() => this.updateErrorMessage());
    merge(this.getPasswordControl.statusChanges, this.getPasswordControl.valueChanges)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    console.log(this.getPasswordControl)
		if (this.getUsernameControl.hasError('required')) {
			this.usernameErrorMessage.set('Campo obrigatório');
		} else {
			this.usernameErrorMessage.set('');
		}

		if (this.getPasswordControl.hasError('required')) {
			this.passwordErrorMessage.set('Campo obrigatório');
		} else {
			this.passwordErrorMessage.set('');
		}
	}

  login() {
    this.loading = true;
    this._authService.login(this.getUsernameControl.value, this.getPasswordControl.value).subscribe({
      next: () => {
      },
      complete: () => {
        this.loading = false;
        this._router.navigate(['']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.loginForm.reset();
        console.log(error);
        switch (error.status) {
          case HttpStatusCode.BadRequest:
            this._snackBarService.openErrorSnackBar('Credenciais inválidas');
            break;
          case HttpStatusCode.UnprocessableEntity:
            this._snackBarService.openErrorSnackBar('Credenciais inválidas');
            break;
          case HttpStatusCode.Unauthorized:
            this._snackBarService.openErrorSnackBar('Nome de utilizador ou password incorretos');
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
