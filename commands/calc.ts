import { Command, CommandInteraction, OptionType, describe, option } from "../framework";
import { limitLength, mathjs } from "../util";

export default class Calc implements Command {
    @describe('Evaluate mathematical expression. Supports trigonometry functions, unit conversions etc.')
    @option(OptionType.String, 'expr', {
      description: 'Expression',
      autocomplete: async ({ value }) => {
        if (!value)
          return [];

        return [{
          name: limitLength(await mathjs(value), 100),
          value
        }];
      }
    })
  async run (i: CommandInteraction) {
    return limitLength(await mathjs(i.options.getString('expr')), 200);
  }
}