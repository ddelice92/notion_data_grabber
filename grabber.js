import * as cheerio from 'cheerio';
import * as fs from 'fs';

const $ = cheerio.load(fs.readFileSync('(8) Bike Frame.html'));
const tableOutput = $(".notion-table-view-cell span").text();

function organizeTable(table) {
    var temp = "";
    for(let i = 0; i < table.length; i++) {
        temp += table.charAt(i);
        if(temp == 'FLNS' || temp)
    }
}