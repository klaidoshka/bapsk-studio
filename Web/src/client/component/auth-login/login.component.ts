import {Component, inject, signal} from "@angular/core";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Button} from "primeng/button";
import {LoginRequest} from "../../model/auth.model";
import ErrorResponse from "../../model/error-response.model";
import {AuthService} from "../../service/auth.service";
import {TextService} from "../../service/text.service";
import {InputText} from "primeng/inputtext";
import Messages from "../../model/messages.model";
import {LocalizationService} from '../../service/localization.service';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {Password} from 'primeng/password';
import {MessageService} from 'primeng/api';
import {Dialog} from 'primeng/dialog';
import {AuthResetPasswordComponent} from '../auth-reset-password/auth-reset-password.component';

@Component({
  selector: "auth-login",
  templateUrl: "./login.component.html",
  imports: [Button, ReactiveFormsModule, FormsModule, RouterLink, InputText, MessagesShowcaseComponent, Password, Dialog, AuthResetPasswordComponent],
  providers: []
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly localizationService = inject(LocalizationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly textService = inject(TextService);

  isSubmitting = signal<boolean>(false);
  messages = signal<Messages>({});
  showResetDialog = signal<boolean>(false);

  loginForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]]
  });

  getErrorMessage(field: string): string | null {
    const control = this.loginForm.get(field);

    if (!control || !control.touched || !control.invalid) {
      return "";
    }

    if (control.errors?.["required"]) {
      return `${this.textService.capitalize(field)} is required.`;
    }

    if (control.errors?.["email"]) {
      return "Please enter a valid email address.";
    }

    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }

    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);

    const request: LoginRequest = {
      email: this.loginForm.value.email ?? "",
      password: this.loginForm.value.password ?? ""
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        this.loginForm.reset();
        this.messages.set({ success: ["Logged in successfully"] });

        this.messageService.add({
          key: "root",
          summary: "Logged In",
          detail: "You have logged in successfully",
          severity: "success"
        });

        this.authService.acceptAuthResponse(response);
        this.router.navigate(["/"]);
        this.isSubmitting.set(false);
      },
      error: (response: ErrorResponse) => {
        this.localizationService.resolveHttpErrorResponseTo(response, this.messages);
        this.isSubmitting.set(false);
      }
    });
  }
}
