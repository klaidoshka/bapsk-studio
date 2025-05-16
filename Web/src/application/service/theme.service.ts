import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = '__accounting_theme__'
  private readonly darkTheme!: WritableSignal<boolean>;

  constructor() {
    this.darkTheme = signal(this.isStoredDarkTheme());
    this.toggleTheme(this.darkTheme());
  }

  private isStoredDarkTheme() {
    const theme = localStorage.getItem(this.themeKey);

    if (theme == null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return theme === 'true';
  }

  private storeTheme(theme: boolean) {
    localStorage.setItem(this.themeKey, theme.toString());
  }

  isDarkTheme() {
    return this.darkTheme.asReadonly();
  }

  toggleTheme(value?: boolean) {
    this.darkTheme.set(value != null ? value : !this.darkTheme());
    this.storeTheme(this.darkTheme());

    if (this.darkTheme()) {
      document.querySelector('html')?.classList?.add('dark');
    } else {
      document.querySelector('html')?.classList?.remove('dark');
    }
  }
}
