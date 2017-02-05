var csvParser = require('csv-parser'),
    fs = require('fs'),
    request = require('sync-request'),
    cheerio = require('cheerio');

var hasChecked = 0;
var inputFile = './output.csv';
var outputFile = 'output_homestead.csv';

var logger = fs.createWriteStream(outputFile, {
  flags: 'a' // 'a' means appending (old data will be preserved)
})
logger.write('ssl,address,owner,neighborhood,sub_neighborhood,use_code,sale_price,recordation_date,2016_Assessment,homestead,url\n');
fs.createReadStream(inputFile)
    .pipe(csvParser())
    .on('data', function(d) {
        try {
            if (d.neighborhood === 'OLD CITY II') {
                hasChecked = hasChecked + 1;
                let url = 'https://www.taxpayerservicecenter.com/RP_Detail.jsp?ssl=' + encodeURIComponent(d.ssl);
                
                let result = request('GET', url, {
                    headers: {
                        Cookie: 'JSESSIONID=rQMOZwB5942ncFEqb8fbQDm2tWJ5vaxJ3gP0h4DEBHTXMlvQQIDi!-1896073087'
                    }
                });
                let $ = cheerio.load(result.body)
                console.log(d.ssl);
                let thedatas = $('td[colspan="3"]').html();
                let homestead = 'unknown';
                if (thedatas === '** Not receiving the Homestead Deduction '){
                    homestead = 'no';
                }
                if (thedatas === '** Currently receiving the Homestead Deduction*.  '){
                    homestead = 'yes';
                }
                logger.write(''
                    +d.ssl + ','
                    +d.address + ','
                    +'"'+d.owner+'",'
                    +d.neighborhood + ','
                    +d.sub_neighborhood + ','
                    +d.use_code + ',"'
                    +d.sale_price+'",'
                    +d.recordation_date + ',"'
                    +d['2016_Assessment']+'",'
                    +homestead + ','
                    +url + '\n');
            }
        } catch(e) {
            console.log(d, e);
        }
    })
    .on('end', function() {
        logger.end();
    });
