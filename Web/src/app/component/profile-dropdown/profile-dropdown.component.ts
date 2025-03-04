import {Component, computed, effect, signal, Signal, untracked, viewChild} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {AuthService} from '../../service/auth.service';
import {MenuItem, MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {Menubar} from 'primeng/menubar';
import {ConfirmationComponent} from '../confirmation/confirmation.component';

@Component({
  selector: 'app-profile-dropdown',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    Menubar,
    ConfirmationComponent
  ],
  templateUrl: './profile-dropdown.component.html'
})
export class ProfileDropdownComponent {
  confirmationComponent = viewChild.required(ConfirmationComponent);
  displayName!: Signal<string>;
  entries = signal<MenuItem[]>([]);
  isAuthenticated!: Signal<boolean>;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.displayName = computed(() => {
      const user = this.authService.getUser()();
      return user !== null ? user.firstName + ' ' + user.lastName : '';
    });

    this.isAuthenticated = this.authService.isAuthenticated();

    effect(() => {
      const user = this.authService.getUser()();

      untracked(() => {
          if (user === null && this.entries().length > 0) {
            this.entries.set([]);
          } else if (user !== null) {
            this.entries.set(this.getEntries());
          }
        }
      );
    });
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
            routerLink: "/profile"
          },
          {
            label: 'Sessions',
            icon: 'pi pi-clock',
            routerLink: "/profile/sessions",
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
            label: 'Data Entries',
            icon: 'pi pi-table',
            routerLink: "/data/entries",
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
