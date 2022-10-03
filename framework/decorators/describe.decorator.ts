export function describe (description: string) {
  return function ({ constructor: t }, _, __) {
    Reflect.set(t, 'command:description', description);
  };
}
