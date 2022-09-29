import { APIEmbed } from "discord.js";

export class UserError extends Error {
    public readonly embedOptions: APIEmbed;

    constructor (message: string, embedOptions: APIEmbed = {}) {
        super(message);
        this.embedOptions = embedOptions;
    }
}