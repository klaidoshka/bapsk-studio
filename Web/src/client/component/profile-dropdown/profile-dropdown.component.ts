import {Component, computed, effect, inject, signal, untracked, viewChild, ViewEncapsulation} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {AuthService} from '../../service/auth.service';
import {MenuItem, MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {Menubar} from 'primeng/menubar';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import {Role} from '../../model/role.model';

@Component({
  selector: 'profile-dropdown',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    Menubar,
    ConfirmationComponent
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

  displayName = computed(() => {
    const user = this.authService.getUser()();
    return user != null ? user.firstName + ' ' + user.lastName : 'Profile';
  });

  entries = signal<MenuItem[]>(this.getEmptyEntries());

  constructor() {
    effect(() => {
      const user = this.authService.getUser()();

      untracked(() => {
          if (user === null && this.entries().length > 0) {
            this.entries.set(this.getEmptyEntries());
          } else if (user !== null) {
            this.entries.set(this.getEntries());
          }
        }
      );
    });
  }

  private getEmptyEntries(): MenuItem[] {
    return [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          }
        ]
      }
    ]
  }

  private getEntries(): MenuItem[] {
    return [
      {
        label: this.displayName(),
        icon: 'pi pi-user',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-user-edit',
            routerLink: "/home/profile"
          },
          {
            label: 'Instances',
            icon: 'pi pi-server',
            routerLink: "/home/instance"
          },
          {
            label: 'Data Types',
            icon: 'pi pi-table',
            routerLink: "/home/data-type"
          },
          {
            label: 'Import Configurations',
            icon: 'pi pi-file-import',
            routerLink: "/home/import-configuration"
          },
          {
            label: 'Report Templates',
            icon: 'pi pi-file',
            routerLink: "/home/report-template"
          },
          {
            label: 'Workspace',
            icon: 'pi pi-desktop',
            routerLink: "/home/workspace"
          },
          {
            visible: this.authService.getUser()()?.role == Role.Admin,
            label: 'Users',
            icon: 'pi pi-users',
            routerLink: "/home/user"
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
