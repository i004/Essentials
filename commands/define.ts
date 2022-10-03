import { Command, CommandInteraction, OptionType, describe, option } from "../framework";
import { UrbanDictionary, limitLength } from "../util";
import { TextChannel } from "discord.js";

const blacklist = /(n[i1]gg?(as?|ers?))|(faggot)/gi;

export default class Define implements Command {
  @describe('urban dictionary lookup')
  @option(OptionType.String, 'term', {
    description: 'The term you want to lookup',
    autocomplete: async ({ value }) => {
      if (!value.trim())
        return [];

      return (await UrbanDictionary.autocomplete(value))
        .slice(0, 8)
        .filter((x) => !blacklist.test(x.term) && !blacklist.test(x.preview))
        .map(({ preview, term }) => ({
          name: limitLength(`${term} ▪️ ${preview}`, 75),
          value: term
        }));
    }
  })
  async run (i: CommandInteraction) {
    const list = await UrbanDictionary.define(i.options.getString('term'));

    await i.reply({
      content: limitLength(`${list[0].definition}`, 2000)
        .replace(/\[(.+?)\]/g, (_, g1) => g1) // [x] -> x
        .replace(blacklist, (m) => '\\*'.repeat(m.length)),
      ephemeral: !(i.channel as TextChannel).nsfw
    });
  }
}