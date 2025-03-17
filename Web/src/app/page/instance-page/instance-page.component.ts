import {Component, inject, Signal} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {InstanceService} from '../../service/instance.service';
import Instance from '../../model/instance.model';
import {TableModule} from 'primeng/table';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
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
  providers: [MessageService, ConfirmationService],
})
export class InstancePageComponent {
  private formBuilder = inject(FormBuilder);
  private instanceService = inject(InstanceService);

  $form!: FormGroup;
  $instances!: Signal<Instance[]>;

  constructor() {
    this.$form = this.formBuilder.group({
      name: [null, Validators.required],
      description: null
    });

    this.$instances = this.instanceService.getAsSignal();
  }
}
