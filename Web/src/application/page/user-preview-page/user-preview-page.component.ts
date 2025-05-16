import {Component, inject, input} from '@angular/core';
import {DatePipe} from "@angular/common";
import {getUserIsoCountryLabel} from '../../model/iso-country.model';
import {UserService} from '../../service/user.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {NumberUtil} from '../../util/number.util';
import {of} from 'rxjs';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {UserPageHeaderSectionComponent} from '../../component/user-page-header-section/user-page-header-section.component';
import {CardComponent} from '../../component/card/card.component';
import {TranslatePipe} from '@ngx-translate/core';
import {toUserFullName} from '../../model/user.model';

@Component({
  selector: 'user-preview-page',
  imports: [
    DatePipe,
    FailedToLoadPleaseReloadComponent,
    LoadingSpinnerComponent,
    UserPageHeaderSectionComponent,
    CardComponent,
    TranslatePipe
  ],
  templateUrl: './user-preview-page.component.html',
  styles: ``
})
export class UserPreviewPageComponent {
  private readonly userService = inject(UserService);
  protected readonly toUserFullName = toUserFullName;
  protected readonly getCountryName = getUserIsoCountryLabel;
  protected readonly userId = input.required<string>();

  protected readonly user = rxResource({
    request: () => ({
      userId: NumberUtil.parse(this.userId())
    }),
    loader: ({request}) => request.userId
      ? this.userService.getById(request.userId)
      : of(undefined)
  });
}
