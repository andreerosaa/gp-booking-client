import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _darkMode = true;

  isDarkMode() {
    return this._darkMode;
  }

  setDarkMode(isDarkMode: boolean) {
    this._darkMode = isDarkMode;
    localStorage.setItem('isDarkMode', this._darkMode.toString());
    if (!isDarkMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }
}
