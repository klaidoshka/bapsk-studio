import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {UserService} from '../../service/user.service';
import {getDefaultIsoCountry, getIsoCountryByCode, IsoCountries, IsoCountry} from '../../model/iso-country.model';
import Messages from '../../model/messages.model';
import {User} from '../../model/user.model';
import {first} from 'rxjs';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';

@Component({
  selector: 'profile-management',
  imports: [
    AutoComplete,
    Button,
    DatePicker,
    FormsModule,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    FormInputErrorComponent
  ],
  templateUrl: './profile-management.component.html',
  styles: ``
})
export class ProfileManagementComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly userService = inject(UserService);

  messages = signal<Messages>({});
  user = input.required<User>();
  filteredCountries: IsoCountry[] = [];

  form = this.formBuilder.group({
    birthDate: [new Date(), Validators.required],
    country: [getDefaultIsoCountry(), Validators.required],
    email: ["", [Validators.required, Validators.email]],
    firstName: ["", Validators.required],
    lastName: ["", Validators.required]
  });

  ngOnInit() {
    this.reset();
  }

  filterCountries(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();

    this.filteredCountries = IsoCountries.filter((country) =>
      country.name.toLowerCase().startsWith(query)
    );
  }

  reset() {
    this.form.patchValue({
      ...this.user(),
      country: getIsoCountryByCode(this.user().country)
    });
  }

  save() {
    if (!this.form.valid) {
      this.messages.set({ error: ["Please fill out the form."] });
      return;
    }

    this.userService
      .edit({
        birthDate: this.form.value.birthDate!,
        country: this.form.value.country!.code,
        email: this.form.value.email!,
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        userId: this.user()!.id
      })
      .pipe(first())
      .subscribe({
        next: () => {
          this.messages.set({ success: ["Your profile has been saved successfully."] });
          this.form.markAsUntouched();
          this.form.markAsPristine();
        },
        error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
      });
  }
}
