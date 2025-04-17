import {Component, inject, signal, viewChild} from '@angular/core';
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
import {getUserIsoCountryLabel} from '../../model/iso-country.model';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'user-showcase',
  imports: [
    UserManagementComponent,
    UserPreviewComponent,
    TableModule,
    ConfirmationComponent,
    MessagesShowcaseComponent,
    Button,
    DatePipe
  ],
  templateUrl: './user-showcase.component.html',
  styles: ``
})
export class UserShowcaseComponent {
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly userService = inject(UserService);

  confirmationComponent = viewChild.required(ConfirmationComponent);
  managementMenu = viewChild.required(UserManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(UserPreviewComponent);
  users = this.userService.getAsSignal();

  protected readonly getCountryName = getUserIsoCountryLabel;

  delete(user: User) {
    this.confirmationComponent().request(() => {
      this.userService.delete(user.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['User deleted successfully']}),
        error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
      });
    });
  }

  showManagement(user?: User) {
    this.managementMenu().show(user);
  }

  showPreview(user: User) {
    this.previewMenu().show(user);
  }
}
