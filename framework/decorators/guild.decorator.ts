import { Snowflake } from 'discord.js';

export function guild (guildId: Snowflake) {
    return function ({ constructor: t }, _, __) {
        Reflect.set(t, 'command:guildId', guildId);
    }
}
