var width = 0,
    height = 0,
	topics;

var yearOffset = 2008;

function initDrawChart(topics) {
	this.width = $("#flow_viz").width();
	this.height = $("#path_viz").height();
	// console.log(width);
	// console.log(height);
	this.topics = topics;
    //selected = d3.map();
    draw();
}

function draw() {
    //null != d3.selectAll("#path_viz") && d3.selectAll("#path_viz").remove();
    //$("#graphHolder").html("");
    
    var margin_rect = {
        top: 20,
        right: 0,
        bottom: 0,
        left: 50
    };
	
    width = width - margin_rect.left - margin_rect.right-0;
    //$("#path_viz").width(width);
    height = height - margin_rect.top - margin_rect.bottom-40;
	//height = 300;
    //$("#path_viz").height(height);
    //console.log(topics);
    var x_scale = d3.scale.linear()
            .domain([yearOffset, yearOffset+topics[0].periods.length-0.75])
            .range([margin_rect.left, width]);
    drawChart(topics, x_scale, "Topic_Probability", "Topic", "Units", width, height, margin_rect);
}


//x_scale == colors
function drawChart(topics, x_scale, y_name, tag_name, tag_unit, chart_width, chart_height, margin_rect) {
	// console.log(chart_width);
	// console.log(chart_height);
    
    var minH = d3.min(topics),
        maxH = d3.max(topics);
	
	// get the max and min weight of each topics in all periods
	var minH = d3.min(topics,
        function(d) {
            return d3.min(d.periods,
                function(d) {
                    return d.weight;
            })
    });
    
    maxH = d3.max(topics,
        function(d) {
            return d3.max(d.periods,
            function(d) {
                return d.weight;
            })
    });
	
    var y_scale = d3.scale
              .linear()
              .domain([minH, maxH+0.03])
              .range([chart_height, 0]),
        colors = d3.scale
              .category10()
              .domain(topics.map(function(d) {
                    return d.id;
              }));
	
	// define the chart property
    var chart = d3.select("#path_viz")
                .append("svg:svg")
                .attr("id", "chart")
                .attr("width", chart_width + margin_rect.left + margin_rect.right)
                .attr("height", chart_height+margin_rect.top + margin_rect.bottom);
                //.attr("transform", "translate(" + margin_rect.left + "," + margin_rect.top + ")");
    var x_axis = make_x_axis(x_scale);
	
	// append the chart width x_axis grid
    chart.append("g")
       .attr("class", "grid")
       .attr("transform", "translate(0," + chart_height + ")")
       .call(make_x_axis(x_scale)
       .tickSize( - chart_height, 0, 0).tickFormat(""));
    chart.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + chart_height + ")")
       .call(x_axis)
       .append("text")
       .attr("x", chart_width / 2)
       .attr("y", 20)
       .attr("dy", "1.5em")
       .style("text-anchor", "end")
       .text("Trend of Topics");

    y_axis = make_y_axis(y_scale);
    chart.append("g")
       .attr("class", "grid")
       .attr("transform", "translate(" + margin_rect.left + ",0)")
       .call(make_y_axis(y_scale).tickSize( - (chart_width - margin_rect.left), 0, 0).tickFormat(""));
    
	chart.append("g")
       .attr("class", "y axis")
       .attr("transform", "translate(" + margin_rect.left + ",10)")
       .call(y_axis);
	/*   .append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -margin_rect.left)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(y_name);
	*/
    var line = d3.svg.line()
              .x(function(d,i) {
                  return x_scale(yearOffset+i);
              })
              .y(function(d) {
                  return y_scale(d.weight);
              })
              .interpolate("cardinal");

    star = chart.selectAll(".topic")
           .data(topics)
           .enter()
           .append("svg:g")
             .attr("class", "topic");
	
	
	// append the topics path into chart
    star.append("svg:path")
       .attr("d",
           function(d) {
               return line(d.periods);
       })
       .attr("id",
           function(d) {
               return d.id;
       })
       .attr("class", "topic")
       .attr("type", "budget")
       .style("stroke",
           function(d) {
               return colors(d.id);
       });
	/*
    star.append("svg:text")
       .attr("transform",
            function(d) {
                return "translate(" + x_scale(d.periods.length) + "," + y_scale(d.periods[d.periods.length - 1].weight) + ")" ;
        })
       .attr("x", 3)
       .attr("dy", ".35em")
       .attr("id",
            function(d) {
                return d.id;
        })
       .attr("class", "topic")
       .style("fill",
            function(d) {
                return colors(d.id);
        })
       .text(function(d) {
            return d.id;
        });
	*/	

    topics.forEach(function(d,i) {
        addPoints(d.id, star, x_scale, y_scale, topics[i], tag_name, tag_unit, colors(d.id));
    })
}


function addPoints(star_id, star, x_scale, y_scale, topic, tag_name, tag_unit, color) {

    star.selectAll("data-point")
        .data(topic.periods)
        .enter()
        .append("svg:circle")
            .attr("class", "data-point")
            .style("opacity", 1)
            .style("stroke", color)
            .attr("cx",
                function(d,i) {
                    return x_scale(yearOffset+i);
            })
            .attr("cy",
                function(d) {
                    return y_scale(d.weight);
            })
            .attr("r",
                function() {
                    return 4;
            });
			//.attr("__data__", function(d){return d.weight;});

    $("svg circle")
        .tipsy({
            gravity: "w",
            html: !0,
            title: function() {
				// console.log(this.__data__.weight);
				a = this.__data__.weight;
				
				var b = d3.round(a,3);
				// console.log(b);
				//this.__data__;
                return "Topic"+topic.id + "<br/>" + tag_name + ": " + b + " " + "%";
            }
        })
}


function selectActors(a) {
    null != a && (selected = d3.map(), a.forEach(function(a) {
        selected.set(a, 1)
    }), drawAllCharts())
}


function chartChange(a) {
    s_star = a;
    initStarpaths()
}


function toggleTrends() {
    showTrends = $("#trend_checkbox").is(":checked") ? !0 : !1;
    drawAllCharts();
}


function make_x_axis(a) {
    return d3.svg.axis()
            .scale(a)
            .orient("bottom")
            .ticks(6)
            .tickFormat(d3.format("0000"));
}

function make_y_axis(a) {
    return d3.svg.axis()
			.scale(a)
			.orient("left")
			.ticks(10);
}
