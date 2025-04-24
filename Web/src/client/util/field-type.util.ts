import {FieldType} from '../model/data-type-field.model';
import {DateUtil} from './date.util';
import {EnumUtil} from './enum.util';
import {IsoCountryCode} from '../model/iso-country.model';

export class FieldTypeUtil {
  public static updateValue = (value: any, type: FieldType): any => {
    switch (type) {
      case FieldType.Check:
        const lowerValue = value?.toLowerCase();
        return lowerValue === 'true' || lowerValue === 'yes' || lowerValue === '1';

      case FieldType.Currency:
      case FieldType.Number:
      case FieldType.Reference:
        return value != null ? Number(value) : undefined;

      case FieldType.Date:
        return value != null ? DateUtil.adjustToLocalDate(value) : undefined;

      case FieldType.IsoCountryCode:
        return value != null ? EnumUtil.toEnumOrThrow(value, IsoCountryCode) : undefined;

      default:
        return value;
    }
  }
}
