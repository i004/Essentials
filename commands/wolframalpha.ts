import { option, OptionType, CommandInteraction, Command } from "../framework";
import { limitLength, WolframAlpha } from "../util";

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
        return limitLength(await WolframAlpha.result(i.options.getString('query')), 300);
    }
}