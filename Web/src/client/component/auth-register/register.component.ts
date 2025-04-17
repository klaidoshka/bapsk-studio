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
import {TextService} from "../../service/text.service";
import {getDefaultIsoCountry, IsoCountries, IsoCountry} from '../../model/iso-country.model';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import Messages from '../../model/messages.model';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {Password} from 'primeng/password';
import {MessageService} from 'primeng/api';

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
    Password
  ]
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly textService = inject(TextService);

  filteredCountries: IsoCountry[] = [];
  isSubmitting = signal<boolean>(false);
  messages = signal<Messages>({});

  registerForm = this.formBuilder.group({
    birthDate: [new Date(), Validators.required],
    country: [getDefaultIsoCountry(), Validators.required],
    email: ["", [Validators.required, Validators.email]],
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    password: ["", [Validators.required, Validators.minLength(8)]],
    confirmPassword: ["", [this.validatePasswordConfirmed()]]
  });

  private validatePasswordConfirmed(): ValidatorFn {
    return (control): ValidationErrors | null => {
      const confirmPassword = control.value;
      const password = this.registerForm?.get("password")?.value;

      if (password !== confirmPassword) {
        return { passwordConfirmed: true };
      }

      return null;
    }
  }

  getErrorMessage(field: string): string | null {
    const control = this.registerForm.get(field);

    if (!control || !control.touched || !control.invalid) {
      return "";
    }

    if (control.errors?.["required"]) {
      return `${this.textService.capitalize(field)} is required.`;
    }

    if (control.errors?.["email"]) {
      return "Please enter a valid email address.";
    }

    if (control.errors?.["minlength"]) {
      return "Password must be at least 8 characters long.";
    }

    if (control.errors?.["passwordConfirmed"]) {
      return "Passwords do not match.";
    }

    return null;
  }

  filterCountries(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();

    this.filteredCountries = IsoCountries.filter((country) =>
      country.name.toLowerCase().startsWith(query)
    );
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }

    if (this.registerForm.invalid) {
      this.messages.set({ error: ["Please fill out all required fields correctly."] });
      return;
    }

    this.isSubmitting.set(true);

    const request: RegisterRequest = {
      birthDate: this.registerForm.value.birthDate!,
      country: this.registerForm.value.country!.code,
      email: this.registerForm.value.email!,
      firstName: this.registerForm.value.firstName!,
      lastName: this.registerForm.value.lastName!,
      password: this.registerForm.value.password!
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        this.registerForm.reset();
        this.messages.set({ success: ["Registration successful!"] });

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
        this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages);
        this.isSubmitting.set(false);
      }
    });
  }
}
