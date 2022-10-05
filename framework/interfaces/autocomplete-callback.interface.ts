import {
  ApplicationCommandOptionChoiceData,
  AutocompleteFocusedOption,
  Awaitable
} from "discord.js";

export type AutocompleteOptionCallback
  = (focused: AutocompleteFocusedOption)
  => Awaitable<ApplicationCommandOptionChoiceData[]>;
