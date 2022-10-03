import { LocalizationMap } from 'discord.js';
import { OptionType } from '../../enums';

export interface BaseOptions<T extends OptionType> {
    type: T;
    name: string;
    nameLocalizations?: LocalizationMap;
    description: string;
    descriptionLocalizations?: LocalizationMap;
    required?: boolean;
    autocomplete?: never;
}
