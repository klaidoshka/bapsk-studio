import {Component, inject, input, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {FormInputErrorComponent} from '../../component/form-input-error/form-input-error.component';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {MessageHandlingService} from '../../service/message-handling.service';
import {UserService} from '../../service/user.service';
import {getDefaultIsoCountry, getIsoCountryByCode, IsoCountries} from '../../model/iso-country.model';
import Messages from '../../model/messages.model';
import {User, UserCreateRequest, UserEditRequest} from '../../model/user.model';
import {first, of, tap} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {NumberUtil} from '../../util/number.util';
import {CardComponent} from '../../component/card/card.component';
import {UserPageHeaderSectionComponent} from '../../component/user-page-header-section/user-page-header-section.component';
import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'user-management-page',
  imports: [
    Button,
    FormInputErrorComponent,
    FormsModule,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    CardComponent,
    UserPageHeaderSectionComponent,
    FloatLabel,
    IconField,
    InputIcon,
    Select,
    DatePicker,
    FailedToLoadPleaseReloadComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './user-management-page.component.html',
  styles: ``
})
export class UserManagementPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  protected readonly countries = IsoCountries;
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
        .pipe(tap(user => this.patchFormValues(user)))
      : of(undefined)
  });

  private consumeResult(message: string, id?: string | number, success: boolean = true) {
    if (success) {
      this.messageService.add({
        key: 'root',
        detail: message,
        severity: 'success',
        closable: true
      });
      if (this.userId()) {
        this.router.navigate(['../'], {relativeTo: this.route});
      } else {
        this.router.navigate(['../', id], {relativeTo: this.route});
      }
    } else {
      this.messages.set({error: [message]});
    }
  }

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

  private create(request: UserCreateRequest) {
    this.userService
      .create(request)
      .pipe(first())
      .subscribe({
        next: (value) => this.consumeResult("User has been created successfully.", value.id),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }

  private edit(request: UserEditRequest) {
    this.userService
      .edit(request)
      .pipe(first())
      .subscribe({
        next: () => this.consumeResult("User has been edited successfully."),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
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
