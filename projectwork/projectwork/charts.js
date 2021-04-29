var fs = require('fs');

fileBuffer =  fs.readFileSync("./output12.txt");
to_string = fileBuffer.toString();
split_lines = to_string.split("\n");
var numOfLines=(split_lines.length-1)/2;
console.log(numOfLines)

var readMe = fs.readFileSync('./modified4.txt', 'utf8').split('\n');
let countp= 0;

for(let i = 0; i < readMe.length;i++){
    if(readMe[i] == 'sentiment:"Postive"'){
        countp++;
    }
}

console.log(countp);
let countn=numOfLines-countp
console.log(countn)






