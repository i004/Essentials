import { ApplicationCommand,
         Awaitable,
         ChatInputApplicationCommandData,
         CommandInteraction,
         InteractionReplyOptions,
         LocaleString,
         PermissionResolvable,
         Snowflake } from "discord.js";
import { CommandType, OptionType } from "./enums";
import { OptionOf } from "./types";
import isEqual from 'fast-deep-equal';

const kebabize = (s: string) => s.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (x, o) => (o?'-':'')+x.toLowerCase());

type CommandData = ChatInputApplicationCommandData & { guildId?: Snowflake };

export interface Command {
    run (interaction: CommandInteraction): Awaitable<void | string | InteractionReplyOptions>;
}

export abstract class CommandManager {
    constructor (){}

    public static compare (a: CommandData, b: CommandData) {
        if (
            b.name !== a.name
            || ('description' in b && b.description !== a.description)
            || (b.type && b.type !== a.type)
            || (b.options?.length ?? 0) !== (a.options?.length ?? 0)
            || !isEqual(b.nameLocalizations ?? {}, a.nameLocalizations ?? {})
            || !isEqual(b.descriptionLocalizations ?? {}, a.descriptionLocalizations ?? {})
        ) return false;
        
        if (b.options)
            return ApplicationCommand.optionsEqual(a.options, b.options);

        return true;
    }

    public static build (target: object): CommandData {
        return {
            type: Reflect.get(target, 'command:type') || CommandType.ChatInput,
            name: Reflect.get(target, 'command:name') || kebabize((target as any).name),
            nameLocalizations: Reflect.get(target, 'command:nameLocalizations') || null,
            description: Reflect.get(target, 'command:description') || 'No description provided',
            descriptionLocalizations: Reflect.get(target, 'command:descriptionLocalizations') || null,
            options: Reflect.get(target, 'command:options') || [],
            defaultMemberPermissions: Reflect.get(target, 'command:defaultMemberPermissions') || null,
            dmPermission: Reflect.get(target, 'command:dmPermission') || true,
            guildId: Reflect.get(target, 'command:guildId')
        };
    }
}

export function describe (description: string) {
    return function ({ constructor: t }, _, __) {
        Reflect.set(t, 'command:description', description);
    }
}

export function locale (locale: LocaleString, description: string) {
    return function ({ constructor: t }, _, __) {
        if (!Reflect.has(t, 'command:descriptionLocalizations'))
            Reflect.set(t, 'command:descriptionLocalizations', {});
        
        Reflect.get(t, 'command:descriptionLocalizations')[locale] = description;
    }
}

export function option <T extends OptionType> (type: T, name: string, data?: Partial<Omit<OptionOf<T>, 'name' | 'type'>>) {
    return function ({ constructor: t }, _, __) {
        if (!Reflect.has(t, 'command:options'))
            Reflect.set(t, 'command:options', []);
        
        if (data.autocomplete) {
            if (!Reflect.has(t, 'command:autocomplete'))
                Reflect.set(t, 'command:autocomplete', {});

            Reflect.get(t, 'command:autocomplete')[name] = data.autocomplete;
        }

        Reflect.get(t, 'command:options').push({
            type,
            name,
            description: 'No description provided',
            required: type == OptionType.Subcommand || type == OptionType.SubcommandGroup ? undefined : true,
            nameLocalizations: null,
            descriptionLocalizations: null,
            ...(data || {}),
            autocomplete: !!data.autocomplete || undefined
        });
    }
}

export function requirePermissions (permissions: PermissionResolvable) {
    return function ({ constructor: t }, _, __) {
        Reflect.set(t, 'command:defaultMemberPermissions', permissions);
    }
}

export function guild (guildId: Snowflake) {
    return function ({ constructor: t }, _, __) {
        Reflect.set(t, 'command:guildId', guildId);
    }
}

export function guildOnly ({ constructor: t }, _, __) {
    if (!t.data)
        t.data = {};
    
    t.data.dmPermission = false;
}
