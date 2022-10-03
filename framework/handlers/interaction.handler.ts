import { AutocompleteInteraction, ButtonInteraction, CommandInteraction, Interaction } from 'discord.js';
import { Handler } from '../interfaces';
import { internal } from "../../util";
import { UserError } from "../external";
import { _buttons } from "../module";
import { CommandManager } from '../managers';

export class InteractionHandler implements Handler<'interactionCreate'> {

  // TODO: types
  // TODO: command manager
  constructor (
        private readonly commands: CommandManager
  ) {}

  public async handle (interaction: Interaction<any>): Promise<void> {
    try {
      if (interaction.isCommand() && interaction.commandId in this.commands)
        await this.interactCommand(interaction);
      else if (interaction.isAutocomplete() && interaction.commandId in this.commands)
        await this.interactAutocomplete(interaction);
      else if (interaction.isButton())
        await this.interactButton(interaction); 
    } catch (err) {
      if (err instanceof UserError)
        await internal.forceReply(interaction, {
          embeds: [{
            ...internal.errorEmbed(err.message),
            ...err.embedOptions
          }]
        });
      else {
        console.error(err);

        await internal.forceReply(interaction, {
          embeds: [
            internal.errorEmbed("An unexpected error has occured. Sorry!")
          ]
        });
      }
    }
  }

  private async interactCommand (interaction: CommandInteraction): Promise<void> {
    const command = this.commands.get(interaction.commandId);
    const response = await command.run(interaction);

    if (!response) return;

    await internal.forceReply(interaction, response);
  }

  private async interactAutocomplete (interaction: AutocompleteInteraction): Promise<void> {
    const fn = Reflect.get((this.commands.get(interaction.commandId) as any).proto, 'command:autocomplete');
    const focused = interaction.options.getFocused(true);

    if (!fn || !fn[focused.name]) return;

    const result = await fn[focused.name](focused);

    await interaction.respond(result);
  }

  private async interactButton (interaction: ButtonInteraction): Promise<void> {
    const button = _buttons.find((x) => x.regex.test(interaction.customId));

    if (!button) return;

    const groups = button.regex.exec(interaction.customId).slice(1);
    const response = await button.trigger(interaction, ...groups);

    if (response)
      await internal.forceReply(interaction, response);
  }
}