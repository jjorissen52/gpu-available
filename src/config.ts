import { readFileSync, writeFileSync, existsSync, PathLike } from 'fs';
import chalk from 'chalk';
import { isInvalidUrl } from './client';

export type ConfigType = {
    TOKEN: string,
    CLIENT_ID: string,
    GUILDS: string[],
    WATCHING: WatchedItemType[]
}

export type WatchedItemType = {
    user: string,
    url: string,
    name: string,
}


export class Config {
    private path: PathLike;
    private config: ConfigType;
    constructor(path: string) {
        this.path = path
        this.config = {
            TOKEN: "",
            CLIENT_ID: "",
            GUILDS: [],
            WATCHING: [],
        }
        if (existsSync(path)) {
            const parsed = JSON.parse(readFileSync(path, 'utf-8'))
            this.config = { ...this.config, ...parsed }
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

    get WATCHING(): WatchedItemType[] {
        return this.config.WATCHING
    }

    get GUILDS (): string[] {
        return this.config.GUILDS
    }

    addGuild(guildId: string): void {
        const guilds = new Set([...this.config.GUILDS, guildId])
        this.config.GUILDS = Array.from(guilds)
    }

    async addWatch(user: string, url: string, name: string): Promise<string> {
        const alreadyWatching = this.config.WATCHING.findIndex(watch => watch.url === url && watch.user === user)
        if (alreadyWatching !== -1) {
            this.config.WATCHING[alreadyWatching].name = name
            return "Already watching that item! The name has been updated."
        } else {
            const message = await isInvalidUrl(url)
            if(!message) {
                this.config.WATCHING.push({ user, url, name })
            } else {
                return message
            }
        }
        return ""
    }

    removeWatch(user: string, name: string): string {
        const watching = this.config.WATCHING.findIndex(watch => watch.name === name && watch.user === user)
        if (watching !== -1) {
            this.config.WATCHING.splice(watching, 1)
        } else {
            return "You are not watching that item."
        }
        return ""
    }

    getUserWatches(user: string): WatchedItemType[] {
        return this.config.WATCHING.filter(watch => watch.user === user)
    }
}

const config = new Config('./config.json')
export const TOKEN = config.TOKEN;
export const CLIENT_ID = config.CLIENT_ID;
export const GUILDS = config.GUILDS;

export default config
