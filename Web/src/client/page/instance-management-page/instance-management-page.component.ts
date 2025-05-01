import {Component, inject, input, signal} from '@angular/core';
import {Badge} from "primeng/badge";
import {Button} from "primeng/button";
import {FormInputErrorComponent} from "../../component/form-input-error/form-input-error.component";
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {
  MessagesShowcaseComponent
} from "../../component/messages-showcase/messages-showcase.component";
import {NgForOf, NgIf} from "@angular/common";
import {TableModule} from "primeng/table";
import {Textarea} from "primeng/textarea";
import {instanceUserPermissions} from '../../constant/instance-user.permissions';
import {AuthService} from '../../service/auth.service';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {UserService} from '../../service/user.service';
import {
  InstanceCreateRequest,
  InstanceEditRequest,
  InstanceWithUsers
} from '../../model/instance.model';
import Messages from '../../model/messages.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {toUserIdentityFullName, UserIdentity} from '../../model/user.model';
import {first, of, tap} from 'rxjs';
import {NumberUtil} from '../../util/number.util';
import {InstanceService} from '../../service/instance.service';

@Component({
  selector: 'instance-management-page',
  imports: [
    Badge,
    Button,
    FormInputErrorComponent,
    FormsModule,
    InputText,
    MessagesShowcaseComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TableModule,
    Textarea
  ],
  templateUrl: './instance-management-page.component.html',
  styles: ``
})
export class InstanceManagementPageComponent {
  private readonly authService = inject(AuthService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly instanceService = inject(InstanceService);
  private readonly userService = inject(UserService);
  private readonly allPermissions = instanceUserPermissions;
  protected readonly instanceId = input<string>();
  protected readonly messages = signal<Messages>({});
  protected readonly messagesUsers = signal<Messages>({});
  protected readonly user = rxResource({loader: () => this.authService.getUser()});

  protected readonly instance = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({request}) => request.instanceId
      ? this.instanceService
        .getWithUsersById(request.instanceId)
        .pipe(
          first(),
          tap(instance => this.patchFormValues(instance))
        )
      : of(undefined)
  });

  protected readonly form = this.formBuilder.group({
    name: ["", Validators.required],
    description: ["No description set."],
    users: this.formBuilder.array([
      this.formBuilder.group({
        email: ["", [Validators.required, Validators.email]],
        id: [undefined as number | undefined],
        isOwnerOrSelf: [false],
        name: [""],
        permissions: [this.allPermissions.map(p => ({
          ...p,
          toggled: true
        }))],
        showPermissions: [false]
      })
    ])
  });

  protected readonly formUser = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email, this.validateEmailExists(this.form.controls.users)]]
  });

  protected readonly customErrorMessages = {
    'emailExists': () => 'User with this email already exists in the list.'
  };

  private addUserInForm(user: UserIdentity, email: string, permissions?: string[]) {
    const isOwnerOrSelf = this.instance.value()?.createdById === user.id || this.user.value()!.id === user.id;

    const permissionsToAdd = isOwnerOrSelf ? [] : this.allPermissions.map(p => ({
      ...p,
      toggled: true as boolean
    }));

    if (permissions) {
      permissionsToAdd.forEach(p => p.toggled = permissions.includes(p.value));
    }

    this.form.controls.users.push(this.formBuilder.group({
      email: [email, [Validators.required, Validators.email]],
      id: [user?.id || undefined],
      isOwnerOrSelf: [isOwnerOrSelf],
      name: [toUserIdentityFullName(user!)],
      permissions: [permissionsToAdd],
      showPermissions: [false as boolean]
    }));

    this.form.markAsDirty();
  }

  private create(request: InstanceCreateRequest) {
    this.instanceService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Instance has been created successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private edit(request: InstanceEditRequest) {
    this.instanceService.edit(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Instance has been edited successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private onSuccess(message: string) {
    this.messages.set({success: [message]});
    this.form.markAsPristine();
  }

  private patchFormValues(instance: InstanceWithUsers) {
    this.form.reset();

    this.form.patchValue({
      name: instance.name,
      description: instance.description
    });

    this.form.controls.users.clear();

    instance.users.forEach(user => {
      this.addUserInForm(user.user, user.user.email, user.permissions);
    });

    this.form.markAsPristine();
  }

  private validateEmailExists(formArray: FormArray): ValidatorFn {
    return (control): ValidationErrors | null => {
      const email = control.value?.trim()?.toLowerCase();

      if (!email) {
        return null;
      }

      if (formArray.controls.some(um => um.value.email.trim().toLowerCase() === email)) {
        return {emailExists: true};
      }

      return null;
    };
  }

  protected addUser(email?: string) {
    if (!email) {
      email = this.formUser.value.email?.trim();
    }

    this.formUser.reset();

    this.userService.getIdentityByEmail(email!).pipe(first()).subscribe(user => {
      if (!user) {
        this.messagesUsers.set({error: [`User with email '${email}' does not exist.`]});
        return;
      } else if (this.messagesUsers().error) {
        this.messagesUsers.set({});
      }

      this.addUserInForm(user, email!);
    });
  }

  protected removeUser(index: number) {
    this.form.controls.users.removeAt(index);
    this.form.markAsDirty();
  }

  protected save() {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    const request: InstanceCreateRequest = {
      name: this.form.value.name!,
      description: this.form.value.description || null,
      users: this.form.value.users?.map(u => ({
        permissions: u.permissions!
          .filter(p => p.toggled)
          .map(p => p.value),
        userId: u.id!
      })) || []
    }

    if (this.instance.value()) {
      this.edit({
        ...request,
        instanceId: this.instance.value()!.id!
      });
    } else {
      this.create(request);
    }
  }

  protected togglePermission(userIndex: number, permissionIndex: number) {
    const permissionsControl = this.form.controls.users.at(userIndex).controls.permissions;
    const permission = permissionsControl.value![permissionIndex];

    if (permission) {
      permission.toggled = !permission.toggled;
      permissionsControl.markAsDirty();
    }
  }
}
