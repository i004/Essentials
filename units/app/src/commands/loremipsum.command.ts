import { CommandInteraction, OptionType, button, option } from "../framework";
import { LoremIpsum as LoremIpsumGenerator } from 'lorem-ipsum';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle
} from "discord.js";

const lorem = new LoremIpsumGenerator({
  sentencesPerParagraph: {
    max: 7,
    min: 3
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

export class LoremCommand {
  @option(OptionType.Subcommand, 'ipsum', {
    description: 'Generate lorem ipsum string'
  })
  @button('refresh:{}')
  async run (i: CommandInteraction | ButtonInteraction, userId?: string) {
    const message = {
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
             + lorem.generateParagraphs(1),
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`refresh:${i.user.id}`)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('1025093698960228363')
          )
      ]
    };

    if (!userId)
      await i.reply(message);

    else if (i.isButton() && userId === i.user.id)
      await i.update(message);

    else
      await i.reply({ ...message, ephemeral: true });
  }
}