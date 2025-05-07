import {Component, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {HtmlUploadForOverhaulComponent} from '../../component/html-upload-for-overhaul/html-upload-for-overhaul.component';
import {Button} from 'primeng/button';
import {MockSaleButtonFormComponent} from '../../component/mock-sale-button-form/mock-sale-button-form.component';

@Component({
  selector: 'admin-page',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HtmlUploadForOverhaulComponent,
    Button,
    MockSaleButtonFormComponent
  ],
  templateUrl: './admin-page.component.html',
  styles: ``
})
export class AdminPageComponent {
  protected readonly isMobileSidebarOpen = signal<boolean>(true);
}
