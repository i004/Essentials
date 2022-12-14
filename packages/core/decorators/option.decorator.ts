import { OptionType } from "../enums";
import {
  AutocompleteOptionCallback
} from "../interfaces/autocomplete-callback.interface";
import { OptionOf } from "../interfaces/option-of";

export function option <T extends OptionType> (
  type: T,
  name: string,
  data?: Partial<
    Omit<OptionOf<T>, 'name' | 'type' | 'autocomplete'> & {
      autocomplete: AutocompleteOptionCallback
    }
  >
) {
  return function ({ constructor: t }) {
    if (!Reflect.has(t, 'command:options'))
      Reflect.set(t, 'command:options', []);
        
    if (data.autocomplete) {
      if (!Reflect.has(t, 'command:autocomplete'))
        Reflect.set(t, 'command:autocomplete', {});

      Reflect.get(t, 'command:autocomplete')[name] = data.autocomplete;
    }

    Reflect.get(t, 'command:options').push({
      type,
      name,
      description: 'No description provided',
      required: (type === OptionType.Subcommand
                 || type === OptionType.SubcommandGroup) ? undefined : true,
      nameLocalizations: null,
      descriptionLocalizations: null,
      ...(data || {}),
      autocomplete: !!data.autocomplete || undefined
    });
  };
}
