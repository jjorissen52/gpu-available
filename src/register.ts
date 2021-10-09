import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import config, { TOKEN, CLIENT_ID } from './config'

export const register = async (guildId: string) => {
  const commands = [{
    name: 'ping',
    description: 'Replies with Pong!'
  }]; 

  const rest = new REST({ version: '9' }).setToken(TOKEN);

  try {
    console.debug('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationGuildCommands(String(CLIENT_ID), guildId),
      { body: commands },
    );
    console.info('Successfully reloaded application (/) commands.');
    config.addGuild(guildId);
    config.save();
  } catch (error) {
    console.error(error);
  }
}

