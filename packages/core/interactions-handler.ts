import {
  AutocompleteInteraction,
  ButtonInteraction,
  CommandInteraction,
  Interaction, InteractionReplyOptions } from 'discord.js';
import { CommandsContainer } from './commands-container';
import { _buttons } from "./module";

export class InteractionsHandler {

  constructor (
    private readonly commands: CommandsContainer
  ) {}

  public async handle (interaction: Interaction): Promise<void> {
    
    if (interaction.isCommand() && this.commands.has(interaction.commandId)) {
      await this.interactCommand(interaction);
    }

    else if (interaction.isAutocomplete() && this.commands.has(interaction.commandId)) {
      await this.interactAutocomplete(interaction);
    }

    else if (interaction.isButton()) {
      await this.interactButton(interaction); 
    }

  }

  private async interactCommand (interaction: CommandInteraction): Promise<void> {
    const command = this.commands.get(interaction.commandId);
    const response = await command.run(interaction);

    if (!response) return;

    await this.forceReply(interaction, response);
  }

  private async interactAutocomplete (
    interaction: AutocompleteInteraction
  ): Promise<void> {
    const fn = Reflect.get(
      (this.commands.get(interaction.commandId) as any).proto,
      'command:autocomplete'
    );
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
      await this.forceReply(interaction, response);
  }

  private async forceReply (
    interaction: CommandInteraction | Interaction,
    data: string | InteractionReplyOptions
  ) {
    if (!interaction.isRepliable()) {
      return;
    }

    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(data);
    } else {
      await interaction.reply(data);
    }
  }
}