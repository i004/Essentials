import {
  ApplicationCommand,
  ApplicationCommandManager,
  ChatInputApplicationCommandData,
  Snowflake
} from 'discord.js';
import isEqual from 'fast-deep-equal'; // TODO: import from lodash
import { readFile, writeFile } from 'node:fs/promises';
import { Command } from '../interfaces';
import { CommandType } from '../enums';

// TODO: import from lodash
function kebabize (s: string) {
  return s.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (x, o) => (o ? '-' : '') + x.toLowerCase());
}

type CommandData = ChatInputApplicationCommandData & { guildId?: Snowflake };

export class CommandManager {

  private storage = new Map<Snowflake, Command>();

  constructor (
        private readonly commands: ApplicationCommandManager
  ) {}


  public get (id: string): Command {
    return this.storage.get(id);
  }

  public async registerCommands (commands: object[]) {
    const file = await readFile(`${__dirname}/_command-cache.json`, 'utf-8');
    const commandCache = JSON.parse(file);

    const build = commands.map((x) => ({
      data: this.build(x),
      run: new (x as any)().run,
      proto: x
    }));

    for (const cId in commandCache) {
      const cached = commandCache[cId];
      const command = build.find((x) =>
        x.data.name === cached.name && x.data.guildId === cached.guildId
      );

      if (!command) {
        this.commands.delete(cId, cached.guildId);
        delete commandCache[cId];
      }

      else if (!this.compare(cached, command.data))
        commandCache[cId] = (await this.commands.edit(
          cId,
          command.data,
          command.data.guildId
        )).toJSON();

      if (command)
        this.commands[cId] = command;
    }

    for (const command of build) {
      const cached = Object.values(commandCache).find((x: any) =>
        x.name === command.data.name
      );

      if (!cached) {
        const created = await this.commands.create(command.data, command.data.guildId);
        commandCache[created.id] = created.toJSON();
        this.commands[created.id] = command;
      }
    }

    writeFile(`${__dirname}/_command-cache.json`, JSON.stringify(commandCache, null, 2));
  }

  private compare (a: CommandData, b: CommandData) {
    if (
      b.name !== a.name
            || ('description' in b && b.description !== a.description)
            || (b.type && b.type !== a.type)
            || (b.options?.length ?? 0) !== (a.options?.length ?? 0)
            || !isEqual(b.nameLocalizations ?? {}, a.nameLocalizations ?? {})
            || !isEqual(
              b.descriptionLocalizations ?? {},
              a.descriptionLocalizations ?? {}
            )
    ) return false;
        
    if (b.options)
      return ApplicationCommand.optionsEqual(a.options, b.options);

    return true;
  }

  private build (target: object): CommandData {
    return {
      type: Reflect.get(target, 'command:type')
        || CommandType.ChatInput,
      name: Reflect.get(target, 'command:name')
        || kebabize((target as any).name),
      nameLocalizations: Reflect.get(target, 'command:nameLocalizations')
        || null,
      description: Reflect.get(target, 'command:description')
        || 'No description provided',
      descriptionLocalizations: Reflect.get(target, 'command:descriptionLocalizations')
        || null,
      options: Reflect.get(target, 'command:options')
        || [],
      defaultMemberPermissions: Reflect.get(target, 'command:defaultMemberPermissions')
        || null,
      dmPermission: Reflect.get(target, 'command:dmPermission')
        || true,
      guildId: Reflect.get(target, 'command:guildId')
    };
  }
}