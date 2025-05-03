import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageHandlingService} from '../../service/message-handling.service';
import {UserService} from '../../service/user.service';
import {
  getDefaultIsoCountry,
  getIsoCountryByCode,
  IsoCountries
} from '../../model/iso-country.model';
import Messages from '../../model/messages.model';
import {User} from '../../model/user.model';
import {first} from 'rxjs';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';
import {CardComponent} from '../card/card.component';
import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {Select} from 'primeng/select';

@Component({
  selector: 'profile-management',
  imports: [
    Button,
    DatePicker,
    FormsModule,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    FormInputErrorComponent,
    CardComponent,
    FloatLabel,
    IconField,
    InputIcon,
    Select
  ],
  templateUrl: './profile-management.component.html',
  styles: ``
})
export class ProfileManagementComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly userService = inject(UserService);
  protected readonly messages = signal<Messages>({});
  protected readonly countries = IsoCountries;
  readonly user = input.required<User>();

  protected readonly form = this.formBuilder.group({
    birthDate: [new Date(), Validators.required],
    country: [getDefaultIsoCountry(), Validators.required],
    email: ["", [Validators.required, Validators.email]],
    firstName: ["", Validators.required],
    lastName: ["", Validators.required]
  });

  ngOnInit() {
    this.form.controls.email.disable();
    this.reset();
  }

  protected reset() {
    this.form.patchValue({
      ...this.user(),
      country: getIsoCountryByCode(this.user().country)
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  protected save() {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    this.userService
      .edit({
        birthDate: this.form.value.birthDate!,
        country: this.form.value.country!.code,
        email: this.user().email!,
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        userId: this.user()!.id
      })
      .pipe(first())
      .subscribe({
        next: () => {
          this.messages.set({success: ["Your profile has been saved successfully."]});
          this.form.markAsUntouched();
          this.form.markAsPristine();
        },
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }
}
