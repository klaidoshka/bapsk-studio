import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import Messages from '../../model/messages.model';
import {LocalizationService} from '../../service/localization.service';
import {first, map} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {Password} from 'primeng/password';
import {Button} from 'primeng/button';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'reset-password-page',
  imports: [
    ReactiveFormsModule,
    MessagesShowcaseComponent,
    Password,
    Button,
    ProgressSpinner,
    RouterLink
  ],
  templateUrl: './reset-password-page.component.html',
  styles: ``
})
export class ResetPasswordPageComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly localizationService = inject(LocalizationService);
  private readonly route = inject(ActivatedRoute);

  messages = signal<Messages>({});

  isTokenProvided = rxResource({
    loader: () => this.route.queryParams.pipe(map(params => !!params['token']))
  });

  form = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [this.validatePasswordConfirmed()]]
  });

  private validatePasswordConfirmed(): ValidatorFn {
    return (control): ValidationErrors | null => {
      if (this.form?.value?.password !== control.value) {
        return { passwordConfirmed: true };
      }

      return null;
    }
  }

  getErrorMessage(field: string): string | null {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) {
      return "";
    }

    if (control.errors?.["required"]) {
      return `Field is required.`;
    }

    if (control.errors?.["minlength"]) {
      return "Password must be at least 8 characters long.";
    }

    if (control.errors?.["passwordConfirmed"]) {
      return "Passwords do not match.";
    }

    return null;
  }

  changePassword() {
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
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      })
  }
}
