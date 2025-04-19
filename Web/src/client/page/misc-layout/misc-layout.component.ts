import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ThemeSelectorComponent} from '../../component/theme-selector/theme-selector.component';

@Component({
  selector: 'misc-layout',
  imports: [
    RouterOutlet,
    ThemeSelectorComponent
  ],
  templateUrl: './misc-layout.component.html',
  styles: ``
})
export class MiscLayoutComponent {

}
