import {Component, inject, signal} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageHandlingService} from '../../service/message-handling.service';
import Messages from '../../model/messages.model';
import {AuthService} from '../../service/auth.service';
import {first} from 'rxjs';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';
import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'auth-reset-password',
  imports: [
    InputText,
    Button,
    ReactiveFormsModule,
    MessagesShowcaseComponent,
    FormInputErrorComponent,
    FloatLabel,
    IconField,
    InputIcon,
    TranslatePipe
  ],
  templateUrl: './auth-reset-password.component.html',
  styles: ``
})
export class AuthResetPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageHandlingService = inject(MessageHandlingService);
  protected readonly messages = signal<Messages>({});

  protected readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected resetPassword() {
    if (this.form.invalid) {
      this.messages.set({ error: ["error.fill-all-fields"] });
      return;
    }

    this.authService
      .resetPassword(this.form.value.email!)
      .pipe(first())
      .subscribe({
        next: () => {
          this.form.reset();
          this.messages.set({ success: ["action.auth.reset-password-sent"] });
        },
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }
}
