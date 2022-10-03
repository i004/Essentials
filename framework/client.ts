import { Client as dClient, ClientOptions } from "discord.js";
import { _buttons, _events } from "./module";
import { InteractionHandler } from './handlers';
import { CommandManager } from './managers';

export default class Client extends dClient {

    private readonly commands: CommandManager;

    constructor (options: ClientOptions) {
        super(options);

        this.commands = new CommandManager(this.application.commands);

        this.subscribeHandlers();
        this.subscribeEvents();
    }


    private subscribeHandlers (): void {
        const interactionHandler = new InteractionHandler(this.commands);
        this.on('interactionCreate', interactionHandler.handle.bind(interactionHandler));
    }

    private subscribeEvents (): void {
        for (const event in _events) {
            const fn = _events[event];
            this.on(event, fn.bind(fn));
        }
    }
}