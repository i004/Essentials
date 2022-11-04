import { Command, CommandInteraction, describe } from "../framework";

export class StatsCommand implements Command {
  @describe('Some bot related information and statistics')
  async run (i: CommandInteraction) {
    const restStart = Date.now();
    const commandCount = (await i.client.application.commands.fetch()).size;
    const restPing = Math.abs(Date.now() - restStart);

    return `**Essentials** is currently being used `
         + `in **${i.client.guilds.cache.size}** guilds `
         + `and has **${commandCount}** public commands available.\n`
         + `Current websocket latency is **${i.client.ws.ping}ms**. `
         + `Current REST ping is **${restPing}ms**`;
  }
}