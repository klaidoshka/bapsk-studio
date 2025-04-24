import {Component, inject, signal} from '@angular/core';
import Instance, {InstanceCreateRequest, InstanceEditRequest, InstanceWithUsers} from '../../model/instance.model';
import {Dialog} from 'primeng/dialog';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import Messages from '../../model/messages.model';
import {InstanceService} from '../../service/instance.service';
import {first} from 'rxjs';
import {Button} from 'primeng/button';
import {Textarea} from 'primeng/textarea';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {UserService} from '../../service/user.service';
import {toUserIdentityFullName, UserIdentity} from '../../model/user.model';
import {AuthService} from '../../service/auth.service';
import {TableModule} from 'primeng/table';
import {FormInputErrorComponent} from "../form-input-error/form-input-error.component";
import {instanceUserPermissions} from '../../constant/instance-user.permissions';
import {NgForOf, NgIf} from '@angular/common';
import {Badge} from 'primeng/badge';

@Component({
  selector: 'instance-management',
  imports: [
    Dialog,
    FormsModule,
    Button,
    Textarea,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    TableModule,
    FormInputErrorComponent,
    Badge,
    NgForOf,
    NgIf
  ],
  templateUrl: './instance-management.component.html',
  styles: ``
})
export class InstanceManagementComponent {
  private readonly allPermissions = instanceUserPermissions;
  private readonly authService = inject(AuthService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly instanceService = inject(InstanceService);
  private readonly userService = inject(UserService);

  form = this.formBuilder.group({
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

  formUser = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email, this.validateEmailExists(this.form.controls.users)]]
  });

  instance = signal<Instance | undefined>(undefined);
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});
  messagesUsers = signal<Messages>({});

  customErrorMessages = {
    'emailExists': () => 'User with this email already exists in the list.'
  };

  constructor() {
    // Remove initial invalid user
    this.form.controls.users.clear();
  }

  private addUserInForm(user: UserIdentity, email: string, permissions?: string[]) {
    const isOwnerOrSelf = this.instance()?.createdById === user.id || this.authService.getUser()()!.id === user.id;

    const permissionsToAdd = isOwnerOrSelf ? [] : this.allPermissions.map(p => ({
      ...p,
      toggled: true as boolean
    }));

    if (permissions) {
      permissionsToAdd.forEach(p => {
        p.toggled = permissions.includes(p.value);
      });
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
    this.messages.set({ success: [message] });
    this.form.markAsPristine();
  }

  private validateEmailExists(formArray: FormArray): ValidatorFn {
    return (control): ValidationErrors | null => {
      const email = control.value?.trim()?.toLowerCase();

      if (!email) {
        return null;
      }

      if (formArray.controls.some(um => um.value.email.trim().toLowerCase() === email)) {
        return { emailExists: true };
      }

      return null;
    };
  }

  addUser(email?: string) {
    if (!email) {
      email = this.formUser.value.email?.trim();
    }

    this.formUser.reset();

    this.userService.getIdentityByEmail(email!).pipe(first()).subscribe(user => {
      if (!user) {
        this.messagesUsers.set({ error: [`User with email '${email}' does not exist.`] });
        return;
      } else if (this.messagesUsers().error) {
        this.messagesUsers.set({});
      }

      this.addUserInForm(user, email!);
    });
  }

  hide() {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
    this.formUser.reset();
    this.form.controls.users.clear();
  }

  removeUser(index: number) {
    this.form.controls.users.removeAt(index);

    this.form.markAsDirty();
  }

  save() {
    if (!this.form.valid) {
      this.messages.set({ error: ["Please fill out the form."] });
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

    if (this.instance() != null) {
      this.edit({
        ...request,
        instanceId: this.instance()!.id!
      });
    } else {
      this.create(request);
    }
  }

  show(instance?: InstanceWithUsers) {
    this.instance.set(instance);
    this.form.reset({ description: "No description set." });

    if (instance) {
      this.form.patchValue({ ...instance as any });
      instance.users.forEach(um => this.addUserInForm(um.user, um.user.email, um.permissions));
    } else {
      this.addUser(this.authService.getUser()()!.email);
    }

    this.isShown.set(true);
  }

  togglePermission(userIndex: number, permissionIndex: number) {
    const permissionsControl = this.form.controls.users.at(userIndex).controls.permissions;
    const permission = permissionsControl.value![permissionIndex];

    if (permission) {
      permission.toggled = !permission.toggled;
      permissionsControl.markAsDirty();
    }
  }
}
