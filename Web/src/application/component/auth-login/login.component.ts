import {Component, inject, signal} from "@angular/core";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Button} from "primeng/button";
import {LoginRequest} from "../../model/auth.model";
import ErrorResponse from "../../model/error-response.model";
import {AuthService} from "../../service/auth.service";
import {InputText} from "primeng/inputtext";
import Messages from "../../model/messages.model";
import {MessageHandlingService} from '../../service/message-handling.service';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {Password} from 'primeng/password';
import {MessageService} from 'primeng/api';
import {Dialog} from 'primeng/dialog';
import {AuthResetPasswordComponent} from '../auth-reset-password/auth-reset-password.component';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';
import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: "auth-login",
  templateUrl: "./login.component.html",
  imports: [Button, ReactiveFormsModule, FormsModule, RouterLink, InputText, MessagesShowcaseComponent, Password, Dialog, AuthResetPasswordComponent, FormInputErrorComponent, FloatLabel, IconField, InputIcon, TranslateModule],
  providers: []
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  protected readonly isSubmitting = signal<boolean>(false);
  protected readonly messages = signal<Messages>({});
  protected readonly showResetDialog = signal<boolean>(false);

  protected readonly form = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]]
  });

  protected async onSubmit(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }

    if (this.form.invalid) {
      return;
    }

    this.isSubmitting.set(true);

    const request: LoginRequest = {
      email: this.form.value.email ?? "",
      password: this.form.value.password ?? ""
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        this.form.reset();
        this.messages.set({ success: ["action.auth.logged-in"] });

        this.messageService.add({
          key: "root",
          summary: this.translateService.instant('action.auth.summary'),
          detail: this.translateService.instant("action.auth.logged-in"),
          severity: "success"
        });

        this.authService.acceptAuthResponse(response);
        this.router.navigate(["/"]);
        this.isSubmitting.set(false);
      },
      error: (response: ErrorResponse) => {
        this.messageHandlingService.consumeHttpErrorResponse(response, this.messages);
        this.isSubmitting.set(false);
      }
    });
  }
}
