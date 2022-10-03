import { ClientOptions, Client as dClient } from "discord.js";
import { InteractionHandler } from './handlers';
import { CommandManager } from './managers';
import { _events } from "./module";
import { Type } from './interfaces';

export default class Client extends dClient {

  private readonly commands: CommandManager;

  constructor (options: ClientOptions) {
    super(options);

    this.commands = new CommandManager(this.application.commands);

    this.subscribeHandlers();
    this.subscribeEvents();
  }


  async registerCommands (commands: Type<any>[]): Promise<void> {
    await this.commands.registerCommands(commands);
  }

  private subscribeHandlers (): void {
    const interactionHandler = new InteractionHandler(this.commands);
    this.on('interactionCreate', interactionHandler.handle.bind(interactionHandler));
  }

  private subscribeEvents (): void {
    for (const event in _events) {
      const fn = _events[event];
      this.on(event, fn.bind(fn));
    }
  }
}