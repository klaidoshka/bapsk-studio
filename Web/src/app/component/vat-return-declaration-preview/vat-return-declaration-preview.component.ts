import {Component, input, OnInit, signal} from '@angular/core';
import VatReturnDeclaration, {getSubmitDeclarationStateLabel} from '../../model/vat-return.model';
import {Button} from 'primeng/button';
import {DatePipe, NgIf} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-vat-return-declaration-preview',
  imports: [
    Button,
    Dialog,
    NgIf,
    TableModule,
    DatePipe
  ],
  templateUrl: './vat-return-declaration-preview.component.html',
  styles: ``
})
export class VatReturnDeclarationPreviewComponent implements OnInit {
  declaration = signal<VatReturnDeclaration | null>(null);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  readonly hide = () => {
    this.isShown.set(false);
    this.declaration.set(null);
  }

  readonly show = (declaration: VatReturnDeclaration | null) => {
    this.declaration.set(declaration);
    this.isShown.set(true);
  }
  protected readonly getSubmitDeclarationStateLabel = getSubmitDeclarationStateLabel;
}
