import { Client as dClient, ClientOptions } from "discord.js";
import { Command, CommandManager } from "./command";
import { readFile, writeFile } from 'fs/promises';
import { UserError } from "./external";
import { internal } from "../util";
import { _buttons, _events } from "./module";

export default class Client extends dClient {
    private commands: Record<string, Command> = {};

    constructor (options: ClientOptions) {
        super(options);

        for (const event in _events)
            this.on(event, (...a) => _events[event](...a));

        this.on('interactionCreate', async (interaction) => {
            if (interaction.isCommand() && interaction.commandId in this.commands) {
                try {
                    const response = await this.commands[interaction.commandId].run(interaction);

                    if (!response)
                        return;
                    
                    await internal.forceReply(interaction, response);
                } catch (err) {
                    if (err instanceof UserError)
                        await internal.forceReply(interaction, {
                            embeds: [{
                                ...internal.errorEmbed(err.message),
                                ...err.embedOptions
                            }]
                        });
                    else {
                        console.error(err);
    
                        await internal.forceReply(interaction, {
                            embeds: [
                                internal.errorEmbed("An unexpected error has occured. Sorry!")
                            ]
                        });
                    }
                }
            } else if (interaction.isAutocomplete()) {
                if (!this.commands[interaction.commandId])
                    return;

                const fn = Reflect.get((this.commands[interaction.commandId] as any).proto, 'command:autocomplete');
                const focused = interaction.options.getFocused(true);
                
                if (!fn || !fn[focused.name])
                    return;

                await interaction.respond(await fn[focused.name](focused));
            } else if (interaction.isButton()) {
                const button = _buttons.find(x => x.regex.test(interaction.customId));

                if (!button)
                    return;

                const groups = button.regex.exec(interaction.customId).slice(1);
                
                try {
                    const response = await button.trigger(interaction, ...groups);
                    
                    if (!response)
                        return;
                    
                    await internal.forceReply(interaction, response);
                } catch (err) {
                    if (err instanceof UserError)
                        await internal.forceReply(interaction, {
                            embeds: [{
                                ...internal.errorEmbed(err.message),
                                ...err.embedOptions
                            }]
                        });
                    else {
                        console.error(err);
    
                        await internal.forceReply(interaction, {
                            embeds: [
                                internal.errorEmbed("An unexpected error has occured. Sorry!")
                            ]
                        });
                    }
                }
            }
        })
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
}