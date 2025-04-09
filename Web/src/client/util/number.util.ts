export class NumberUtil {
  public static round(value: number, precision: number): number {
    if (isNaN(value)) {
      return value;
    }

    const factor = Math.pow(10, precision);

    return Math.round(value * factor) / factor;
  }
}
