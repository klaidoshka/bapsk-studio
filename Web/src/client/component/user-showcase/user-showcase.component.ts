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
import {getUserIsoCountryLabel} from '../../model/iso-country.model';
import {LocalizationService} from '../../service/localization.service';
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
  confirmationComponent = viewChild.required(ConfirmationComponent);
  managementMenu = viewChild.required(UserManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(UserPreviewComponent);
  users!: Signal<User[]>;

  constructor(
    private localizationService: LocalizationService,
    private userService: UserService
  ) {
    this.users = this.userService.getAsSignal();
  }

  readonly delete = (user: User) => {
    this.confirmationComponent().request(() => {
      this.userService.delete(user.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['User deleted successfully']}),
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
    });
  }

  readonly showManagement = (user?: User) => {
    this.managementMenu().show(user);
  }

  readonly showPreview = (user: User) => {
    this.previewMenu().show(user);
  }

  protected readonly getCountryName = getUserIsoCountryLabel;
}
