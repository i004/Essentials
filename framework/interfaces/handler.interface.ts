import { Awaitable, ClientEvents } from 'discord.js';

export interface Handler<K extends keyof ClientEvents> {
    handle (...args: ClientEvents[K]): Awaitable<void>
}
