import { ClientEvents } from "discord.js";


// TODO: scan from commands
export const _buttons = [];
export const _events = {};

// TODO: move to decorators
export function button (id: string) {
  return function (_, __, descriptor: PropertyDescriptor) {
    _buttons.push({
      id,
      regex: new RegExp(
        `^${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\\{\\}/g, '(.+?)')}$`
      ),
      trigger: descriptor.value
    });
  };
}

// TODO: move to decorators
export function on (event: keyof ClientEvents) { 
  return function (_, __, descriptor: PropertyDescriptor) {
    if (!_events[event])
      _events[event] = [];

    _events[event].push(descriptor.value);
  };
}
