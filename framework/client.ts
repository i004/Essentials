import { Client as dClient, ClientOptions } from "discord.js";
import { Command, CommandManager } from "./command";
import { readFile, writeFile } from 'fs/promises';
import { UserError } from "./external";
import { internal } from "../util";
import { _buttons, _events } from "./module";
import { InteractionHandler } from './handlers';

export default class Client extends dClient {

  private commands: Record<string, Command> = {};

  constructor (options: ClientOptions) {
    super(options);

    this.subscribeHandlers();
    this.subscribeEvents();
  }

  waitUntilReady () {
    if (this.isReady())
      return;

    return new Promise(res => {
      this.once('ready', res);
    })
  }

  registerCommands (commands: object[]) {
    (async () => {
      await this.waitUntilReady();

      const commandCache = JSON.parse((await readFile(`${__dirname}/_command-cache.json`)).toString());

      const build = commands.map(x => ({ data: CommandManager.build(x), run: new (x as any)().run, proto: x }));
      
      for (const cId in commandCache) {
        const cached = commandCache[cId];
        const command = build.find(x => x.data.name == cached.name && x.data.guildId == cached.guildId);
        
        if (!command) {
          this.application.commands.delete(cId, cached.guildId);
          delete commandCache[cId];
        }
  
        else if (!CommandManager.compare(cached, command.data))
          commandCache[cId] = (await this.application.commands.edit(cId, command.data, command.data.guildId)).toJSON();

        if (command)
          this.commands[cId] = command;
      }
  
      for (const command of build) {
        const cached = Object.values(commandCache).find((x: any) => x.name == command.data.name);
  
        if (!cached) {
          const created = await this.application.commands.create(command.data, command.data.guildId);
          commandCache[created.id] = created.toJSON();
          this.commands[created.id] = command;
        }
      }
  
      writeFile(`${__dirname}/_command-cache.json`, JSON.stringify(commandCache, null, 2));
    })();

    return this;
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