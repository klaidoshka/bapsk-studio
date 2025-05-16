import {Component, inject} from '@angular/core';
import {ThemeService} from '../../service/theme.service';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'theme-selector',
  imports: [
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './theme-selector.component.html'
})
export class ThemeSelectorComponent {
  private readonly themeService = inject(ThemeService);
  protected readonly isDarkTheme = this.themeService.isDarkTheme();

  protected toggleTheme() {
    this.themeService.toggleTheme();
  }
}
