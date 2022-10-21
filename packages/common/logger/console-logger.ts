/* eslint no-console: "off" */
import { Logger } from './logger';

export class ConsoleLogger implements Logger {
  public log (message: string): void {
    console.log(message);
  }

  public error (message: string): void {
    console.log(message);
  }

  public warn (message: string): void {
    console.log(message);
  }

  public debug (message: string): void {
    console.log(message);
  }
}
