/* eslint-disable no-console */
import { Client, Intent } from "@essentials/core";
import { ConsoleLogger } from "@essentials/common";
import { token } from './config.json';
import prettyBytes from 'pretty-bytes'
import * as commands from './commands';

const logger = new ConsoleLogger();

const client = new Client({
  intents: [ Intent.Guilds ],
  allowedMentions: { parse: [] }
});

client.on('ready', async () => {
  // FIX: I'm not sure if this will work
  await client.registerCommands(Object.values(commands));
});

client.login(token);


// TODO: custom logger
process.on('uncaughtException', (err) => logger.error(err.toString()));
process.on('unhandledRejection', (err) => logger.error(err.toString()));
