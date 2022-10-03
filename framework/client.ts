import { ClientOptions, Client as dClient } from "discord.js";
import { InteractionHandler } from './handlers';
import { CommandManager } from './managers';
import { _events } from "./module";

export default class Client extends dClient {

  private readonly commands: CommandManager;

  constructor (options: ClientOptions) {
    super(options);

    this.commands = new CommandManager(this.application.commands);

    this.subscribeHandlers();
    this.subscribeEvents();
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