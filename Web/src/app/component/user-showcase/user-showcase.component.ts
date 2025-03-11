import {Component, Signal, signal, viewChild} from '@angular/core';
import {UserManagementComponent} from '../user-management/user-management.component';
import {UserPreviewComponent} from '../user-preview/user-preview.component';
import {TableModule} from 'primeng/table';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {Button} from 'primeng/button';
import {UserService} from '../../service/user.service';
import Messages from '../../model/messages.model';
import {User} from '../../model/user.model';
import {first} from 'rxjs';
import ErrorResponse from '../../model/error-response.model';
import {getCountryName} from '../../model/iso-country.model';

@Component({
  selector: 'app-user-showcase',
  imports: [
    UserManagementComponent,
    UserPreviewComponent,
    TableModule,
    ConfirmationComponent,
    MessagesShowcaseComponent,
    Button
  ],
  templateUrl: './user-showcase.component.html',
  styles: ``
})
export class UserShowcaseComponent {
  confirmationComponent = viewChild.required(ConfirmationComponent);
  managementMenu = viewChild.required(UserManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(UserPreviewComponent);
  users!: Signal<User[]>;

  constructor(
    private userService: UserService
  ) {
    this.users = this.userService.getAsSignal();
  }

  delete(user: User) {
    this.confirmationComponent().request(() => {
      this.userService.delete(user.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['User deleted successfully']}),
        error: (response: ErrorResponse) => this.messages.set({
          error: response.error?.messages || ['Extremely rare error occurred, please try again later.']
        })
      });
    });
  }

  showManagement(user: User | null) {
    this.managementMenu().show(user);
  }

  showPreview(user: User) {
    this.previewMenu().show(user);
  }

  protected readonly getCountryName = getCountryName;
}
