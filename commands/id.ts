import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, SnowflakeUtil } from "discord.js";
import { Command, CommandInteraction, OptionType, UserError, button, describe, option } from "../framework";

export default class Id implements Command {
    @describe('Information about a Discord snowflake')
    @option(OptionType.String, 'id', {
      description: 'Snowflake',
      minLength: 8,
      maxLength: 22
    })
  async run (i: CommandInteraction) {
    const id = i.options.getString('id').replace(/[^\d]/g, '');

    if (!id.match(/^\d{8,20}$/))
      throw new UserError('Invalid ID provided');

    const d = SnowflakeUtil.decode(id);

    await i.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`<t:${Math.floor(Number(d.timestamp) / 1000)}:f>`)
          .setFooter({ text: id })
          .addFields([
            { inline: true, name: 'Increment',  value: d.increment.toString() },
            { inline: true, name: 'Process ID', value: d.processId.toString() },
            { inline: true, name: 'Worker ID',  value: d.workerId.toString() },
          ])
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`lookup:${id}`)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('1025068370216882337')
              .setLabel('Lookup')
              .setDisabled(d.timestamp > Date.now() || d.timestamp < 21000000000000000)
          )
      ]
    });
  }

    @button('lookup:{}')
    async lookup (i: ButtonInteraction, id: string) {
      await i.reply({ content: `test ${id}` });
    }
}