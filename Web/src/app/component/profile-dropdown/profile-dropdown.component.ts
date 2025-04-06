import {Component, computed, effect, signal, Signal, untracked, viewChild, ViewEncapsulation} from '@angular/core';
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
  selector: 'app-profile-dropdown',
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
  confirmationComponent = viewChild.required(ConfirmationComponent);
  displayName!: Signal<string>;
  entries = signal<MenuItem[]>([]);

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.displayName = computed(() => {
      const user = this.authService.getUser()();
      return user != null ? user.firstName + ' ' + user.lastName : 'Profile';
    });

    this.entries.set(this.getEmptyEntries());

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

  private readonly getEmptyEntries = (): MenuItem[] => {
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

  private readonly getEntries = (): MenuItem[] => {
    return [
      {
        label: this.displayName(),
        icon: 'pi pi-user',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-user-edit',
            routerLink: "/profile"
          },
          {
            label: 'Instances',
            icon: 'pi pi-server',
            routerLink: "/instances",
          },
          {
            label: 'Data Types',
            icon: 'pi pi-table',
            routerLink: "/data/types",
          },
          {
            label: 'Workspace',
            icon: 'pi pi-desktop',
            routerLink: "/workspace",
          },
          {
            visible: this.authService.getUser()()?.role == Role.Admin,
            label: 'Users',
            icon: 'pi pi-users',
            routerLink: "/users",
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

  readonly logout = () => {
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
