import {Component, input, OnInit, signal} from '@angular/core';
import Instance, {InstanceCreateRequest, InstanceEditRequest} from '../../model/instance.model';
import {Dialog} from 'primeng/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TextService} from '../../service/text.service';
import Messages from '../../model/messages-model';
import {InstanceService} from '../../service/instance.service';
import ErrorResponse from '../../model/error-response.model';
import {first} from 'rxjs';
import {Button} from 'primeng/button';
import {Textarea} from 'primeng/textarea';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';

@Component({
  selector: 'app-instance-management',
  imports: [
    Dialog,
    FormsModule,
    Button,
    Textarea,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule
  ],
  templateUrl: './instance-management.component.html',
  styles: ``
})
export class InstanceManagementComponent implements OnInit {
  form!: FormGroup;
  instance = signal<Instance | null>(null);
  isShownInitially = input<boolean>(false);
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});

  constructor(
    private formBuilder: FormBuilder,
    private instanceService: InstanceService,
    private textService: TextService
  ) {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["No description set."]
    });
  }

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  private create(request: InstanceCreateRequest) {
    this.instanceService.create(request).pipe(first()).subscribe({
      next: () => this.messages.set({success: ["Instance has been created successfully."]}),
      error: (response: ErrorResponse) => this.messages.set({
        error: response.error?.messages || ["Extremely rare error occurred, please try again later."]
      })
    });
  }

  private edit(request: InstanceEditRequest) {
    this.instanceService.edit(request).pipe(first()).subscribe({
      next: () => this.messages.set({success: ["Instance has been edited successfully."]}),
      error: (response: ErrorResponse) => this.messages.set({
        error: response.error?.messages || ["Extremely rare error occurred, please try again later."]
      })
    });
  }

  getErrorMessage(field: string): string | null {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) return "";

    if (control.errors?.["required"]) {
      return `${this.textService.capitalize(field)} is required.`;
    }

    return null;
  }

  hide() {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
  }

  save() {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    if (this.instance() != null) {
      this.edit({
        name: this.form.value.name,
        description: this.form.value.description,
        instanceId: this.instance()!!.id!!
      });
    } else {
      this.create({
        name: this.form.value.name,
        description: this.form.value.description
      });
    }
  }

  show(instance: Instance | null) {
    this.form.reset({description: "No description set."});

    if (instance) {
      this.form.patchValue({...instance});
    }

    this.instance.set(instance);
    this.isShown.set(true);
  }
}
