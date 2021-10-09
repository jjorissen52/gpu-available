#!/usr/bin/env node
import config from './config';
import { register } from './register'
import { serve } from './serve'

import chalk from 'chalk';
import { program } from 'commander';
import { textSync } from 'figlet';


program
    .version('0.0.1')
    .addHelpText('before', `${chalk.red(textSync('gpu-available', { horizontalLayout: 'full' }))}\n\n`)
    .description("CLI for managing the GPU Available bot");

program
    .command('config')
    .description('manage config file')
    .option('--token <token>', 'Discord Bot Token')
    .option('--client-id <client-id>', 'Discord Bot Client Id')
    .action(({ token, clientId }) => {
        if (token) config.TOKEN = token
        if (clientId) config.CLIENT_ID = clientId
        config.save()
    })
    .command('show')
    .description('show contents of config file')
    .action(() => {config.show()});

program
    .command('register <guild>')
    .description("register the bot with a guild")
    .action(register);

program
    .command('serve')
    .description("start the bot")
    .action(serve);

program.parse(process.argv)
