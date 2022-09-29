import { Client, Intent } from "./framework";
import { token } from './config.json';
import { promisify } from 'util';
import glob from 'glob';

declare function require (id: string): any;

void async function () {
    const matches = await promisify(glob)('commands/*.ts');
    const commands = matches.map(x => require(`./${x}`).default);

    new Client({
        intents: [ Intent.Guilds ],
        allowedMentions: { parse: [] }
    })
        .on('ready', () => {
            console.log('Ready!');
        })
        .registerCommands(commands)
        .login(token);
} ()

process.on('uncaughtException', err => console.error(err));
process.on('unhandledRejection', err => console.error(err));