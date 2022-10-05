/* eslint-disable no-console */
import { Client, Intent } from "@essentials/core";
import { token } from './config.json';
import { promisify } from 'util';
import * as commands from './commands';

const client = new Client({
  intents: [ Intent.Guilds ],
  allowedMentions: { parse: [] }
});
client.on('ready', async () => {
  // FIX: I'm not sure if this will work
  await client.registerCommands(Object.values(commands));    
})
client.login(token);


// TODO: custom logger
process.on('uncaughtException', (err) => console.error(err));
process.on('unhandledRejection', (err) => console.error(err));
