import {Component, inject} from '@angular/core';
import {
  ProfileShowcaseComponent
} from '../../component/profile-showcase/profile-showcase.component';
import {
  SessionShowcaseComponent
} from '../../component/session-showcase/session-showcase.component';
import {AuthService} from '../../service/auth.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {ProgressSpinner} from 'primeng/progressspinner';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';

@Component({
  selector: 'profile-page',
  imports: [
    ProfileShowcaseComponent,
    SessionShowcaseComponent,
    ProgressSpinner,
    FailedToLoadPleaseReloadComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  private readonly authService = inject(AuthService);
  protected readonly user = rxResource({loader: () => this.authService.getUser()});
}
