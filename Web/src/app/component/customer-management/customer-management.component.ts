import {Component, input, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import Customer, {CustomerCreateRequest, CustomerEditRequest} from '../../model/customer.model';
import Messages from '../../model/messages.model';
import {CustomerService} from '../../service/customer.service';
import {TextService} from '../../service/text.service';
import {first} from 'rxjs';
import {ErrorResolverService} from '../../service/error-resolver.service';

@Component({
  selector: 'app-customer-management',
  imports: [],
  templateUrl: './customer-management.component.html',
  styles: ``
})
export class CustomerManagementComponent implements OnInit {
  form!: FormGroup;
  customer = signal<Customer | null>(null);
  isShownInitially = input<boolean>(false);
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private errorResolverService: ErrorResolverService,
    private textService: TextService
  ) {
    this.form = this.formBuilder.group({
      // TODO: Add form fields
    });
  }

  readonly ngOnInit = () => {
    this.isShown.set(this.isShownInitially());
  }

  private readonly create = (request: CustomerCreateRequest) => {
    this.customerService.create(request).pipe(first()).subscribe({
      next: () => this.messages.set({success: ["Customer has been created successfully."]}),
      error: (response) => this.errorResolverService.resolveHttpResponseTo(response, this.messages)
    });
  }

  private readonly edit = (request: CustomerEditRequest) => {
    this.customerService.edit(request).pipe(first()).subscribe({
      next: () => this.messages.set({success: ["Customer has been edited successfully."]}),
      error: (response) => this.errorResolverService.resolveHttpResponseTo(response, this.messages)
    });
  }

  readonly getErrorMessage = (field: string): string | null => {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) return "";

    if (control.errors?.["required"]) {
      return `${this.textService.capitalize(field)} is required.`;
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

    if (this.customer() != null) {
      this.edit({
        name: this.form.value.name,
        description: this.form.value.description,
        customerId: this.customer()!!.id!!
      });
    } else {
      this.create({
        name: this.form.value.name,
        description: this.form.value.description
      });
    }
  }

  readonly show = (customer: Customer | null) => {
    this.form.reset({description: "No description set."});

    if (customer) {
      this.form.patchValue({...customer});
    }

    this.customer.set(customer);
    this.isShown.set(true);
  }
}
