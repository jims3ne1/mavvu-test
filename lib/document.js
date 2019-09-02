url = require('url');

function Document(url, res, depth, isCSS = false) {
    this.depth = depth
    this.url = url;
    this.res = res;
    this.size = Buffer.byteLength(this.res)
    this.isCSS = isCSS
}

Document.prototype = {
    constructor: Document,
};

module.exports = Document;