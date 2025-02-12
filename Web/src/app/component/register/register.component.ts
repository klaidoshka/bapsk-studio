import {Component, inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {DatePicker} from "primeng/datepicker";
import {DropdownModule} from "primeng/dropdown";
import {InputText} from "primeng/inputtext";
import {IsoCountries, IsoCountry, RegisterRequest} from "../../model/auth.model";
import ErrorResponse from "../../model/error-response.model";
import {AuthService} from "../../service/auth.service";
import {TextService} from "../../service/text.service";

@Component({
  selector: "app-register",
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
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private textService = inject(TextService);

  filteredCountries: IsoCountry[] = [];
  isSubmitting = false;
  maxDate: Date = this.getDateMinusYears(13);
  messages: string[] = [];
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      birthDate: [this.maxDate, Validators.required],
      country: [IsoCountries[129], Validators.required],
      email: ["", [Validators.required, Validators.email]],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(8)]]
    });
  }

  private getDateMinusYears(years: number): Date {
    const date = new Date();

    date.setFullYear(date.getFullYear() - years);

    return date;
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
    if (this.isSubmitting) return;
    if (this.messages.length > 0) this.messages = [];

    if (this.registerForm.invalid) {
      this.messages = ["Please fill out all required fields correctly."];
      return;
    }

    this.isSubmitting = true;

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
        this.isSubmitting = false;
      },
      error: (response: ErrorResponse) => {
        this.messages = response.error?.messages || [
          "Failed to register, please try again later..."
        ];
        this.isSubmitting = false;
      }
    });
  }
}
