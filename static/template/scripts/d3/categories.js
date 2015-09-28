(function () {

    var cat_data;	//	categories data from json
    var top2cat;	// top 2 cat data from json

    var top_id = 3;
    var cat_id = "";

    var m = [2, 2, 3, 2],
    //w = 673 - m[1] - m[3],
    //w = 750 - m[1] - m[3],
        w = $("#path_viz").width(),
        h = 276 - m[0] - m[2];

    console.log($("#path_viz").width());
    var x = d3.time.scale()
        .range([0, w]);

    var y = d3.scale.linear()
        .range([h / 4, 0]);


    var color = d3.scale.category10();

    var area = d3.svg.area()
        .interpolate("basis")
        .x(function (d) {
            return x(d.x);
        })
        .y0(function (d) {
            return h / 4;
        })
        .y1(function (d) {
            return y(d.y);
        });

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.x);
        })
        .y(function (d) {
            return y(d.y);
        });

    var svg;

    d3.layout.categories = function () {

        //w = $("#path_viz").width();

        function categories() {

            svg = d3.select("#path_viz")
                .html("")
                .append("svg")
                .attr("width", w + m[1] + m[3])
                .attr("height", h + m[0] + m[2]);
            //.attr("transform","translate(" + m[3] + "," + m[0] + ")");

            showCat(top_id, cat_id);
        }

        categories.top2cat = function (x) {
            if (!arguments.length) {
                return top2cat;
            }

            top2cat = x;
            return categories;
        };

        categories.cat_data = function (x) {
            if (!arguments.length) {
                return cat_data;
            }

            cat_data = x;
            return categories;
        };

        categories.show = function () {

            categories();
            return categories;
        };

        categories.cat_id = function (x) {
            cat_id = x;
            return categories;
        };


        categories.top_id = function (x) {
            if (!arguments.length) {
                return top_id;
            }

            top_id = x;
            return categories;
        };

        return categories;
    };

    function showCat() {

        var layers = getLayers(top_id, cat_id);
        //console.log(top_id, cat_id);
        //console.log(layers);
        if (layers.length != 0) {

            svg.selectAll(".area")
                .remove();

            svg.selectAll(".title")
                .remove();

            //layers = layers[]
            // Compute the maximum price per symbol, needed for the y-domain.
            layers.forEach(function (layer) {
                layer.y_max = d3.max(layer, function (d) {
                    return d.y;
                });
                //console.log(layer.y_max);
            });

            // Compute the minimum and maximum date across layers.
            x.domain([
                d3.min(layers, function (layer) {
                    return d3.min(layer, function (d) {
                        return d.x;
                    });
                }),

                d3.max(layers, function (layer) {
                    return d3.max(layer, function (d) {
                        return d.x;
                    });
                })
            ]);


            var layers_sort = layers.sort(function (a, b) {
                //console.log(a.y_max);
                return b.y_max - a.y_max;
            });

            layers = layers_sort.slice(0, 4);
            //console.log(layers);

            svg.selectAll(".area")
                .data(layers)
                .enter()
                .append("path")
                .attr("class", "area")
                .attr()
                .attr("transform", function (d, i) {
                    return "translate(0," + i * (h / 4) + ")";
                })
                .attr("d", function (d) {
                    y.domain([0, d.y_max * 1.25]);
                    return area(d);
                })
                .style("fill", function (d, i) {
                    return color(0);
                    // return d3.rgb(color(0)).darker(layers[0].y_max/d.y_max);
                })
                .style("fill-opacity", function (d, i) {
                    //console.log(d.y_max / layers[0].y_max);
                    return d.y_max / layers[0].y_max * 3.5;
                })
                .on("click", function (d) {

                    //console.log(d.title);

                    // top_id = no change
                    cat_id = d.id;
                    showCat();
                });

            svg.selectAll(".title")
                .data(layers)
                .enter()
                .append("text")
                .attr("class", "title")
                .attr("x", 3)
                .attr("dy", "0em")
                .text(function (d) {
                    return d.title;
                })
                .attr("transform", function (d, i) {
                    return "translate(" + (10) + "," + (i + 0.25) * (h / 4) + ")";
                });


            //svg.append("path")
            //.attr("class", "line")
            //.attr("d", function(d) {
            //y.domain([0, d.y_max]);
            //return line(d);
            //});
            //console.log("hello the showcat has done!");
        } else {
            //alert("no more layer");
        }
    }

    function getLayers(top_id, cat_id) {
        var layers = new Array();
        //console.log(top2cat);
        //console.log(top2cat[top_id]["cat_list"]);

        var catList = getCatList(top2cat[top_id]["cat_list"], cat_id);
        //console.log("catList");
        //console.log(catList);

        var segments = top2cat[top_id]["segments"];
        // console.log(segments);

        for (cat_tmp in catList) {
            // console.log(cat_tmp);

            var layer = new Array();
            var seg_id = 0;
            var x = 0;
            for (seg_id in segments) {

                segment = segments[seg_id];
                //console.log(segment);

                var tmp = getCat(segment, cat_id, cat_tmp);
                //console.log(tmp);
                tmp.x = x;
                layer.push(tmp);
                x = x + 1;
            }

            layer.title = getCatTitle(cat_id + cat_tmp);
            layer.id = cat_id + cat_tmp;
            layers.push(layer);
        }

        //console.log(layers);
        return layers;
    }

    function getCatList(cat, cat_id) {

        if (cat_id.length >= 1) {
            var index = cat_id[0];
            cat_id = cat_id.slice(1, cat_id.length);

            //console.log(index);
            return getCatList(cat[index].cat, cat_id);
        } else {
            return cat;
        }
    }

    function getCat(cat, cat_id, cat_tmp) {
        if (cat_id.length >= 1) {
            var index = cat_id[0];
            cat_id = cat_id.slice(1, cat_id.length);

            //console.log(index);

            return getCat(cat[index].cat, cat_id, cat_tmp);
        } else {
            //console.log(cat);
            //console.log(cat_tmp);
            //console.log(cat[cat_tmp]);

            var tmp = {};
            if (cat[cat_tmp] == undefined) {
                tmp.y = 0;
            } else {
                tmp.y = cat[cat_tmp].weight;
            }
            return tmp;
        }
    }

    function getCatTitle(cat_id) {
        var id_tmp = cat_id.split('').join('.');
        if (id_tmp.length == 1) {
            id_tmp = id_tmp + ".";
        }
        //console.log(id_tmp);
        //console.log(cat_data[id_tmp]);
        return cat_data[id_tmp];
    }

})();


