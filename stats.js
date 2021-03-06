var csvParser = require('csv-parser'),
    fs = require('fs');

var sum = 0;
var highest_dollars = 0;
var highest = {};
var ssls = [];
fs.createReadStream('./output.csv')
    .pipe(csvParser())
    .on('data', function(d) {
        try {
            ssls[d.ssl] = true;
            console.log(d.ssl);
            var parsed_assessment = parseFloat(d['2014_assessment'].replace(',', '').replace('$', ''));
            if (!isNaN(parsed_assessment)) {
                sum += parsed_assessment;
                if (parsed_assessment > highest_dollars) {
                    highest_dollars = parsed_assessment;
                    highest = d;
                }
            }
        } catch(e) {
            console.log(d);
        }
    })
    .on('end', function() {
        console.log(highest);
        console.log('#ssls', Object.keys(ssls).length);
        console.log(sum);
    });
