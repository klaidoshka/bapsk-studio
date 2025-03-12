import {Component, input, OnInit, signal} from '@angular/core';
import Salesman, {SalesmanCreateRequest, SalesmanEditRequest} from '../../model/salesman.model';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import Messages from '../../model/messages.model';
import {SalesmanService} from '../../service/salesman.service';
import {LocalizationService} from '../../service/localization.service';
import {TextService} from '../../service/text.service';
import {IsoCountries} from '../../model/iso-country.model';
import {first} from 'rxjs';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-salesman-management',
  imports: [
    Button,
    Dialog,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Select
  ],
  templateUrl: './salesman-management.component.html',
  styles: ``
})
export class SalesmanManagementComponent implements OnInit {
  salesman = signal<Salesman | null>(null);
  form!: FormGroup;
  instanceId = input.required<number>();
  isShownInitially = input<boolean>(false);
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});

  constructor(
    private formBuilder: FormBuilder,
    private salesmanService: SalesmanService,
    private localizationService: LocalizationService,
    private textService: TextService
  ) {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(300)]],
      vatPayerCode: this.formBuilder.group({
        issuedBy: ["", [Validators.required]],
        value: ["", [Validators.required, Validators.pattern("^[0-9]{12}$")]]
      })
    });
  }

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  private readonly create = (request: SalesmanCreateRequest) => {
    this.salesmanService.create(request).pipe(first()).subscribe({
      next: () => this.messages.set({success: ["Salesman has been created successfully."]}),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private readonly edit = (request: SalesmanEditRequest) => {
    this.salesmanService.edit(request).pipe(first()).subscribe({
      next: () => this.messages.set({success: ["Salesman has been edited successfully."]}),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  readonly getErrorMessage = (field: string): string | null => {
    const parts = field.split(".");
    let control: AbstractControl<any, any> | null = null;

    for (const part of parts) {
      control = control ? control.get(part) : this.form.get(part);
    }

    if (!control || !control.touched || !control.invalid) return "";

    const name = this.textService.capitalize(field);

    if (control.errors?.["required"]) {
      return `${name} is required.`;
    }

    if (control.errors?.["maxlength"]) {
      return `${name} must be at most ${control.errors["maxlength"].requiredLength} characters long.`;
    }

    if (control.errors?.["pattern"]) {
      return `${name} must be a 12-digit number.`;
    }

    return null;
  }

  readonly hide = () => {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
  }

  readonly save = () => {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    const request = {
      salesman: {
        name: this.form.value.name,
        vatPayerCode: {
          issuedBy: this.form.value.vatPayerCode.issuedBy,
          value: this.form.value.vatPayerCode.value
        }
      },
      instanceId: this.instanceId()
    };

    if (this.salesman() != null) {
      this.edit({
        ...request,
        salesman: {
          ...request.salesman,
          id: this.salesman()!.id
        }
      });
    } else {
      this.create(request);
    }
  }

  readonly show = (salesman: Salesman | null) => {
    this.updateForm(salesman);
    this.salesman.set(salesman);
    this.isShown.set(true);
  }

  private readonly updateForm = (salesman?: Salesman | null) => {
    this.form.reset();

    if (salesman != null) {
      this.form.patchValue({...salesman});
    }
  }
  protected readonly IsoCountries = IsoCountries;
}
