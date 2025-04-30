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

  public static toString = (date: Date | string): string => {
    if (typeof date === "string") {
      return this.toString(new Date(date));
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
