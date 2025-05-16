import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'failed-to-load-please-reload',
  imports: [
    Button,
    TranslatePipe
  ],
  templateUrl: './failed-to-load-please-reload.component.html',
  styles: ``
})
export class FailedToLoadPleaseReloadComponent {
  protected reload() {
    window.location.reload();
  }
}
