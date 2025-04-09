import {Component, signal} from '@angular/core';
import {InstanceWithUsers} from '../../model/instance.model';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {DatePipe, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {toUserFullName} from '../../model/user.model';

@Component({
  selector: 'instance-preview',
  imports: [
    Dialog,
    Button,
    DatePipe,
    NgIf,
    TableModule
  ],
  templateUrl: './instance-preview.component.html',
  styles: ``
})
export class InstancePreviewComponent {
  protected readonly toUserFullName = toUserFullName;
  instance = signal<InstanceWithUsers | undefined>(undefined);
  isShown = signal<boolean>(false);

  readonly hide = () => {
    this.isShown.set(false);
    this.instance.set(undefined);
  }

  readonly show = (instance: InstanceWithUsers) => {
    this.instance.set(instance);
    this.isShown.set(true);
  }
}
