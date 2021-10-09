import chalk from 'chalk';
import { Client, Intents } from 'discord.js';
import { TOKEN } from './config';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });



export const serve = () => {
    client.on('ready', () => {
        if (!client?.user) return console.error(chalk.red('Client was somehow null.'))
        console.log(chalk.cyanBright(`Logged in as ${client.user.tag}!`));
    });

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
        }
    });

    client.login(TOKEN);
}