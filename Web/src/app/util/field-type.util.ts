import {FieldType} from '../model/data-type-field.model';
import {DateUtil} from './date.util';
import {EnumUtil} from './enum.util';
import {IsoCountryCode} from '../model/iso-country.model';

export class FieldTypeUtil {
  public static updateValue = (value: any, type: FieldType): any => {
    switch (type) {
      case FieldType.Check:
        return value.toLowerCase() === 'true';

      case FieldType.Currency:
      case FieldType.Number:
      case FieldType.Reference:
        return Number(value);

      case FieldType.Date:
        return DateUtil.adjustToLocalDate(value);

      case FieldType.IsoCountryCode:
        return EnumUtil.toEnumOrThrow(value, IsoCountryCode);

      default:
        return value;
    }
  }
}
