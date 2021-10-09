import { readFileSync, writeFileSync, existsSync, PathLike } from 'fs';
import chalk from 'chalk';

export type ConfigType = {
    TOKEN: string,
    CLIENT_ID: string,
    GUILDS: string[],
}


export class Config {
    private path: PathLike;
    private config: ConfigType;
    constructor(path: string) {
        this.path = path
        this.config = existsSync(path) ? JSON.parse(readFileSync(path, 'utf-8')) : {
            TOKEN: "",
            CLIENT_ID: 0,
            GUILDS: []
        }
    }
    save() {
        writeFileSync(this.path, JSON.stringify(this.config, null, 2))
        console.info(chalk.greenBright('Config saved successfully.'))
    }

    show() {
        console.log(JSON.stringify(this.config, null, 2))
    }

    get TOKEN () {
        return this.config.TOKEN
    }

    get CLIENT_ID (): string {
        return this.config.CLIENT_ID
    }

    get GUILDS () {
        return this.config.GUILDS
    }

    set TOKEN (token: string) {
        this.config.TOKEN = token
    }

    set CLIENT_ID (clientId: string) {
        this.config.CLIENT_ID = clientId
    }

    addGuild(guildId: string) {
        const guilds = new Set([...this.config.GUILDS, guildId])
        this.config.GUILDS = Array.from(guilds)
    }
}

const config = new Config('./config.json')
export const TOKEN = config.TOKEN;
export const CLIENT_ID = config.CLIENT_ID;
export const GUILDS = config.GUILDS;

export default config
