import {Component, inject, input, signal} from '@angular/core';
import {User} from '../../model/user.model';
import {Button} from 'primeng/button';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';
import {AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Password} from 'primeng/password';
import {AuthService} from '../../service/auth.service';
import {first} from 'rxjs';
import Messages from '../../model/messages.model';
import {MessageHandlingService} from '../../service/message-handling.service';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {CardComponent} from '../card/card.component';
import {FloatLabel} from 'primeng/floatlabel';

@Component({
  selector: 'profile-change-password-form',
  imports: [
    Button,
    FormInputErrorComponent,
    FormsModule,
    Password,
    ReactiveFormsModule,
    MessagesShowcaseComponent,
    CardComponent,
    FloatLabel
  ],
  templateUrl: './profile-change-password-form.component.html',
  styles: ``
})
export class ProfileChangePasswordFormComponent {
  private readonly authService = inject(AuthService);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly messages = signal<Messages>({});
  readonly user = input.required<User>();

  protected readonly form = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [(control: AbstractControl) => {
      if (this.form?.value?.password !== control.value) {
        return {'mismatchPassword': true};
      }

      return undefined;
    }]],
    currentPassword: ['', [Validators.required]]
  });

  protected readonly customErrorMessages = {
    'mismatchPassword': () => "Passwords do not match."
  }

  protected changePassword() {
    if (this.form.invalid) {
      this.messages.set({error: ["Please fill in all fields."]});
      return;
    }

    this.authService
      .changePassword({
        currentPassword: this.form.value.currentPassword!,
        password: this.form.value.password!
      })
      .pipe(first())
      .subscribe({
        next: () => {
          this.form.reset();
          this.messages.set({success: ["Password changed successfully."]});
        },
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      })
  }
}
