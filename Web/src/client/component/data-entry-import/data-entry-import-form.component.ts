import {Component, effect, inject, input, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button} from 'primeng/button';
import {DataEntryService} from '../../service/data-entry.service';
import Messages from '../../model/messages.model';
import {DataEntryImportRequest, DataEntryJoined} from '../../model/data-entry.model';
import {first, map} from 'rxjs';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
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
    DataEntryTableComponent
  ],
  templateUrl: './data-entry-import-form.component.html',
  styles: ``
})
export class DataEntryImportFormComponent {
  private readonly dataEntryService = inject(DataEntryService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly importConfigurationService = inject(ImportConfigurationService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);

  clearImportedValues = input<boolean>();
  dataType = input.required<DataType>();
  importedEntries = signal<DataEntryJoined[]>([]);
  messages = signal<Messages>({});

  importConfigurations = rxResource({
    request: () => ({
      dataTypeId: this.dataType().id
    }),
    loader: ({ request }) => this.importConfigurationService
      .getAllByDataTypeId(request.dataTypeId)
      .pipe(map(configurations => configurations.map(configuration => ({
        id: configuration.id,
        label: configuration.name
      }))))
  });

  form = this.formBuilder.group({
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

  getSelectedFileSize(): string | undefined {
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

  import() {
    if (this.form.invalid) {
      this.messages.set({ error: ["Please fill in all required fields."] });
      return;
    }

    const request: DataEntryImportRequest = {
      importConfigurationId: this.form.value.importConfigurationId!,
      file: this.form.value.file!,
      skipHeader: this.form.value.skipHeader || false
    }

    this.dataEntryService.import(request).pipe(first()).subscribe({
      next: (entries) => {
        this.importedEntries.set(entries);
        this.messages.set({ success: ['Data entries imported successfully.'] });
      },
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  onSelect(files: File[]) {
    this.form.patchValue({ file: files.at(0) });
  }
}
