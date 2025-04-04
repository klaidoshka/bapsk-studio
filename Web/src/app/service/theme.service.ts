import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = '__accounting_theme__'
  private readonly darkTheme!: WritableSignal<boolean>;

  constructor() {
    this.darkTheme = signal(this.isStoredDarkTheme());
  }

  private readonly isStoredDarkTheme = () => {
    const theme = localStorage.getItem(this.themeKey);

    if (theme === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return theme === 'true';
  }

  private readonly storeTheme = (theme: boolean) => {
    localStorage.setItem(this.themeKey, theme.toString());
  }

  readonly isDarkTheme = () => this.darkTheme.asReadonly();

  readonly toggleTheme = () => {
    this.darkTheme.set(!this.darkTheme());

    this.storeTheme(this.darkTheme());

    document.querySelector('html')?.classList?.toggle('dark');
  }
}
