import { ConsoleLogger } from "./console-logger";

export interface Logger {
  log(message: any, ...props: any[]): any
  warn(message: any, ...props: any[]): any
  error(message: any, ...props: any[]): any
  debug?(message: any, ...props: any[]): any
}

const DEFAULT_LOGGER = new ConsoleLogger()

export class ProxyLogger {
  private static staticInstanceRef: Logger = DEFAULT_LOGGER;

  public static log (message: string, ...props: any[]): void {
    this.staticInstanceRef.log(message, ...props);
  };

  public static warn (message: string, ...props: any[]): void {
    this.staticInstanceRef.warn(message, ...props);
  };

  public static error (message: string, ...props: any[]): void {
    this.staticInstanceRef.error(message, ...props);
  };

  public static debug(message: string, ...props: any[]): void {
    this.staticInstanceRef?.debug(message, ...props);
  };

  public static overrideLogger (logger: Logger): void {
    this.staticInstanceRef = logger;
  }
}
