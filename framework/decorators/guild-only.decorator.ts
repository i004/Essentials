export function guildOnly ({ constructor: t }, _, __) {
    Reflect.set(t, 'command:dmPermission', false);
}