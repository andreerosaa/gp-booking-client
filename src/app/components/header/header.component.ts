import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemeService } from '../../services/theme/theme.service';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';

@Component({
	selector: 'app-header',
	standalone: false,
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
	private readonly _themeService = inject(ThemeService);
	private readonly _snackBarService = inject(SnackBarService);
	
	readonly authService = inject(AuthService);
	readonly darkMode = signal(true);

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
					error: (error: HttpErrorResponse) => {
						console.error(error);
						this._snackBarService.openErrorSnackBar('Erro a efetuar logout');
					}
				});
	}
}
