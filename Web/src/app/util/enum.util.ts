export class EnumUtil {
  public static toEnum = <E extends Record<string, string | number>>(value: unknown, enumType: E): E[keyof E] | undefined => {
    const valueNormalized = (value as string).toString().toLowerCase();

    for (const enumValue of Object.values(enumType)) {
      if (enumValue.toString().toLowerCase() === valueNormalized) {
        return enumType[enumValue] as E[keyof E];
      }
    }

    return undefined;
  };

  public static toEnumOrThrow = <E extends Record<string, string | number>>(value: unknown, enumType: E): E[keyof E] => {
    const result = EnumUtil.toEnum(value, enumType);

    if (result === undefined) {
      throw new Error(`Value ${value} is not a valid enum value.`);
    }

    return result;
  }
}
