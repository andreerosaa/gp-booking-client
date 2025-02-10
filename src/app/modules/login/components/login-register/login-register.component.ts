import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '../../../../services/snack-bar/snack-bar.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LoginForm } from '../../../../models/user.model';

@Component({
	selector: 'app-login-register',
	standalone: false,

	templateUrl: './login-register.component.html',
	styleUrl: './login-register.component.scss'
})
export class LoginRegisterComponent {}
