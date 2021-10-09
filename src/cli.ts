#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';
import { textSync } from 'figlet'

import config from './config';
import { register } from './register'
import { serve } from './serve';
import { fetch } from './client';


program
    .version('0.0.1')
    .addHelpText('before', `${chalk.red(textSync('gpu-available', { horizontalLayout: 'full' }))}\n\n`)
    .description("CLI for managing the GPU Available bot");

const configCommand = program
    .command('config')
    .description('manage config file')
    .option('--token <discord-bot-token>')
    .option('--client-id <discord-bot-client-id>')
    .action(({ token, clientId }) => {
        if (token) config.TOKEN = token
        if (clientId) config.CLIENT_ID = clientId
        config.save()
    })

    configCommand
        .command('show')
        .description('show contents of config file')
        .action(() => {config.show()})

const watches = program
    .command('watches')
    .description("manage watches");


    watches
        .command("show <user>")
        .description("get a users existing watches")
        .action((user) => {
            console.log(config.getUserWatches(user))
        });

    watches
        .command('upsert <name> <user> <url>')
        .description("add or update a watch")
        .action((name, user, url) => {
            config.addWatch(user, url, name).then(message => {
                if(message) {
                    return console.log(chalk.red(message))
                } else {
                    console.log(chalk.green("watch added successfully!"))
                }
                config.save()
            })
        })

    watches
        .command('remove <name> <user>')
        .description("remove a watch")
        .action((name, user) => {
            console.log(config.removeWatch(user, name))
            config.save()
        });

    watches
        .command('run')
        .description("run existing watches")
        .option('--user <userId>')
        .action(({ user }) => {
            console.log(user)
        });

program
    .command('register <guild>')
    .description("register the bot with a guild")
    .action(register);

program
    .command('serve')
    .description("start the bot")
    .action(serve);

program
    .command('fetch <url>')
    .description("do a fetch")
    .option('--cache', 'cache results or use existing cached results')
    .action((url, { cache }) => {
        fetch(url, cache)
    });

program.parse(process.argv)
