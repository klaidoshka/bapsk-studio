export class DateUtil {
  public static parseUTC = (date: Date | string) => {
    const value = typeof date === "string" ? date : date.toISOString();

    if (value.endsWith("Z") || value.match(/[+-]\d{2}:\d{2}$/)) {
      return new Date(value);
    }

    return new Date(value + "Z");
  };

  public static adjustToLocalDate = (date: Date | string): Date =>
    new Date((DateUtil.parseUTC(date)).toLocaleString());
}
