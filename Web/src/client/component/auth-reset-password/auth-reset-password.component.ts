import {Component, inject, signal} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {LocalizationService} from '../../service/localization.service';
import Messages from '../../model/messages.model';
import {AuthService} from '../../service/auth.service';
import {first} from 'rxjs';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';

@Component({
  selector: 'auth-reset-password',
  imports: [
    InputText,
    Button,
    ReactiveFormsModule,
    MessagesShowcaseComponent
  ],
  templateUrl: './auth-reset-password.component.html',
  styles: ``
})
export class AuthResetPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly localizationService = inject(LocalizationService);

  messages = signal<Messages>({});

  form = this.formBuilder.group({
    email: ['', [Validators.email]],
  });

  getErrorMessage(): string | undefined {
    const control = this.form.controls.email;

    if (!control || !control.touched || !control.invalid) {
      return "";
    }

    if (control.errors?.["required"]) {
      return `Field is required.`;
    }

    if (control.errors?.["email"]) {
      return "Please enter a valid email address.";
    }

    return undefined;
  }

  resetPassword() {
    if (this.form.invalid) {
      this.messages.set({ error: ["Please fill in a valid email address."] });
      return;
    }

    this.authService
      .resetPassword(this.form.value.email!)
      .pipe(first())
      .subscribe({
        next: () => {
          this.form.reset();

          this.messages.set({
            success: [
              "Request has been sent! Please check your email, request will be valid for 10 minutes."
            ]
          });
        },
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
  }
}
