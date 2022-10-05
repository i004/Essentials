import {
  ApplicationCommandAttachmentOption,
  ApplicationCommandAutocompleteNumericOption,
  ApplicationCommandAutocompleteStringOption,
  ApplicationCommandBooleanOption,
  ApplicationCommandChannelOption,
  ApplicationCommandNonOptions,
  ApplicationCommandNumericOption,
  ApplicationCommandRoleOption,
  ApplicationCommandStringOption,
  ApplicationCommandSubCommand,
  ApplicationCommandSubGroup,
  ApplicationCommandUserOption,
} from "discord.js";

import { OptionType } from "../enums";

export type OptionOf<T extends OptionType> =
  T extends OptionType.SubcommandGroup
    ? ApplicationCommandSubGroup
  : T extends OptionType.Number | OptionType.Integer
    ? ApplicationCommandNumericOption | ApplicationCommandAutocompleteNumericOption
  : T extends OptionType.String
    ? ApplicationCommandStringOption | ApplicationCommandAutocompleteStringOption
  : T extends OptionType.Mentionable
    ? ApplicationCommandRoleOption | ApplicationCommandUserOption
  : T extends OptionType.Channel
    ? ApplicationCommandChannelOption
  : T extends OptionType.Role
    ? ApplicationCommandRoleOption
  : T extends OptionType.User
    ? ApplicationCommandUserOption
  : T extends OptionType.Boolean
    ? ApplicationCommandBooleanOption
  : T extends OptionType.Attachment
    ? ApplicationCommandAttachmentOption
  : T extends OptionType.Subcommand
    ? ApplicationCommandSubCommand
  : ApplicationCommandNonOptions;