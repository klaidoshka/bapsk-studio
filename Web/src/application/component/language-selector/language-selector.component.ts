import {Component, computed, inject} from '@angular/core';
import {LanguageService} from '../../service/language.service';
import {Button} from 'primeng/button';

@Component({
  selector: 'language-selector',
  imports: [
    Button
  ],
  templateUrl: './language-selector.component.html',
  styles: ``
})
export class LanguageSelectorComponent {
  private readonly languageService = inject(LanguageService);
  protected readonly language = this.languageService.getLanguage();
  protected readonly languages = this.languageService.getAvailableLanguages();
  protected readonly nextLanguage = computed(() => this.languages.find(l => l !== this.language()) ?? this.language());

  protected onSwitchLanguage() {
    this.languageService.setLanguage(this.nextLanguage());
    window.location.reload();
  }
}
