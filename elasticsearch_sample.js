var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'logging.ipex.cz:9200',
    //log: 'trace'
});

/*
client.search({
 //  index: 'logstash-2017.02.24',
    body: {
        query: {
            query_string: {
                query: 'cervenka'
            }
        }
    }
}).then(function (resp) {
    var hits = resp.hits.hits;
    console.log(JSON.stringify(resp));
}, function (err) {
    console.trace(err.message);
});
*/

client.info({

/*
    body: {
        query: {
            query_string: {
                query: 'cervenka'
            },
            term: {
                severity: 'info'
            }
        }
    }
*/


}).then(function (resp) {
    var hits = resp.hits.hits;
    console.log(JSON.stringify(resp));
}, function (err) {
    console.trace(err.message);
});