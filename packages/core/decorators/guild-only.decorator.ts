export function guildOnly ({ constructor: t }) {
  Reflect.set(t, 'command:dmPermission', false);
}