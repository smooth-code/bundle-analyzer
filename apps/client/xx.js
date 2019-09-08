const stats = require('./x.json')
var omitDeep = require('omit-deep')

console.log(JSON.stringify(omitDeep(stats, 'source'), null, 2))
