export function describe (description: string) {
  return function ({ constructor: t }) {
    Reflect.set(t, 'command:description', description);
  };
}
