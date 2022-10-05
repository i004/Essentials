import { ClientOptions, Client as DiscordJsClient } from "discord.js";
import { InteractionsHandler } from './interactions-handler';
import { CommandsContainer } from './commands-container';
import { _events } from "./module";
import { Type } from './interfaces';

export class Client extends DiscordJsClient {

  private readonly commands: CommandsContainer;

  constructor (options: ClientOptions) {
    super(options);

    this.commands = new CommandsContainer(this.application.commands);

    this.subscribeHandlers();
    this.subscribeEvents();
  }


  async registerCommands (commands: Type<any>[]): Promise<void> {
    await this.commands.registerCommands(commands);
  }

  private subscribeHandlers (): void {
    const interactionHandler = new InteractionsHandler(this.commands);
    this.on('interactionCreate', interactionHandler.handle.bind(interactionHandler));
  }

  private subscribeEvents (): void {
    for (const event in _events) {
      const fn = _events[event];
      this.on(event, fn.bind(fn));
    }
  }
}