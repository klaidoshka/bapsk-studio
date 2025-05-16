import {Component, inject} from '@angular/core';
import {ProfileShowcaseComponent} from '../../component/profile-showcase/profile-showcase.component';
import {SessionShowcaseComponent} from '../../component/session-showcase/session-showcase.component';
import {AuthService} from '../../service/auth.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'profile-page',
  imports: [
    ProfileShowcaseComponent,
    SessionShowcaseComponent,
    LoadingSpinnerComponent,
    FailedToLoadPleaseReloadComponent,
    TranslatePipe
  ],
  templateUrl: './profile-page.component.html'
})
export class ProfilePageComponent {
  private readonly authService = inject(AuthService);
  protected readonly user = rxResource({loader: () => this.authService.getUser()});
}
