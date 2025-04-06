import {Component, Signal} from '@angular/core';
import {ThemeService} from '../../service/theme.service';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-theme-selector',
  imports: [
    FormsModule,
    Button
  ],
  templateUrl: './theme-selector.component.html'
})
export class ThemeSelectorComponent {
  isDarkTheme!: Signal<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkTheme = this.themeService.isDarkTheme();
  }

  readonly toggleTheme = () => this.themeService.toggleTheme();
}
