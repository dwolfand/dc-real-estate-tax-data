var csvParser = require('csv-parser'),
    fs = require('fs'),
    request = require('sync-request'),
    cheerio = require('cheerio');

var inputFile = './output.csv';
var outputFile = 'output_filtered.csv';

var logger = fs.createWriteStream(outputFile, {
  flags: 'a' // 'a' means appending (old data will be preserved)
})
logger.write('ssl,address,owner,neighborhood,sub_neighborhood,use_code,sale_price,recordation_date,2016_Assessment\n');
fs.createReadStream(inputFile)
    .pipe(csvParser())
    .on('data', function(d) {
        try {
            if (d.neighborhood === 'OLD CITY II'
                && d.use_code !== '18' && d.use_code !== '14'
                && d.owner.split(' ').length <= 3
                && !d.owner.includes('ASSOCIATION')
                && !d.owner.includes(' LLC')
                && !d.owner.includes(' INC')
                && !d.owner.includes('L L C')
                && !d.owner.includes('CORPORATION')
                && !d.owner.includes('INSTITUTION')
                && !d.owner.includes(' CHURCH')
                && !d.owner.includes('COMPANY')
                && !d.owner.includes('COMMUNITY')
                && !d.owner.includes(' COUNCIL')
                && !d.owner.includes(' CLUB')
                && !d.owner.includes('EMBASSY')
                && !d.owner.includes('REPUBLIC')
                && !d.owner.includes('FOUNDATION')
                && !d.owner.includes(' CORP')
                && !d.owner.includes(' ASSOC')
                && !d.owner.includes(' CORP')
                && !d.owner.includes('GOVERNMENT')
                && !d.owner.includes('COMMONWEALTH')
                && !d.owner.includes('PARTNERSHIP')
                && !d.owner.includes('REALTY')
                && !d.owner.includes('INTERNATIONAL')
                && !d.owner.includes('EMPLOYEES')
                && !d.owner.includes(' LTD')
                && !d.owner.includes('ENTERPRISES')
                && !d.owner.includes('REAL ESTATE')
                && !d.owner.includes('TRUTEES')
                && !d.owner.includes(' TRUST')
                && !d.owner.includes('-TRUST')
                && !d.owner.includes('DISTRICT OF COLUMBIA')
                && !d.owner.includes('UNITED STATES OF AMERICA')
                && !d.owner.includes(' UNIT ') //No person has UNIT in it
                ) {
                logger.write(''
                    +d.ssl + ','
                    +d.address + ','
                    +'"'+d.owner+'",'
                    +d.neighborhood + ','
                    +d.sub_neighborhood + ','
                    +d.use_code + ',"'
                    +d.sale_price+'",'
                    +d.recordation_date + ',"'
                    +d['2016_Assessment']+'",\n');
            }
        } catch(e) {
            console.log(d, e);
        }
    })
    .on('end', function() {
        logger.end();
    });
