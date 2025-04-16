import {Component, inject} from '@angular/core';
import {ThemeService} from '../../service/theme.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'theme-selector',
  imports: [
    FormsModule
  ],
  templateUrl: './theme-selector.component.html'
})
export class ThemeSelectorComponent {
  private readonly themeService = inject(ThemeService);

  isDarkTheme = this.themeService.isDarkTheme();

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
