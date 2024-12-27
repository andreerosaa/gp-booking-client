import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemeService } from '../../services/theme/theme.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';

@Component({
	selector: 'app-header',
	standalone: false,
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
	readonly authService = inject(AuthService);
	readonly darkMode = signal(true);

	constructor(
		private readonly _themeService: ThemeService,
		private readonly _router: Router,
		private readonly _snackBarService: SnackBarService
	) {}

	ngOnInit() {
		const darkModeInLocalStorage = localStorage.getItem('isDarkMode');
		if (darkModeInLocalStorage) {
			this._themeService.setDarkMode(JSON.parse(darkModeInLocalStorage));
		}

		this.darkMode.set(this._themeService.isDarkMode());
	}

	toggleDarkMode(event: MatSlideToggleChange) {
		this.darkMode.set(event.checked);
		this._themeService.setDarkMode(event.checked);
	}

	logout() {
		this.authService.logout().subscribe({
					complete: () => {
						this._router.navigate(['/']);
					},
					error: (error: HttpErrorResponse) => {
						console.log(error);
						this._snackBarService.openErrorSnackBar('Erro a efetuar logout');
					}
				});
	}
}
