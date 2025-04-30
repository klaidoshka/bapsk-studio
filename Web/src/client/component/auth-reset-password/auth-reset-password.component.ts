import {Component, inject, signal} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import Messages from '../../model/messages.model';
import {AuthService} from '../../service/auth.service';
import {first} from 'rxjs';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';

@Component({
  selector: 'auth-reset-password',
  imports: [
    InputText,
    Button,
    ReactiveFormsModule,
    MessagesShowcaseComponent,
    FormInputErrorComponent
  ],
  templateUrl: './auth-reset-password.component.html',
  styles: ``
})
export class AuthResetPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  protected readonly messages = signal<Messages>({});

  protected readonly form = this.formBuilder.group({
    email: ['', [Validators.email]],
  });

  protected resetPassword() {
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
        error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
      });
  }
}
