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

@Component({
  selector: 'profile-dropdown',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    ConfirmationComponent,
    RouterLink,
    ClickOutsideDirective
  ],
  templateUrl: './profile-dropdown.component.html'
})
export class ProfileDropdownComponent {
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly isProfileMenuOpen = signal<boolean>(false);

  protected readonly displayName = rxResource({
    loader: () => this.authService
      .getUser()
      .pipe(
        map(user => user != null ? user.firstName + ' ' + user.lastName : 'Profile')
      )
  });

  protected logout() {
    this.confirmationComponent().request(() => {
      this.authService.logout().subscribe({
        next: () => {
          this.messageService.add({
            key: "root",
            severity: "success",
            summary: "Logged out",
            detail: "You have logged out from the system"
          });
          this.router.navigate(["/auth/login"]);
        }
      });
    });
  }
}
