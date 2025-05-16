import {Component, inject, signal, viewChild} from '@angular/core';
import {Button} from 'primeng/button';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {DatePipe} from '@angular/common';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {TableModule} from 'primeng/table';
import {MessageHandlingService} from '../../service/message-handling.service';
import {UserService} from '../../service/user.service';
import Messages from '../../model/messages.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {getUserIsoCountryLabel} from '../../model/iso-country.model';
import {User} from '../../model/user.model';
import {first, map} from 'rxjs';
import {Router} from '@angular/router';
import {UserPageHeaderSectionComponent} from '../../component/user-page-header-section/user-page-header-section.component';
import {CardComponent} from '../../component/card/card.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'user-page',
  imports: [
    Button,
    ConfirmationComponent,
    DatePipe,
    MessagesShowcaseComponent,
    TableModule,
    UserPageHeaderSectionComponent,
    CardComponent,
    TranslatePipe
  ],
  templateUrl: './user-page.component.html',
  styles: ``
})
export class UserPageComponent {
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  private readonly userService = inject(UserService);
  protected readonly getCountryName = getUserIsoCountryLabel;
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly messages = signal<Messages>({});

  protected readonly users = rxResource({
    loader: () => this.userService
      .getAll()
      .pipe(
        map(users => users.map(user => ({
          ...user,
          fullName: user.firstName + ' ' + user.lastName,
          countryLabel: this.getCountryName(user)
        })))
      )
  });

  protected delete(user: User) {
    this.confirmationComponent().request(() => {
      this.userService
        .delete(user.id!!)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['action.user.deleted']}),
          error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
        });
    });
  }

  protected manage(user?: User) {
    this.router.navigate(['/home/admin/user/' + (user ? `${user.id}/edit` : 'create')]);
  }

  protected preview(user: User) {
    this.router.navigate(['/home/admin/user/' + user.id]);
  }
}
