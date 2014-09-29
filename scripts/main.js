var dataset;

var margin = {top: 10, right: 50, bottom: 20, left: 50},
    width = 1024 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var max,
    scale = 1,
    complete = 0,
    statusText = d3.select("#status");
var textflow = d3.layout.textflow()
//	    	.size([ (width + margin.left + margin.right), (height + margin.bottom + margin.top) ]);
      .size([1024, 800])
      .on("word", progress);

d3.json( "topics.json", function(error, data) {

  textflow.topicTree(data);

  var svg = d3.select("body")
        .append("svg")
        .attr("class", "textflow")
//	      	.attr("width", width + margin.left + margin.right)
        .attr("width", 1024)
        .attr("height", 800);

//        .attr("height", height + margin.bottom + margin.top)
//	      	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  console.log("----mian 0----");

  svg.call(textflow);
  console.log("----mian 1----");
  // d == tag
});

function progress ( d ) {
  statusText.text( ++complete + "/" + max );
}
