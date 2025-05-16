import os from 'os';

export class HelperUtil {
  public static getIp(isHttps: boolean, port: string | number): string {
    const ip = os
      .networkInterfaces()?.["en0"]
      ?.find(info => info.family === "IPv4")?.address || "localhost";

    return `${isHttps ? "https" : "http"}://${ip}:${port}`;
  }
}
