/* eslint-disable no-console */ // todo: make a logger
import { Client, Intent } from "./framework";
import { token } from './config.json';
import { promisify } from 'util';
import glob from 'glob';

declare function require (id: string): any;

void async function () {
  const matches = await promisify(glob)('commands/*.ts');
  const commands = matches.map((x) => require(`./${x}`).default);

  const client = new Client({
    intents: [ Intent.Guilds ],
    allowedMentions: { parse: [] }
  });
  client.on('ready', async () => {
    await client.registerCommands(commands);    
  })
  client.login(token);
} ();

process.on('uncaughtException', (err) => console.error(err));
process.on('unhandledRejection', (err) => console.error(err));