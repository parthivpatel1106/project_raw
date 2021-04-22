const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const f=r
const result = excelToJson({
    source: fs.readFileSync('') // fs.readFileSync return a Buffer
});

fs.writeFileSync('output.json', JSON.stringify(result));
console.log(result);
// result will be an Object containing keys with the same name as the sheets found on the excel file. Each of the keys will have an array of objects where each of them represents a row of the container sheet. e.g. for a excel file that has two sheets ('sheet1', 'sheet2')
