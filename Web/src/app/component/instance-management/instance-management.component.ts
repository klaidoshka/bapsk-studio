import {Component, signal} from '@angular/core';
import Instance, {InstanceCreateRequest, InstanceEditRequest, InstanceWithUsers} from '../../model/instance.model';
import {Dialog} from 'primeng/dialog';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {TextService} from '../../service/text.service';
import Messages from '../../model/messages.model';
import {InstanceService} from '../../service/instance.service';
import {first} from 'rxjs';
import {Button} from 'primeng/button';
import {Textarea} from 'primeng/textarea';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {LocalizationService} from '../../service/localization.service';
import {UserService} from '../../service/user.service';
import {toUserIdentityFullName} from '../../model/user.model';
import {AuthService} from '../../service/auth.service';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-instance-management',
  imports: [
    Dialog,
    FormsModule,
    Button,
    Textarea,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    TableModule
  ],
  templateUrl: './instance-management.component.html',
  styles: ``
})
export class InstanceManagementComponent {
  protected readonly toUserIdentityFullName = toUserIdentityFullName;
  form!: FormGroup;
  formUser!: FormGroup;
  instance = signal<Instance | undefined>(undefined);
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});
  messagesUserMetas = signal<Messages>({});

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private instanceService: InstanceService,
    private localizationService: LocalizationService,
    private textService: TextService,
    private userService: UserService
  ) {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["No description set."],
      userMetas: this.formBuilder.array([])
    });

    this.formUser = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email, this.validateEmailExists(this.formUsers())]]
    });
  }

  private readonly create = (request: InstanceCreateRequest) => {
    this.instanceService.create(request).pipe(first()).subscribe({
      next: () => this.messages.set({success: ["Instance has been created successfully."]}),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private readonly edit = (request: InstanceEditRequest) => {
    this.instanceService.edit(request).pipe(first()).subscribe({
      next: () => this.messages.set({success: ["Instance has been edited successfully."]}),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private readonly validateEmailExists = (formArray: FormArray): ValidatorFn => {
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

  readonly addUser = (email?: string) => {
    if (!email) {
      email = this.formUser.value.email.trim();
    }

    this.formUser.reset();

    const user = this.userService.getIdentityByEmail(email!);

    if (!user) {
      this.messagesUserMetas.set({error: [`User with email '${email}' does not exist.`]});
      return;
    } else if (this.messagesUserMetas().error) {
      this.messagesUserMetas.set({});
    }

    this.formUsers().push(this.formBuilder.group({
      id: [user?.id],
      email: [email],
      name: [toUserIdentityFullName(user)],
      isOwner: [this.instance()?.createdById === user?.id]
    }));
  }

  readonly formUsers = () => {
    return this.form.controls["userMetas"] as FormArray;
  }

  readonly getErrorMessage = (field: string): string | null => {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) return "";

    if (control.errors?.["required"]) {
      return `${this.textService.capitalize(field)} is required.`;
    }

    return null;
  }

  readonly getUserEmailErrorMessage = (): string | null => {
    const control = this.formUser.get("email");

    if (!control || !control.touched || !control.invalid) return "";

    if (control.errors?.["email"]) {
      return "Invalid email.";
    }

    if (control.errors?.["emailExists"]) {
      return "User is already added.";
    }

    return null;
  }

  readonly hide = () => {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
    this.formUser.reset();
    this.formUsers().clear();
  }

  readonly removeUser = (index: number) => {
    this.formUsers().removeAt(index);
  }

  readonly save = () => {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    if (this.instance() != null) {
      this.edit({
        name: this.form.value.name,
        description: this.form.value.description,
        instanceId: this.instance()!!.id!!,
        userMetas: []
      });
    } else {
      this.create({
        name: this.form.value.name,
        description: this.form.value.description,
        userMetas: []
      });
    }
  }

  readonly show = (instance?: InstanceWithUsers) => {
    this.instance.set(instance);
    this.form.reset({description: "No description set."});

    if (instance) {
      this.form.patchValue({...instance});
      instance.userMetas.forEach(um => this.addUser(um.user.email));
    } else {
      this.addUser(this.authService.getUser()()!.email);
    }

    this.isShown.set(true);
  }
}
