import {Component, computed, input} from '@angular/core';
import {ReportGenerateFormComponent} from '../../component/report-generate-form/report-generate-form.component';
import {NumberUtil} from '../../util/number.util';
import {CardComponent} from '../../component/card/card.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'report-generate-page',
  imports: [
    ReportGenerateFormComponent,
    CardComponent,
    TranslatePipe
  ],
  templateUrl: './report-generate-page.component.html',
  styles: ``
})
export class ReportGeneratePageComponent {
  protected readonly instanceId = input.required<string>();
  protected readonly instanceIdAsNumber = computed(() => NumberUtil.parse(this.instanceId()));
}
