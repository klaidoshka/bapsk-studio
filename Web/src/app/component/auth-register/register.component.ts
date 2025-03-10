import {Component, signal} from "@angular/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {IsoCountries, IsoCountry} from '../../model/iso-country.model';

@Component({
  selector: "app-auth-register",
  templateUrl: "./register.component.html",
  imports: [
    AutoCompleteModule,
    RouterLink,
    DropdownModule,
    ButtonModule,
    InputText,
    DatePicker,
    ReactiveFormsModule
  ]
})
export class RegisterComponent {
  filteredCountries: IsoCountry[] = [];
  isSubmitting = signal<boolean>(false);
  maxDate = new Date();
  messages = signal<string[]>([]);
  registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private textService: TextService
  ) {
    this.registerForm = this.formBuilder.group({
      birthDate: [this.maxDate, Validators.required],
      country: [IsoCountries[129], Validators.required],
      email: ["", [Validators.required, Validators.email]],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(8)]]
    });
  }

  getErrorMessage(field: string): string | null {
    const control = this.registerForm.get(field);

    if (!control || !control.touched || !control.invalid) return "";
    if (control.errors?.["required"])
      return `${this.textService.capitalize(field)} is required.`;
    if (control.errors?.["email"]) return "Please enter a valid email address.";
    if (control.errors?.["minlength"])
      return "Password must be at least 8 characters long.";

    return null;
  }

  filterCountries(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();

    this.filteredCountries = IsoCountries.filter((country) =>
      country.name.toLowerCase().startsWith(query)
    );
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting()) return;
    if (this.messages.length > 0) this.messages.set([]);

    if (this.registerForm.invalid) {
      this.messages.set(["Please fill out all required fields correctly."]);
      return;
    }

    this.isSubmitting.set(true);

    const request: RegisterRequest = {
      birthDate: this.registerForm.value.birthDate,
      country: this.registerForm.value.country.code,
      email: this.registerForm.value.email,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      password: this.registerForm.value.password
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        if (response) {
          this.authService.acceptAuthResponse(response);
          this.router.navigate(["/"]);
        }
        this.isSubmitting.set(false);
      },
      error: (response: ErrorResponse) => {
        this.messages.set(response.error?.messages || ["Failed to register, please try again later."]);
        this.isSubmitting.set(false);
      }
    });
  }
}
