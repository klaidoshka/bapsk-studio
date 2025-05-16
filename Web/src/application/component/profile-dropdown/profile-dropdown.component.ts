import {Component, inject, signal, viewChild} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {AuthService} from '../../service/auth.service';
import {MessageService} from 'primeng/api';
import {Router, RouterLink} from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {ClickOutsideDirective} from '../../directive/click-outside.directive';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'profile-dropdown',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    ConfirmationComponent,
    RouterLink,
    ClickOutsideDirective,
    TranslatePipe
  ],
  templateUrl: './profile-dropdown.component.html'
})
export class ProfileDropdownComponent {
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly isProfileMenuOpen = signal<boolean>(false);

  protected readonly displayName = rxResource({
    loader: () => this.authService
      .getUser()
      .pipe(
        map(user => user != null
          ? user.firstName + ' ' + user.lastName
          : this.translateService.instant("component.profile-dropdown.option.profile")
        )
      )
  });

  protected logout() {
    this.confirmationComponent().request(() => {
      this.authService.logout().subscribe({
        next: () => {
          this.messageService.add({
            key: "root",
            severity: "success",
            summary: this.translateService.instant('action.auth.summary'),
            detail: this.translateService.instant('action.auth.logged-out')
          });
          this.router.navigate(["/auth/login"]);
        }
      });
    });
  }
}
