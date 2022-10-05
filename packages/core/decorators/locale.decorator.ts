import { LocaleString } from 'discord.js';

export function locale (locale: LocaleString, description: string) {
  return function ({ constructor: t }) {
    if (!Reflect.has(t, 'command:descriptionLocalizations'))
      Reflect.set(t, 'command:descriptionLocalizations', {});
    
    Reflect.get(t, 'command:descriptionLocalizations')[locale] = description;
  };
}
