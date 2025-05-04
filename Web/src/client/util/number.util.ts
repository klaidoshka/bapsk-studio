export class NumberUtil {
  public static parse(value: any): number | undefined {
    if (value == null) {
      return undefined;
    }

    const parsedValue = parseFloat(value);

    if (isNaN(parsedValue)) {
      return undefined;
    }

    return parsedValue;
  }

  public static round(value: number, precision: number): number {
    if (isNaN(value)) {
      return value;
    }

    const factor = Math.pow(10, precision);

    return Math.round(value * factor) / factor;
  }
}
