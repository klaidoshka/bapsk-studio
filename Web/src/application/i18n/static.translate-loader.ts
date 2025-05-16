import {Observable, of} from 'rxjs';

import * as EN from '../../../public/i18n/en.json';
import * as LT from '../../../public/i18n/lt.json';
import {TranslateLoader, TranslationObject} from '@ngx-translate/core';

const translations: TranslationObject = {
  en: EN,
  lt: LT
};

export class StaticTranslateLoader implements TranslateLoader {
  getTranslation(language: string): Observable<TranslationObject> {
    const translation = translations[language];
    if (translation) {
      return of(translation);
    } else {
      console.error(`Unknown language: ${language}`);
      return of({});
    }
  }
}
