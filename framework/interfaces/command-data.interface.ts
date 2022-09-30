import { ChatInputApplicationCommandData, Snowflake } from 'discord.js';

type CommandData = ChatInputApplicationCommandData & { guildId?: Snowflake };
