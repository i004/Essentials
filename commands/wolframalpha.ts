import { Command, CommandInteraction, OptionType, option } from "../framework";
import { WolframAlpha, limitLength } from "../util";

export default class Wolfram implements Command {
  @option(OptionType.Subcommand, 'alpha', {
    description: 'Wolfram|Alpha Query',
    options: [{
      type: OptionType.String,
      name: 'query',
      description: 'Your query',
      required: true
    }]
  })
  async run (i: CommandInteraction) {
    return limitLength(
      await WolframAlpha.result(i.options.getString('query')),
      300
    );
  }
}