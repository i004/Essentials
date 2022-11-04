import { ChatInputApplicationCommandData, Snowflake } from 'discord.js';

export type CommandData = ChatInputApplicationCommandData & { guildId?: Snowflake };
