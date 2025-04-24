import {Component, inject, signal, viewChild, ViewEncapsulation} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {AuthService} from '../../service/auth.service';
import {MenuItem, MessageService} from 'primeng/api';
import {Router, RouterLink} from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {NgIf} from '@angular/common';
import {ClickOutsideDirective} from '../../directive/click-outside.directive';

@Component({
  selector: 'profile-dropdown',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    ConfirmationComponent,
    NgIf,
    RouterLink,
    ClickOutsideDirective
  ],
  templateUrl: './profile-dropdown.component.html',
  styleUrl: './profile-dropdown.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProfileDropdownComponent {
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  confirmationComponent = viewChild.required(ConfirmationComponent);
  isProfileMenuOpen = signal<boolean>(false);

  displayName = rxResource({
    loader: () => this.authService
      .getUser()
      .pipe(
        map(user => user != null ? user.firstName + ' ' + user.lastName : 'Profile')
      )
  });

  private getEntries(): MenuItem[] {
    return [
      {
        label: this.displayName.value(),
        icon: 'pi pi-user',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-user-edit',
            routerLink: "/home/profile"
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          }
        ]
      }
    ]
  }

  logout() {
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
