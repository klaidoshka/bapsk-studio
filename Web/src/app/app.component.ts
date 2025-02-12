import {Component, inject, OnInit, signal} from "@angular/core";
import {Router, RouterModule} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {AuthService} from "./service/auth.service";

@Component({
  selector: "app-root",
  imports: [RouterModule, ConfirmDialogModule, ButtonModule, ToastModule],
  templateUrl: "./app.component.html",
  providers: [ConfirmationService, MessageService]
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  confirmLogout(event: MouseEvent) {
    this.confirmationService.confirm({
      key: "logout",
      target: event.target as EventTarget,
      header: "Are you really leaving?",
      closeOnEscape: true,
      icon: "pi pi-exclamation-triangle",
      rejectButtonProps: {
        label: "No",
        severity: "secondary",
        outlined: true
      },
      acceptButtonProps: {
        label: "Yes",
        severity: "danger"
      },

      accept: () => {
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
      }
    });
  }

  isLoggedIn = signal<boolean>(this.authService.isAuthenticatedValue());

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe({
      next: (isAuthenticated) => {
        this.isLoggedIn.set(isAuthenticated);
      }
    });
  }
}
