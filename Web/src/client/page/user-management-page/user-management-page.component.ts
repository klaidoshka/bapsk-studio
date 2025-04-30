import {Component, inject, input, signal} from '@angular/core';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {FormInputErrorComponent} from '../../component/form-input-error/form-input-error.component';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {UserService} from '../../service/user.service';
import {
  getDefaultIsoCountry,
  getIsoCountryByCode,
  IsoCountries,
  IsoCountry
} from '../../model/iso-country.model';
import Messages from '../../model/messages.model';
import {User, UserCreateRequest, UserEditRequest} from '../../model/user.model';
import {first, of, tap} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {NumberUtil} from '../../util/number.util';

@Component({
  selector: 'user-management-page',
  imports: [
    AutoComplete,
    Button,
    DatePicker,
    FormInputErrorComponent,
    FormsModule,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule
  ],
  templateUrl: './user-management-page.component.html',
  styles: ``
})
export class UserManagementPageComponent {
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);

  protected readonly filteredCountries = signal<IsoCountry[]>([]);
  protected readonly form = this.createForm();
  protected readonly messages = signal<Messages>({});
  protected readonly userId = input<string>();

  protected readonly user = rxResource({
    request: () => ({
      userId: NumberUtil.parse(this.userId())
    }),
    loader: ({request}) => request.userId
      ? this.userService
        .getById(request.userId)
        .pipe(
          first(),
          tap(user => this.patchFormValues(user))
        )
      : of(undefined)
  });

  private createForm() {
    return this.formBuilder.group({
      birthDate: [new Date(), Validators.required],
      country: [getDefaultIsoCountry(), Validators.required],
      email: ["", [Validators.required, Validators.email]],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      // Disable password control if existing user
      password: ["", [Validators.required, Validators.minLength(8)]]
    });
  }

  private onSuccess(message: string) {
    this.messages.set({success: [message]});
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  private create(request: UserCreateRequest) {
    this.userService
      .create(request)
      .pipe(first())
      .subscribe({
        next: () => this.onSuccess("User has been created successfully."),
        error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
      });
  }

  private edit(request: UserEditRequest) {
    this.userService
      .edit(request)
      .pipe(first())
      .subscribe({
        next: () => this.onSuccess("User has been edited successfully."),
        error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
      });
  }

  private patchFormValues(user: User) {
    this.form.reset();
    this.form.patchValue({
      ...user,
      country: getIsoCountryByCode(user.country)
    });
    this.form.controls.password.disable();
  }

  protected filterCountries(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredCountries.set(IsoCountries.filter((country) =>
      country.name.toLowerCase().startsWith(query)
    ));
  }

  protected save() {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    const request: UserEditRequest = {
      birthDate: this.form.value.birthDate!,
      country: this.form.value.country!.code,
      email: this.form.value.email!,
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      userId: this.user.value()?.id ?? 0
    }

    if (this.user.value()) {
      this.edit(request);
    } else {
      this.create({
        ...request,
        password: this.form.value.password!
      });
    }
  }
}
