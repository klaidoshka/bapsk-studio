import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {
  HtmlUploadForOverhaulComponent
} from '../../component/html-upload-for-overhaul/html-upload-for-overhaul.component';

@Component({
  selector: 'admin-page',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HtmlUploadForOverhaulComponent
  ],
  templateUrl: './admin-page.component.html',
  styles: ``
})
export class AdminPageComponent {
}
