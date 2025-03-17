import {Component, input, OnInit, signal} from '@angular/core';
import Instance from '../../model/instance.model';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-instance-preview',
  imports: [
    Dialog,
    Button,
    DatePipe
  ],
  templateUrl: './instance-preview.component.html',
  styles: ``
})
export class InstancePreviewComponent implements OnInit {
  instance = signal<Instance | null>(null);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  readonly hide = () => {
    this.isShown.set(false);
    this.instance.set(null);
  }

  readonly show = (instance: Instance | null) => {
    this.instance.set(instance);
    this.isShown.set(true);
  }
}
