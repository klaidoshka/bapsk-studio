import {Component, inject, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import Messages from '../../model/messages.model';
import {first} from 'rxjs';
import {User, UserCreateRequest, UserEditRequest} from '../../model/user.model';
import {UserService} from '../../service/user.service';
import {getDefaultIsoCountry, getIsoCountryByCode, IsoCountries, IsoCountry} from '../../model/iso-country.model';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {DatePicker} from 'primeng/datepicker';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';

@Component({
  selector: 'user-management',
  imports: [
    Button,
    Dialog,
    FormsModule,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    AutoComplete,
    DatePicker,
    FormInputErrorComponent
  ],
  templateUrl: './user-management.component.html',
  styles: ``
})
export class UserManagementComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly userService = inject(UserService);

  filteredCountries: IsoCountry[] = [];
  form = this.createForm(null);
  isFormSet = signal<boolean>(false);
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});
  user = signal<User | undefined>(undefined);

  private createForm(user: User | null) {
    return this.formBuilder.group({
      birthDate: [new Date(), Validators.required],
      country: [getDefaultIsoCountry(), Validators.required],
      email: ["", [Validators.required, Validators.email]],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      password: ["", user ? [] : [Validators.required, Validators.minLength(8)]]
    });
  }

  private onSuccess(message: string) {
    this.messages.set({ success: [message] });
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  private create(request: UserCreateRequest) {
    this.userService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("User has been created successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private edit(request: UserEditRequest) {
    this.userService.edit(request).pipe(first()).subscribe({
      next: () => this.onSuccess("User has been edited successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  filterCountries(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();

    this.filteredCountries = IsoCountries.filter((country) =>
      country.name.toLowerCase().startsWith(query)
    );
  }

  hide() {
    this.messages.set({});
    this.isShown.set(false);
    this.isFormSet.set(false);
    this.form.reset();
  }

  save() {
    if (!this.form.valid) {
      this.messages.set({ error: ["Please fill out the form."] });
      return;
    }

    const request: UserEditRequest = {
      birthDate: this.form.value.birthDate!,
      country: this.form.value.country!.code,
      email: this.form.value.email!,
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      userId: this.user()!.id
    }

    if (this.user() != null) {
      this.edit(request);
    } else {
      this.create({
        ...request,
        password: this.form.value.password!
      });
    }
  }

  show(user?: User) {
    if (user) {
      this.form = this.createForm(user);
      this.form.patchValue({
        ...user,
        country: getIsoCountryByCode(user.country)
      });
    } else {
      this.form = this.createForm(null);
    }

    this.user.set(user);
    this.isFormSet.set(true);
    this.isShown.set(true);
  }
}
