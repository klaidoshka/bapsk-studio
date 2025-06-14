import {Component, effect, inject, input, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button} from 'primeng/button';
import {DataEntryService} from '../../service/data-entry.service';
import Messages from '../../model/messages.model';
import {DataEntryImportRequest, DataEntryJoined} from '../../model/data-entry.model';
import {first, map} from 'rxjs';
import {MessageHandlingService} from '../../service/message-handling.service';
import {Select} from 'primeng/select';
import DataType from '../../model/data-type.model';
import {ImportConfigurationService} from '../../service/import-configuration.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {FileUpload} from 'primeng/fileupload';
import {Checkbox} from 'primeng/checkbox';
import {NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {DataEntryTableComponent} from '../data-entry-table/data-entry-table.component';
import {FloatLabel} from 'primeng/floatlabel';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'data-entry-import-form',
  imports: [
    Button,
    Select,
    ReactiveFormsModule,
    MessagesShowcaseComponent,
    FileUpload,
    Checkbox,
    NgIf,
    TableModule,
    DataEntryTableComponent,
    FloatLabel,
    FormInputErrorComponent,
    TranslatePipe
  ],
  templateUrl: './data-entry-import-form.component.html',
  styles: ``
})
export class DataEntryImportFormComponent {
  private readonly dataEntryService = inject(DataEntryService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly importConfigurationService = inject(ImportConfigurationService);
  private readonly messageHandlingService = inject(MessageHandlingService);
  protected readonly importedEntries = signal<DataEntryJoined[]>([]);
  protected readonly messages = signal<Messages>({});
  readonly clearImportedValues = input<boolean>();
  readonly dataType = input.required<DataType>();
  readonly instanceId = input.required<number>();

  protected readonly importConfigurations = rxResource({
    request: () => ({
      dataTypeId: this.dataType().id,
      instanceId: this.dataType().instanceId
    }),
    loader: ({request}) => this.importConfigurationService
      .getAllByDataTypeId(request.instanceId, request.dataTypeId)
      .pipe(map(configurations => configurations.map(configuration => ({
        id: configuration.id,
        label: configuration.name
      }))))
  });

  protected readonly form = this.formBuilder.group({
    file: [null as File | null, [Validators.required]],
    importConfigurationId: [null as number | null, [Validators.required]],
    skipHeader: [false]
  });

  constructor() {
    effect(() => {
      if (this.clearImportedValues()) {
        this.importedEntries.set([]);
      }
    });
  }

  protected getSelectedFileSize(): string | undefined {
    const file = this.form.value.file;

    if (!file) {
      return undefined;
    }

    const fileSize = file.size;
    const kb = 1024;
    const mb = kb * 1024;
    const gb = mb * 1024;

    if (fileSize < kb) {
      return `${fileSize} B`;
    } else if (fileSize < mb) {
      return `${(fileSize / kb).toFixed(2)} KB`;
    } else if (fileSize < gb) {
      return `${(fileSize / mb).toFixed(2)} MB`;
    } else {
      return `${(fileSize / gb).toFixed(2)} GB`;
    }
  }

  protected import() {
    if (this.form.invalid) {
      this.messages.set({error: ["error.fill-all-fields."]});
      return;
    }

    const request: DataEntryImportRequest = {
      importConfigurationId: this.form.value.importConfigurationId!,
      file: this.form.value.file!,
      instanceId: this.dataType().instanceId,
      skipHeader: this.form.value.skipHeader || false
    }

    this.dataEntryService.import(request).pipe(first()).subscribe({
      next: (entries) => {
        this.importedEntries.set(entries);
        this.messages.set({success: ['action.data-entry.imported']});
      },
      error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
    });
  }

  protected onSelect(files: File[]) {
    this.form.patchValue({file: files.at(0)});
  }
}
