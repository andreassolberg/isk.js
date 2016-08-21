var fs = require('fs');
var ISK = require('./ISK').ISK;


// var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
// console.log(config);
var b = new ISK();
b.getData(2016, 7, 10)
    .then(function(data) {
        console.log("--- data ");
        console.log(data);

    })
    .catch(function(err) {
        console.error("---- ERROR ----");
        console.error(err.stack);
    });
