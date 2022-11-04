import { PermissionResolvable } from 'discord.js';

export function permissions (permissions: PermissionResolvable) {
  return function ({ constructor: t }) {
    Reflect.set(t, 'command:defaultMemberPermissions', permissions);
  };
}
