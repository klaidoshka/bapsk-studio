import {Component, inject, signal} from "@angular/core";
import {FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {DatePicker} from "primeng/datepicker";
import {DropdownModule} from "primeng/dropdown";
import {InputText} from "primeng/inputtext";
import {RegisterRequest} from "../../model/auth.model";
import ErrorResponse from "../../model/error-response.model";
import {AuthService} from "../../service/auth.service";
import {getDefaultIsoCountry, IsoCountries, IsoCountry} from '../../model/iso-country.model';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import Messages from '../../model/messages.model';
import {MessageHandlingService} from '../../service/message-handling.service';
import {Password} from 'primeng/password';
import {MessageService} from 'primeng/api';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';
import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {Select} from 'primeng/select';

@Component({
  selector: "auth-register",
  templateUrl: "./register.component.html",
  imports: [
    AutoCompleteModule,
    RouterLink,
    DropdownModule,
    ButtonModule,
    InputText,
    DatePicker,
    ReactiveFormsModule,
    MessagesShowcaseComponent,
    Password,
    FormInputErrorComponent,
    FloatLabel,
    IconField,
    InputIcon,
    Select
  ]
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  protected readonly filteredCountries = signal<IsoCountry[]>([]);
  protected readonly isSubmitting = signal<boolean>(false);
  protected readonly messages = signal<Messages>({});

  protected readonly form = this.formBuilder.group({
    birthDate: [new Date(), Validators.required],
    country: [getDefaultIsoCountry(), Validators.required],
    email: ["", [Validators.required, Validators.email]],
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    password: ["", [Validators.required, Validators.minLength(8)]],
    confirmPassword: ["", [this.validatePasswordConfirmed()]]
  });

  protected readonly customErrorsMessages = {
    passwordConfirmed: () => "Passwords do not match"
  };

  private validatePasswordConfirmed(): ValidatorFn {
    return (control): ValidationErrors | null => {
      const confirmPassword = control.value;
      const password = this.form?.get("password")?.value;

      if (password !== confirmPassword) {
        return {passwordConfirmed: true};
      }

      return null;
    }
  }

  protected filterCountries(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredCountries.set(IsoCountries.filter((country) =>
      country.name.toLowerCase().startsWith(query)
    ));
  }

  protected async onSubmit(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }

    if (this.form.invalid) {
      this.messages.set({error: ["Please fill out all required fields correctly."]});
      return;
    }

    this.isSubmitting.set(true);

    const request: RegisterRequest = {
      birthDate: this.form.value.birthDate!,
      country: this.form.value.country!.code,
      email: this.form.value.email!,
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      password: this.form.value.password!
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        this.form.reset();
        this.messages.set({success: ["Registration successful!"]});

        this.messageService.add({
          key: "root",
          summary: "Logged In",
          detail: "You have successfully registered",
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

  protected readonly IsoCountries = IsoCountries;
}
