import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import Messages from '../../model/messages.model';
import {MessageHandlingService} from '../../service/message-handling.service';
import {first, map} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {Password} from 'primeng/password';
import {Button} from 'primeng/button';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {FormInputErrorComponent} from '../../component/form-input-error/form-input-error.component';
import {MessageService} from 'primeng/api';
import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';

@Component({
  selector: 'reset-password-page',
  imports: [
    ReactiveFormsModule,
    MessagesShowcaseComponent,
    Password,
    Button,
    LoadingSpinnerComponent,
    RouterLink,
    FormInputErrorComponent,
    FloatLabel,
    IconField,
    InputIcon
  ],
  templateUrl: './reset-password-page.component.html',
  providers: [MessageService]
})
export class ResetPasswordPageComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly route = inject(ActivatedRoute);
  protected readonly messages = signal<Messages>({});

  protected readonly isTokenProvided = rxResource({
    loader: () => this.route.queryParams.pipe(map(params => !!params['token']))
  });

  protected readonly form = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [this.validatePasswordConfirmed()]]
  });

  protected readonly customErrorMessages = {
    'mismatchPassword': () => "Passwords do not match."
  }

  private validatePasswordConfirmed(): ValidatorFn {
    return (control): ValidationErrors | null => {
      if (this.form?.value?.password !== control.value) {
        return { mismatchPassword: true };
      }

      return null;
    }
  }

  protected changePassword() {
    if (this.form.invalid) {
      this.messages.set({ error: ["Please fill in all fields."] });
      return;
    }

    this.authService
      .changePassword({
        password: this.form.value.password!,
        resetPasswordToken: this.route.snapshot.queryParams['token']
      })
      .pipe(first())
      .subscribe({
        next: () => {
          this.form.reset();
          this.messages.set({ success: ["Password changed successfully."] });
        },
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }
}
