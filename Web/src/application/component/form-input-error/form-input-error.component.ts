import {Component, inject, input} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'form-input-error',
  imports: [],
  templateUrl: './form-input-error.component.html',
  styles: ``
})
export class FormInputErrorComponent {
  private readonly translateService = inject(TranslateService);
  readonly control = input.required<AbstractControl>();

  protected getErrorMessage(): string | undefined {
    const control = this.control();
    if (control.untouched || control.valid || !control.errors) {
      return undefined;
    }
    const key = Object.keys(control.errors)[0];
    const params = control.errors[key];
    return this.translateService.instant('error.' + key, params);
  }
}
