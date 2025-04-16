import {Component} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {
  InstanceShowcaseComponent
} from '../../component/instance-showcase/instance-showcase.component';

@Component({
  selector: 'instance-page',
  templateUrl: './instance-page.component.html',
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    ConfirmDialogModule,
    InstanceShowcaseComponent
  ],
  providers: [MessageService, ConfirmationService]
})
export class InstancePageComponent {

}
