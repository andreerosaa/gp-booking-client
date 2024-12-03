import { Component, OnInit, signal } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
	selector: 'app-header',
	standalone: false,
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
	darkMode = signal(true);

	constructor(private readonly _themeService: ThemeService) {}

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
}
