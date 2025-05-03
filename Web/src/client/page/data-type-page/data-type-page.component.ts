import {Component, inject, input, signal, viewChild} from '@angular/core';
import {Button} from 'primeng/button';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TableModule} from 'primeng/table';
import {DataTypeService} from '../../service/data-type.service';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {first, of} from 'rxjs';
import Messages from '../../model/messages.model';
import DataType from '../../model/data-type.model';
import {NumberUtil} from '../../util/number.util';
import {
  DataTypePageHeaderSectionComponent
} from '../../component/data-type-page-header-section/data-type-page-header-section.component';
import {CardComponent} from '../../component/card/card.component';

@Component({
  selector: 'data-type-page',
  templateUrl: './data-type-page.component.html',
  imports: [Button, ConfirmationComponent, MessagesShowcaseComponent, RouterLink, TableModule, DataTypePageHeaderSectionComponent, CardComponent],
  providers: []
})
export class DataTypePageComponent {
  private readonly dataTypeService = inject(DataTypeService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);

  protected readonly dataTypes = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({request}) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});

  protected delete(dataType: DataType) {
    this.confirmationComponent().request(() => {
      this.dataTypeService
        .delete(NumberUtil.parse(this.instanceId())!, dataType.id)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['Data type deleted successfully']}),
          error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
        });
    });
  }

  protected manage(dataType?: DataType) {
    this.router.navigate(['./' + (dataType ? `${dataType.id}/edit` : 'create')], {relativeTo: this.route});
  }

  protected preview(dataType: DataType) {
    this.router.navigate(['./' + dataType.id], {relativeTo: this.route});
  }
}
