import { Awaitable, CommandInteraction, InteractionReplyOptions } from 'discord.js';

export interface Command {
    run (interaction: CommandInteraction): Awaitable<void | string | InteractionReplyOptions>;
}
