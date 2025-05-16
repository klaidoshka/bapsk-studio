import {inject, Injectable, Signal, signal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly translateService = inject(TranslateService);
  private readonly languageKey = '__accounting_language__'
  private readonly language = signal<string>(this.getStoredLanguage());

  constructor() {
    this.translateService.addLangs(['lt']);
    this.translateService.setDefaultLang('en');
    this.setLanguage(this.language());
  }

  private getStoredLanguage(): string {
    return localStorage.getItem(this.languageKey) ?? this.translateService.getBrowserLang() ?? 'en';
  }

  getAvailableLanguages(): string[] {
    return this.translateService.getLangs();
  }

  getLanguage(): Signal<string> {
    return this.language.asReadonly();
  }

  setLanguage(language: string): void {
    if (this.language() !== language) {
      this.language.set(language);
    }
    this.translateService.use(language);
    localStorage.setItem(this.languageKey, language);
  }
}
