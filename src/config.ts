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
    save(): void {
        writeFileSync(this.path, JSON.stringify(this.config, null, 2))
        console.info(chalk.greenBright('Config saved successfully.'))
    }

    show(): void {
        console.log(JSON.stringify(this.config, null, 2))
    }

    get TOKEN (): string {
        return this.config.TOKEN
    }

    set TOKEN (token: string) {
        this.config.TOKEN = token
    }

    get CLIENT_ID (): string {
        return this.config.CLIENT_ID
    }

    set CLIENT_ID (clientId: string) {
        this.config.CLIENT_ID = clientId
    }

    get GUILDS (): string[] {
        return this.config.GUILDS
    }

    addGuild(guildId: string): void {
        const guilds = new Set([...this.config.GUILDS, guildId])
        this.config.GUILDS = Array.from(guilds)
    }
}

const config = new Config('./config.json')
export const TOKEN = config.TOKEN;
export const CLIENT_ID = config.CLIENT_ID;
export const GUILDS = config.GUILDS;

export default config
