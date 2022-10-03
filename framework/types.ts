import { ApplicationCommandOptionChoiceData,
  AutocompleteFocusedOption,
  Awaitable,
  ChannelType,
  CommandOptionChoiceResolvableType,
  CommandOptionNonChoiceResolvableType,
  CommandOptionNumericResolvableType,
  LocalizationMap } from "discord.js";

import { OptionType } from "./enums";

// eslint-disable-next-line
export type AutocompleteOptionCallback = (focused: AutocompleteFocusedOption) => Awaitable<ApplicationCommandOptionChoiceData[]>;


export interface CommandAttachmentOption extends OptionBase {
    type: OptionType.Attachment;
}

export interface CommandAutocompleteNumericOption
extends Omit<OptionBase, 'autocomplete'> {
    type: CommandOptionNumericResolvableType;
    minValue?: number;
    maxValue?: number;
    autocomplete: AutocompleteOptionCallback;
}

export interface CommandAutocompleteStringOption
extends Omit<OptionBase, 'autocomplete'> {
    type: OptionType.String;
    minLength?: number;
    maxLength?: number;
    autocomplete: AutocompleteOptionCallback;
}

export interface CommandChoicesOption<Type extends string | number = string | number>
extends Omit<OptionBase, 'autocomplete'> {
    type: CommandOptionChoiceResolvableType;
    choices?: ApplicationCommandOptionChoiceData<Type>[];
    autocomplete?: false;
}

export interface CommandNumericOption extends CommandChoicesOption<number> {
    type: CommandOptionNumericResolvableType;
    minValue?: number;
    maxValue?: number;
}

export interface CommandStringOption extends CommandChoicesOption<string> {
    type: OptionType.String;
    minLength?: number;
    maxLength?: number;
}

export interface CommandBooleanOption extends OptionBase {
    type: OptionType.Boolean;
}

export interface CommandSubGroup extends Omit<OptionBase, 'required'> {
    type: OptionType.SubcommandGroup;
    options?: CommandSubCommand[];
}

export interface CommandSubCommand extends Omit<OptionBase, 'required'> {
    type: OptionType.Subcommand;
    options?: CommandOption[];
}

export interface CommandNonOptionsData extends OptionBase {
    type: CommandOptionNonChoiceResolvableType;
}

export interface CommandNonOptions extends OptionBase {
    type: Exclude<CommandOptionNonChoiceResolvableType, OptionType>;
}

export type CommandOption =
    | CommandSubGroup
    | CommandAutocompleteNumericOption
    | CommandAutocompleteStringOption
    | CommandNonOptions
    | CommandChannelOption
    | CommandNumericOption
    | CommandStringOption
    | CommandRoleOption
    | CommandUserOption
    | CommandMentionableOption
    | CommandBooleanOption
    | CommandAttachmentOption
    | CommandSubCommand;

export type OptionOf<T extends OptionType> =
      T extends OptionType.SubcommandGroup ? CommandSubGroup
    : T extends OptionType.Number | OptionType.Integer
        ? CommandNumericOption | CommandAutocompleteNumericOption
    : T extends OptionType.String ? CommandStringOption | CommandAutocompleteStringOption
    : T extends OptionType.Mentionable ? CommandRoleOption | CommandUserOption
    : T extends OptionType.Channel ? CommandChannelOption
    : T extends OptionType.Role ? CommandRoleOption
    : T extends OptionType.User ? CommandUserOption
    : T extends OptionType.Boolean ? CommandBooleanOption
    : T extends OptionType.Attachment ? CommandAttachmentOption
    : T extends OptionType.Subcommand ? CommandSubCommand
    : CommandNonOptions;

/* djs aliases becuz yes */
export { ChatInputCommandInteraction as CommandInteraction } from 'discord.js';