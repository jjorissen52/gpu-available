import axios from 'axios';
import chalk from 'chalk';
import { parse } from 'node-html-parser';
import { readFileSync, writeFileSync, existsSync, PathLike } from 'fs';

/**
 * For caching HTML responses to disk during development.
 */
const cache = (file: PathLike, html?: string): string => {
    if (html) { writeFileSync(file, html); return html }
    if (existsSync(file)) return readFileSync(file, 'utf-8')
    return ""
}

const createLinksFor = (origin: string) => (hrefs: string[]): string[] => {
    return hrefs.map(href => `${origin}${href}`)
}

export const bestbuy = async (url: URL, useCache: boolean): Promise<string[]> => {
    const cacheKey = `${url.hostname}.html`
    const getLinks = (html: string): string[] => {
        if (!html) return []
        const createBestBuyLinks = createLinksFor(url.origin)
        const document = parse(html)
        const items = Array.from(document.querySelectorAll('.sku-item'))
        return createBestBuyLinks(items.reduce((accum, item) => {
            if (Array.from(item.querySelectorAll('button')).filter(b => b.innerText === "Add to Cart").length) {
                accum.push(item.querySelector('.sku-header > a').attrs.href)
            }
            return accum
        }, [] as string[]))
    }
    let cached = useCache ? cache(cacheKey) : "";
    if (!cached) {
        const response = await axios.get(url.href)
        if (response.status === 200) {
            cached = useCache ? cache(cacheKey, response.data) : response.data            
        }
    } else {
        console.log(chalk.cyanBright("Using cached results."))
    }
    return getLinks(cached)

}

type FetchResponse = {
   links: string[],
   message: string 
}

export const fetch = async (link: string, cache: boolean): Promise<FetchResponse> => {
    const url = new URL(link)
    let message = ""
    // @ts-ignore
    let func = async (url: URL, useCache: boolean): Promise<string[]> => []
    switch(url.hostname) {
        case 'www.bestbuy.com':
        case 'bestbuy.com': {
            func = bestbuy
            break;
        }
        default: {
            message = `Unsupported site, ${url.hostname}`
            console.error(chalk.red(message))
        }
    }
    return {
        links: await func(url, cache),
        message
    }
}

export const isInvalidUrl = async (link: string): Promise<string> => {
    try {
        const { message } = await fetch(link, false)
        console.log(message)
        return message
    } catch (e) {
        return String(e)
    }
}
