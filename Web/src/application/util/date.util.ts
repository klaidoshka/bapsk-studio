export class DateUtil {
  public static parseUTC = (date: Date | string): Date => {
    if (date instanceof Date) {
      return date;
    }

    const iso = date.replace(" ", "T");
    const withTZ = /Z$|[+-]\d{2}:\d{2}$/.test(iso) ? iso : iso + "Z";

    return new Date(withTZ);
  };

  public static adjustToLocalDate = (date: Date | string): Date => {
    const utc = DateUtil.parseUTC(date);
    return new Date(
      utc.getFullYear(),
      utc.getMonth(),
      utc.getDate(),
      utc.getHours(),
      utc.getMinutes(),
      utc.getSeconds(),
      utc.getMilliseconds()
    );
  }

  public static toString = (date: Date | string): string => {
    if (typeof date === "string") {
      return this.toString(new Date(date));
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
}
