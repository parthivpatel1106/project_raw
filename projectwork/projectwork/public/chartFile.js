// var fs = require('fs');

// fileBuffer =  fs.readFileSync("./output12.txt");
// to_string = fileBuffer.toString();
// split_lines = to_string.split("\n");
// var numOfLines=(split_lines.length-1)/2;
// console.log(numOfLines)

// var readMe = fs.readFileSync('./modified4.txt', 'utf8').split('\n');
// let countp= 0;

// for(let i = 0; i < readMe.length;i++){
//     if(readMe[i] == 'sentiment:"Postive"'){
//         countp++;
//     }
// }

// console.log(countp);
// let countn=numOfLines-countp
// console.log(countn)

import poscount from "../controllers/auth"
var data = [poscount,3];

var svg = d3.select("svg"),
    width = svg.attr("width"),
    height = svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);

// Generate the pie
var pie = d3.pie();

// Generate the arcs
var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

//Generate groups
var arcs = g.selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc")

//Draw arc paths
arcs.append("path")
    .attr("fill", function(d, i) {
        return color(i);
    })
    .attr("d", arc);