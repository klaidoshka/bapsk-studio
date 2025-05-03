import {Component, computed, input} from '@angular/core';
import {AbstractControl} from '@angular/forms';

const defaultErrorMessages: { [key: string]: (error: any) => string } = {
  email: () => "Invalid email address format.",
  max: (error) => `Maximum value is ${error.max}.`,
  maxlength: (error) => `Maximum length is ${error.requiredLength}.`,
  min: (error) => `Minimum value is ${error.min}.`,
  minlength: (error) => `Minimum length is ${error.requiredLength}.`,
  pattern: (error) => `Invalid format. Supported: ${error.requiredPattern}.`,
  required: () => "Input is required."
};

@Component({
  selector: 'form-input-error',
  imports: [],
  templateUrl: './form-input-error.component.html',
  styles: ``
})
export class FormInputErrorComponent {
  readonly control = input.required<AbstractControl>();
  readonly customErrorMessages = input<{ [key: string]: (error: any) => string } | undefined>();

  protected readonly errorMessages = computed(() => ({
    ...defaultErrorMessages,
    ...this.customErrorMessages()
  }));

  protected getErrorMessage(control: AbstractControl, messages: {
    [key: string]: (error: any) => string
  }): string | undefined {
    if (control.untouched || control.valid || !control.errors) {
      return undefined;
    }
    const key = Object.keys(control.errors)[0];
    const mapper = messages[key];
    return mapper ? mapper(control.errors[key]) : undefined;
  }
}
