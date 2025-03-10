import {Component, input, OnInit, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import Messages from '../../model/messages-model';
import {TextService} from '../../service/text.service';
import {first} from 'rxjs';
import {User, UserCreateRequest, UserEditRequest} from '../../model/user.model';
import {UserService} from '../../service/user.service';
import {IsoCountries, IsoCountry} from '../../model/iso-country.model';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {DatePicker} from 'primeng/datepicker';
import {ErrorResolverService} from '../../service/error-resolver.service';

@Component({
  selector: 'app-user-management',
  imports: [
    Button,
    Dialog,
    FormsModule,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    AutoComplete,
    DatePicker
  ],
  templateUrl: './user-management.component.html',
  styles: ``
})
export class UserManagementComponent implements OnInit {
  filteredCountries: IsoCountry[] = [];
  form!: FormGroup;
  isFormSet = signal<boolean>(false);
  isShownInitially = input<boolean>(false);
  isShown = signal<boolean>(false);
  maxDate = new Date();
  messages = signal<Messages>({});
  user = signal<User | null>(null);

  constructor(
    private errorResolverService: ErrorResolverService,
    private formBuilder: FormBuilder,
    private textService: TextService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  private createForm(user: User | null): FormGroup {
    return this.formBuilder.group({
      birthDate: [this.maxDate, Validators.required],
      country: [IsoCountries[129], Validators.required],
      email: ["", [Validators.required, Validators.email]],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      password: ["", user ? [] : [Validators.required, Validators.minLength(8)]]
    });
  }

  private onSuccess(message: string) {
    this.messages.set({success: [message]});
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  private create(request: UserCreateRequest) {
    this.userService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("User has been created successfully."),
      error: (response) => this.errorResolverService.resolveHttpResponseTo(response, this.messages)
    });
  }

  private edit(request: UserEditRequest) {
    this.userService.edit(request).pipe(first()).subscribe({
      next: () => this.onSuccess("User has been edited successfully."),
      error: (response) => this.errorResolverService.resolveHttpResponseTo(response, this.messages)
    });
  }

  filterCountries(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();

    this.filteredCountries = IsoCountries.filter((country) =>
      country.name.toLowerCase().startsWith(query)
    );
  }

  getErrorMessage(field: string): string | null {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) return "";
    if (control.errors?.["required"])
      return `${this.textService.capitalize(field)} is required.`;
    if (control.errors?.["email"]) return "Please enter a valid email address.";
    if (control.errors?.["minlength"])
      return "Password must be at least 8 characters long.";

    return null;
  }

  hide() {
    this.messages.set({});
    this.isShown.set(false);
    this.isFormSet.set(false);
    this.form.reset();
  }

  save() {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    if (this.user() != null) {
      this.edit({
        birthDate: this.form.value.birthDate,
        country: this.form.value.country.code,
        email: this.form.value.email,
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        userId: this.user()!.id
      });
    } else {
      this.create({
        birthDate: this.form.value.birthDate,
        country: this.form.value.country.code,
        email: this.form.value.email,
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        password: this.form.value.password
      });
    }
  }

  show(user: User | null) {
    if (user) {
      this.form = this.createForm(user);
      this.form.patchValue({...user});
    } else {
      this.form = this.createForm(null);
    }

    this.user.set(user);
    this.isFormSet.set(true);
    this.isShown.set(true);
  }
}
