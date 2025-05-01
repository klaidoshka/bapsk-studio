import {Component} from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'failed-to-load-please-reload',
  imports: [
    Button
  ],
  templateUrl: './failed-to-load-please-reload.component.html',
  styles: ``
})
export class FailedToLoadPleaseReloadComponent {
  protected reload() {
    window.location.reload();
  }
}
