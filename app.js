const cheerio = require('cheerio')
const parseCssUrls = require('css-url-parser');
const Spider = require('./lib/spider.js')

options = {
    startingUrl: 'https://altspace.launchaco.com/',
    depth: 2,
    isAssetsIncluded: false
}

const spider = new Spider(options.depth, options.isAssetsIncluded)
spider.load(options.startingUrl, 0, requestHandler)


function requestHandler(doc) {
    const nextDepth = doc.depth + 1
    if (nextDepth > spider.depth) return

    const domain = new URL(doc.url).origin
    let urls = []

    if (doc.isCSS) {
        urls = parseCssUrls(doc.res)
        urls.forEach((url) => {
            if (url && !url.startsWith('http')) {
                if (url.startsWith('..')) {
                    url = url.replace('..', '')
                }
                if (!url.startsWith('/')) {
                    url = `/${url}`
                }
                url = `${domain}${url}`
            }
            spider.load(url, nextDepth, requestHandler)
        })
        return
    }

    const $ = cheerio.load(doc.res)
    const hrefs = $("a")

    hrefs.each((i, element) => {
        let url = $(element).attr('href')
        urls.push(url)
    })

    if (spider.isAssetsIncluded) {
        const srcs = $('img, script, audio') // did not include video

        srcs.each((i, element) => {
            let url = $(element).attr('src')
            urls.push(url)
        })

        const cssLinks = $('link[rel="stylesheet"]')
        cssLinks.each((c, element) => {
            let url = $(element).attr('href')
            urls.push(url)
        })
    }

    urls.forEach((url) => {
        if (url && !url.startsWith('http')) {
            if (!url.startsWith('/')) {
                url = `/${url}`
            }
            url = `${domain}${url}`

        }
        spider.load(url, nextDepth, requestHandler)
    })
}