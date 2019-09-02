const rp = require('request-promise')
const Document = require('./document')

function Spider(depth, isAssetsIncluded) {
    this.depth = depth
    this.isAssetsIncluded = isAssetsIncluded
    this.visited = {}
}

Spider.prototype = {
    constructor: Spider,

    load: async function (url, currentDepth, done) {

        try {
            if (this.visited[url]) {
                return;
            }
            const response = await rp({ uri: url, resolveWithFullResponse: true })
            const isCSS = response.headers['content-type'].includes('css')
            let doc = new Document(url, response.body, currentDepth, isCSS)
            this.visited[doc.url] = true
            console.log(`Depth: ${currentDepth}/${this.depth} Fetched ${url}  File Size: ${doc.size} bytes`)
            done.call(this, doc)
        } catch (err) { }
    }
}

module.exports = Spider



