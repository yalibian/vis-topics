(function () {

    var canvas,
        ratio = 1,
        cloudRadians = Math.PI / 180,
        cw = 1 << 11 >> 5,
        ch = 1 << 11;
    var fill = d3.scale.category20b();


    var blue = d3.scale.category10();
    //var deepBlue = d3.rgb(31, 119, 180);
    // #0072C6
    var deepBlue = d3.rgb(129, 207, 251);
    // #5DB2FF
    var lightBlue = d3.rgb(166, 223, 249);

    if (typeof document !== "undefined") {
        canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        canvas.width = (cw << 5) / ratio;
        canvas.height = ch / ratio;
    } else {
        canvas = new Canvas(cw << 5, ch);
    }

    var c = canvas.getContext("2d");
    c.fillStyle = c.strokeStyle = "red";
    c.textAlign = "center";
    ratio = Math.sqrt(c.getImageData(0, 0, 1, 1).data.length >> 2);

    var size,		// the width and length of sketch
        topics,		// the array of topic
        layers,		// every layer of the each topic
        color,
        fisheyeP = -1,
        sketch,
        keywordWeight = [1, 40],
        topicSize,
        section,
        text = cloudText,
        font = cloudFont,
        fontSize = cloudFontSize,
        fontStyle = cloudFontNormal,
        fontWeight = cloudFontNormal,
        padding = cloudPadding,
        event = d3.dispatch("word", "end"),
        mode = "normal",
        svg_textflow;

    var xScale,
        yScale;
    var spiral = archimedeanSpiral,
        timeInterval = Infinity,
        event = d3.dispatch("word", "end"),
        timer = null;
    d3.layout.textflow = function () {
        // set the color
        color = d3.scale.category10();
        // visualize the svg sketch
        function textflow(svg) {
            // sketch = svg;
            svg_textflow = svg;
            //svg.call(zoomListener);
            var svgGroup = svg.append("g");
            sketch = svgGroup;
            section = initSection();
            topicSize = initTopicSize();
            // keywordWeight = initKeywordWeight();
            layers = stackTopics(topics);
            // console.log(layers);
            xScale = d3.scale.linear()
                .domain([0, layers[0].length - 1])
                .range([0, size[0]]);

            yScale = d3.scale.linear()
                .domain([0, 1])
                .range([size[1], 0]);

            // draw the outline of each topic
            var area = d3.svg.area()
                .x(function (d) {
                    return xScale(d.x);
                })
                .y0(function (d) {
                    return yScale(d.y0);
                })
                .y1(function (d) {
                    return yScale(d.y0 + d.y);
                })
                .interpolate("cardinal");

            var flow = svgGroup.selectAll(".flow")
                .data(layers)
                .enter()
                .append("path")
                .attr("class", "flow")
                .attr("d", area)
                .style("fill", function (d, i) {
                    //return color(i);
                    if (i % 2 == 0){
                        return lightBlue;
                    }
                    return deepBlue;

                })
                .style("fill-opacity", 1.0);
                //.style("fill-opacity", 0.2);
            // draw the tag cloud of each topic in each period
            if (timer)
                clearInterval(timer);
            timer = setInterval(tagCloud, 100);
            var cloud = tagCloud();
            //console.log(cloud);

            var tag = svgGroup.selectAll(".tag")
                .data(cloud)
                .enter()
                .append("text")
                .attr("class", "tag")
                .text(function (d) {
                    return d.text;
                })
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                })
                .style("font-size", function (d) {
                    return d.size + "px";
                })
                .style("opacity", 1e-6)
                .transition()
                .duration(1000)
                .style("opacity", 1)
                .style("font-family", function (d) {
                    return d.font;
                })
                .style("fill", function (d) {
                    return d3.rgb("black");
                    //return fill(d.text.toLowerCase());
                });
            changeMode(mode);
        }


        // set position of each word
        function tagCloud() {
            // console.log("-----------------------------------");
            var flag = true;
            var cloud = [];

            var layerLen = layers.length;
            // console.log(layerLen);
            for (var layerCount = 0; layerCount < layerLen; layerCount++) {

                var layer = layers[layerCount],
                    board = boardSprite(layer, size),   //  set the board...
                    bounds = null;
                // console.log(layers);
                //
                var topic_id = layers[layerCount].topic_id;
                var segments = topics[topic_id].periods,
                    segmentLen = layer.length;
                // console.log("segmentLen: "+segmentLen);
                //section
                for (var segmentCount = 0; segmentCount < segmentLen - 1; segmentCount++) {
                    bounds = null;
                    var segId = segmentCount + section[0];
                    // console.log(segId);
                    var words = segments[segId].wordlist,
                        wordLen = words.length,
                        wordCount = -1;
                    //console.log(wordLen);
                    //console.log(words);
                    var data = new Array();
                    for (var word in words) {
                        var d = new Object();
                        d.word = word;
                        d.wordWeight = words[word];

                        d.text = text.call(this, d);
                        d.font = font.call(this, d);
                        d.style = fontStyle.call(this, d);
                        d.weight = fontWeight.call(this, d);
                        d.size = ~~fontSize.call(this, d);
                        d.padding = cloudPadding.call(this, d);
                        data.push(d);
                    }

                    data.sort(function (a, b) {
                        return b.size - a.size;
                    });
                    var wordLen = data.length;
                    var yL = Math.min(layer[segmentCount].y0, layer[segmentCount + 1].y0),
                        yH = Math.max(layer[segmentCount].y0 + layer[segmentCount].y, layer[segmentCount + 1].y0 + layer[segmentCount + 1].y);

                    var x = d3.scale.linear()
                        .domain([0, 2])
                        .range([xScale(segmentCount), xScale(segmentCount + 1)]);

                    var y = d3.scale.linear()
                        .domain([0, 2])
                        .range([yScale(yH), yScale(yL)]);

                    var rect = {};
                    rect.xL = xScale(segmentCount);
                    rect.xH = xScale(segmentCount + 1);
                    rect.yH = yScale(yL);
                    rect.yL = yScale(yH);

                    var start = +new Date,
                        word;
                    while ((++wordCount < wordLen) && (+new Date - start < timeInterval) && timer) {

                        word = data[wordCount];

                        word.x = ~~x(Math.random() + .5);
                        word.y = ~~y(Math.random() + .5);

                        tagSprite(word, data, wordCount);

                        if (word.hasText && place(board, word, bounds, rect)) {
                            event.word(word);
                            cloud.push(word);
                            if (bounds) {
                                cloudBounds(bounds, word);
                            } else {
                                bounds = [{x: word.x + word.x0, y: word.y + word.y0}, {
                                    x: word.x + word.x1,
                                    y: word.y + word.y1
                                }];
                            }
                        }
                    }

                    if (wordCount < wordLen) {
                        flag = false;
                    }

                }
            }

            if (flag == true) {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
                // event.end(tags, bounds);
            }

            return cloud;
        }


        function place(board, tag, bounds, rect) {

            var perimeter = [{x: 0, y: 0}, {x: size[0], y: size[1]}],// unused thing ...
                startX = tag.x,
                startY = tag.y,
                maxDelta = Math.sqrt((rect.xH - rect.xL) * (rect.xH - rect.xL) + (rect.yH - rect.yL) * (rect.yH - rect.yL)),
                s = spiral(size),
                dt = Math.random() < .5 ? 1 : -1,
                t = -dt,
                dxdy,
                dx,
                dy;

            while (dxdy = s(t += dt)) {
                dx = ~~dxdy[0];
                dy = ~~dxdy[1];

                if (Math.min(dx, dy) > maxDelta)
                    break;
                tag.x = startX + dx;
                tag.y = startY + dy;

                if (tag.x + tag.x0 < rect.xL || tag.y + tag.y0 < rect.yL || tag.x + tag.x1 > rect.xH || tag.y + tag.y1 > rect.yH) {
                    continue;
                }

                // TODO only check for collisions within current bounds.
                //  || !bounds
                if (!cloudCollide(tag, board, size[0])) {
                    if (!bounds || collideRects(tag, bounds)) {
                        // alert("In place");
                        var sprite = tag.sprite,
                            w = tag.width >> 5,
                            sw = size[0] >> 5,
                            lx = tag.x - (w << 4),
                            sx = lx & 0x1f,
                            msx = 32 - sx,
                            h = tag.y1 - tag.y0,
                            x = (tag.y + tag.y0) * sw + (lx >> 5),
                            last;

                        for (var j = 0; j < h; j++) {
                            last = 0;
                            for (var i = 0; i <= w; i++) {

                                var left = ((last << (msx - 1)) << 1),
                                    right = i < w ? ( sprite[j * w + i] >>> sx ) : 0;

                                board[x + i] |= ( left | right );
                                last = sprite[j * w + i];
                            }
                            x += sw;
                        }

                        delete tag.sprite;
                        return true;
                    }
                }
            }

            return false;

            function paintSprite(board, size) {

                var w = size[0],
                    h = size[1];

                canvas1 = document.getElementById("paint");

                canvas1.width = size[0];
                canvas1.height = size[1];
                var c2 = canvas1.getContext("2d");
                c2.fillStyle = "green";

                var len = board.length;
                for (var i = 0; i < len; i++) {
                    var arr = getBitArray(board[i]);
                    for (var k = 0; k < 32; k++) {
                        if (arr[k]) {
                            // paint point
                            var y = parseInt(( i * 32 + k ) / size[0]);
                            var x = ( i * 32 + k ) % size[0];
                            c2.rect(x, y, 1, 1);
                        }
                    }
                }
                c2.fill();
            }
        }


        function highLightLayer() {
            removeTags();
            updateLayers();
        }


        function removeTags() {
            sketch.selectAll(".tag")
                .remove();
        }


        function updateLayers() {

            var area = d3.svg.area()
                .x(function (d) {
                    return xScale(d.x);
                })
                .y0(function (d) {
                    return yScale(d.y0);
                })
                .y1(function (d) {
                    return yScale(d.y0 + d.y);
                })
                .interpolate("cardinal");

            var flow = sketch.selectAll(".flow")
                .data(layers)
                .attr("class", "flow")
                .attr("d", area)
                .style("fill", function (d, i) {
                    //return color(i);
                     if (i % 2 == 0){
                        return lightBlue;
                    }
                    return deepBlue;
                })
                .style("fill-opacity", 1.0);
        //.style("fill-opacity", 0.2);
        }

        // we should change all the visual elements splitly to every
        function presentTags() {
            if (timer)
                clearInterval(timer);
            timer = setInterval(tagCloud, 100);
            var cloud = tagCloud();
            console.log(cloud);

            var tag = sketch.selectAll("g.tag")
                .data(cloud)
                .enter()
                .append("text")
                .attr("class", "tag")
                .text(function (d) {
                    return d.text;
                })
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                })
                .style("font-size", function (d) {
                    return d.size + "px";
                })
                .style("opacity", 1e-6)
                .transition()
                .duration(1000)
                .style("opacity", 1)
                .style("font-family", function (d) {
                    return d.font;
                })
                .style("fill", function (d) {
                    //return fill(d.text.toLowerCase());
                    return d3.rgb("black");
                });
        }

        function changeMode() {
            /* get the mode, can make sure which mode now and change the svg mode
             there are five mode here, and normal.order. room. merge fisheye...
             we should change all the visual elements splitly to every mode

             remove all the listeners on the svg
             console.log("in textflow changeMode");
             **/

            removeListener();
            var flow = sketch.selectAll(".flow");
            //console.log(mode);
            switch (mode) {
                case "normal":
                    /*
                     mode NORM has the property: category list when clike the layer; and the category list has property bollows:
                     first: presetn the category tree view second: lick click the pointed layer topic.
                     */
                    // represent the categories of this pointed topic
                    flow.on("click", function (d, i) {
                        //console.log(d.topic_id);
                        showTopicData(d.topic_id);
                        populateCategories(d.topic_id);
                    });
                    break;

                case "order":
                    // console.log(" in order ");
                    // add dragListener
                    flow.call(dragListener);
                    break;
                case "room":
                    //add the roomListener
                    sketch.call(zoomListener);
                    break;
                case "fisheye":
                    // to realize
                    // remove all the mode property and add the fisheyeListener to sketch
                    flow.on("click", function (d, i) {
                        textflow.fisheye(i);
                        //	alert("on--"+i);
                    });
                    break;
                case "category":
                    // represent the categories of this pointed topic
                    flow.on("click", function (d, i) {
                        //console.log(d.topic_id);
                        populateCategories(d.topic_id);
                    });
                    break;
                default:
                    // set as the normal mode
                    // remove all the mode property
                    break;
            }
        }


        function removeListener() {

            // remove all the listener...
            console.log("in removeListener");
            var flow = sketch.selectAll(".flow");
            //console.log(flow)

            // remove click listener--fisheye
            flow.on("click", null);

            // remove drag listener--order
            flow.on("mousedown.drag", null);
            flow.on(".force", null);
            flow.on(".drag", null);
            flow.on(".zoom", null);

            // remove zoom listener  svg_textflow.
            //var everything = d3.selectAll("");
            sketch.on("mousedown.zoom", null)
                .on("dblclick.zoom", null)
                .on("wheel.zoom", null)
                .on("mousewheel.zoom", null)
                .on("mousemove.zoom", null)
                .on("touchstart.zoom", null)
                .on("DOMMouseScroll.zoom", null)
                .on("touchmove.zoom", null)
                .on("touchend.zoom", null);
            //console.log("out removeListener");
        }

        // Define the zoom function for the zoomable tree
        function zoom() {
            sketch.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
        var zoomListener = d3.behavior.zoom().scaleExtent([0.5, 3]).on("zoom", zoom);

        // remove the tag of the sketch and redraw the layers when draged
        function initiateDrag() {
            // console.log("in initial drag");
            //remove tags
            sketch.selectAll(".tag")
                .remove();

            dragStarted = null;
        }

        // Define the drag listeners for drag/drop behaviour of nodes.
        dragListener = d3.behavior.drag()
            .on("dragstart", function (d) {
                dragStarted = true;
                // it's important that we suppress the mouseover event on the node being dragged.
                // Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
                d3.event.sourceEvent.stopPropagation();
            })
            .on("drag", function (d) {
                // d means the (x,y) position

                if (dragStarted) {
                    // var mouse = ;
                    position_start = d3.mouse(this);
                    initiateDrag();
                }

                // if the move lager than half the height of the other layer
                var y_position = yScale.invert(d3.event.y);
                x_position = xScale.invert(d3.event.x);

                //console.log("layers.length: " + layers.length);
                // layer_up and layer_down should be binded with layer_id
                if (d.layer_id <= layers.length - 1 && d.layer_id >= 0) {

                    var paths = $(this).siblings();
                    // console.log(paths);
                    for (var i = 0; i < paths.length; i++) {

                        if (paths[i].__data__.layer_id == (d.layer_id - 1)) {
                            //console.log("In layer_down");
                            layer_down = $(paths[i])[0];
                        }
                        if (paths[i].__data__.layer_id == (d.layer_id + 1)) {
                            //console.log("in Layer_up");
                            layer_up = $(paths[i])[0];
                            // break;
                        }
                    }

                    if (d.layer_id >= layers.length - 1) {
                        var threshold_up = Number.POSITIVE_INFINITY,
                            threshold_down = (d3.max(layer_down.__data__, function (d) {
                                    return d.y0;
                                }) + d3.min(layer_down.__data__, function (d) {
                                    return d.y0 + d.y;
                                })) / 2;

                    } else if (d.layer_id <= 0) {
                        var threshold_up = (d3.max(layer_up.__data__, function (d) {
                                    return d.y0;
                                }) + d3.min(layer_up.__data__, function (d) {
                                    return d.y0 + d.y;
                                })) / 2,
                            threshold_down = Number.NEGATIVE_INFINITY;

                    } else {
                        var threshold_up = (d3.max(layer_up.__data__, function (d) {
                                    return d.y0;
                                }) + d3.min(layer_up.__data__, function (d) {
                                    return d.y0 + d.y;
                                })) / 2,
                            threshold_down = (d3.max(layer_down.__data__, function (d) {
                                    return d.y0;
                                }) + d3.min(layer_down.__data__, function (d) {
                                    return d.y0 + d.y;
                                })) / 2;

                    }

                    // console.log(y_position > threshold_up);
                    if (y_position > threshold_up) {

                        var area = d3.svg.area()
                            .x(function (d) {
                                // console.log(d);
                                return xScale(d.x);
                            })
                            .y0(function (d) {
                                return yScale(d.y0);
                            })
                            .y1(function (d) {
                                return yScale(d.y0 + d.y);
                            })
                            .interpolate("cardinal");

                        var data = layer_up.__data__.map(function (period, i) {
                            period.y0 = d[i].y0;
                            return period;
                        });
                        layer_up.__data__.layer_id--;

                        // i should use data or layer_up.__data__? will it affect the ...
                        d3.select(layer_up)
                            .attr("d", area(data));

                        d.map(function (period, i) {
                            period.y0 = data[i].y0 + data[i].y;
                        });
                        d.layer_id++;

                    }

                    // console.log(y_position < threshold_down);
                    if (y_position < threshold_down) {
                        // move the lower one into a higher place
                        var area = d3.svg.area()
                            .x(function (d) {
                                return xScale(d.x);
                            })
                            .y0(function (d) {
                                return yScale(d.y0);
                            })
                            .y1(function (d) {
                                return yScale(d.y0 + d.y);
                            })
                            .interpolate("cardinal");

                        var data = layer_down.__data__.map(function (period, i) {
                            var tmp = period.y0;
                            period.y0 = d[i].y0 + d[i].y - period.y;
                            d[i].y0 = tmp;
                            return period;
                        });
                        layer_down.__data__.layer_id++;

                        d3.select(layer_down)
                            .attr("d", area(layer_down.__data__));

                        d.layer_id--;
                    }
                }

                var layer_tmp = d3.select(this);
                d3.select(this)
                    .attr("transform", "translate(" + 0 + "," + (d3.event.y - position_start[1]) + ")");

            })
            .on("dragend", function (d) {
                // console.log(d.layer_id);
                d3.select(this)
                    .attr("transform", null);
                // var layer_tmp = d3.select(this);
                var area = d3.svg.area()
                    .x(function (d) {
                        // console.log(d);
                        return xScale(d.x);
                    })
                    .y0(function (d) {
                        return yScale(d.y0);
                    })
                    .y1(function (d) {
                        return yScale(d.y0 + d.y);
                    })
                    .interpolate("cardinal");
                // console.log(d);
                d3.select(this)
                    .attr("d", area(d));

                //endDrag();
            });

        function endDrag() {
            //console.log("in endDrag");
            // redraw the tags...
            // draw the tag cloud of each topic in each period
            // set the layers, cause we has changed the layers sort and height


            if (timer)
                clearInterval(timer);
            timer = setInterval(tagCloud, 100);
            var cloud = tagCloud();
            //console.log(cloud);

            var tag = sketch.selectAll("g.tag")
                .data(cloud)
                .enter()
                .append("text")
                .attr("class", "tag")
                .text(function (d) {
                    return d.text;
                })
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                })
                .style("font-size", function (d) {
                    return d.size + "px";
                })
                .style("opacity", 1e-6)
                .transition()
                .duration(1000)
                .style("opacity", 1)
                .style("font-family", function (d) {
                    return d.font;
                })
                .style("fill", function (d) {
                    //return fill(d.text.toLowerCase());
                    return d3.rgb("black");
                });
        }

        textflow.size = function (x) {
            if (!arguments.length)
                return size;
            size = x;
            // !!! Q, I change the length of the flow.
            //size[0] = x[0] >> 5 << 5;
            size[0] = x[0];

            return textflow;
        };

        // topic
        textflow.topics = function (x) {
            if (!arguments.length) {
                return topics;
            }
            // console.log(topics);
            topics = x;
            return textflow;
        };

        textflow.color = function (x) {
            if (!arguments.length) {
                return color;
            }
            color = x;
            return textflow;
        };

        textflow.keywordWeight = function (x) {
            if (!arguments.length) {
                return keywordWeight;
            }
            keywordWeight = x;
            return textflow;
        };

        // 将指定layer的height增加（2.5倍），减少其他layer的height-25%
        textflow.fisheye = function (x) {
            if (!arguments.length) {
                return fisheyeP;
            }
            // console.log("In fisheye");
            fisheyeP = x;
            setLayerHeight(x);
            highLightLayer();
            textflow.updateViz();
            return textflow;
        };

        textflow.section = function (x) {
            if (!arguments.length) {
                return section;
            }
            section = x;
            return textflow;
        };

        textflow.topicSize = function (x) {
            if (!arguments.length) {
                return section;
            }
            topicSize = x;
            return textflow;
        };

        textflow.mode = function (x) {
            if (!arguments.length) {
                return mode;
            }

            mode = x;
            changeMode();
            return textflow;
        };

        // presentTags
        textflow.presentTags = function () {
            presentTags();
        };

        // we should update the viz sketch when interaction
        textflow.updateViz = function () {

            removeTags();
            updateLayers();
        };

        d3.rebind(textflow, event, "on");
        return textflow;
    };

    function cloudText(d) {
        return d.word;
    }

    function cloudFont() {
        return "serif";
    }

    function cloudFontNormal() {
        return "normal";
    }

    function cloudFontSize(d) {
        var fontSizeScale = d3.scale.linear()
            .domain([0, 0.1]) // the domain of the wordweight is [0.84,1.0]
            .range(keywordWeight);

        return fontSizeScale(d.wordWeight);
    }

    function cloudPadding() {
        return 1;
    }

    // reset the value y and y0
    function setLayerHeight(x) {
        var stack = d3.layout.stack();
        stack(layers.map(function (layer, i) {
            return layer.map(function (d) {
                if (i == x) {
                    d.y = d.y * 4.0;
                } else {
                    d.y = d.y * 1.0;
                }
                // delete the attribute y0
                delete d.y0;
                return d;
            });
        }));
        // console.log(layers);
        var maxHeight = d3.max(layers[topicSize - 1], function (seg) {
            // console.log(seg.y+seg.y0);
            return seg.y + seg.y0;
        });

        layers.map(function (layer) {
            layer.map(function (d) {
                d.y = d.y / maxHeight;
                d.y0 = d.y0 / maxHeight;
            });
        });

        //console.log(layers);
    }


    function setLayerColor(x) {
        // console.log(color(x));
        color[x] = d3.rgb.brighter(color[x]);
        return color[x];
    }

    // trans topics into layers : which present the position of each topic_period point
    function stackTopics(topics) {
        var stack = d3.layout.stack();
        // topicSize = topics.length;
        var layers = stack(topics.slice(0, topicSize).map(function (d) {
            return bumpLayer(d.periods);
        }));

        maxHigh = d3.max(layers[topicSize - 1], function (seg) {
            return seg.y + seg.y0;
        });

        layers.map(function (layer, i) {
            layer.topic_id = i;
            layer.layer_id = i;
            layer.map(function (d) {
                d.y = d.y / maxHigh;
                d.y0 = d.y0 / maxHigh;
                return d;
            });
            return layer;
        });

        return layers;
    }

    function bumpLayer(periods) {
        //alert(periods);
        var temp = periods.map(function (d, i) {
            return {x: i, y: d.weight};
        });
        var arr = new Array();

        // have to related to section
        var left = section[0],
            right = section[1];
        for (var i = left, count = 0; i <= right; i++, count++) {
            var obj_tmp = new Object();
            obj_tmp.x = count;
            if (i == 0) {
                // console.log(parseInt(i)+1);
                //(temp[i].y + temp[parseInt(i) + 1].y) / 2;
                obj_tmp.y = (temp[i].y + temp[i + 1].y) / 2;
            } else {
                obj_tmp.y = (temp[i - 1].y + temp[i].y) / 2;
            }
            arr.push(obj_tmp);
        }

        var obj_tmp = new Object();
        obj_tmp.x = count;
        if (i == temp.length) {
            obj_tmp.y = (temp[temp.length - 1].y + temp[temp.length - 2].y) / 2;
        } else {
            obj_tmp.y = (temp[i].y + temp[i - 1].y) / 2;
        }
        arr.push(obj_tmp);

        return arr;
    }

    //set the default section
    function initSection() {
        // console.log(topics);
        if (section == null) {
            return [0, topics[0].periods.length - 1];
        }
        return section;
    }

    function initTopicSize() {
        if (topicSize == null) {
            return topics.length;
        }
        return topicSize;
    }

    function boardSprite(layer, size) {

        var xScale = d3.scale.linear()
            .domain([0, layer.length - 1])
            .range([0, size[0]]);

        var yScale = d3.scale.linear()
            .domain([0, 1])
            .range([size[1], 0]);

        // create a canvas element
        var canvasForBoard;
        if (typeof document !== "undefined") {
            canvasForBoard = document.createElement("canvas");
            canvasForBoard.width = size[0] / ratio;
            canvasForBoard.height = size[1] / ratio;
        } else {
            var Canvas = require("canvas");
            canvasForBoard = new Canvas(size[0], size[1]);
        }
        var ctx = canvasForBoard.getContext("2d");

        var pL = [],
            pH = [];

        var segmentLen = layer.length;

        for (var pointCount = 0; pointCount < segmentLen; pointCount++) {

            pL[2 * pointCount] = xScale(layer[pointCount].x);
            pL[2 * pointCount + 1] = yScale(layer[pointCount].y0);

            pH[2 * pointCount] = xScale(layer[segmentLen - pointCount - 1].x);
            pH[2 * pointCount + 1] = yScale(layer[segmentLen - pointCount - 1].y0 + layer[segmentLen - pointCount - 1].y);
        }

        ctx.beginPath();
        ctx.moveTo(pL[0], pL[1]);
        ctx.curve(pL, 0.5, 0, true).stroke();
        ctx.curve(pH, 0.5, 0, true).stroke();
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = "red";
        ctx.fill();

        // get the pixels of the canvas and put it into sprite
        var board = zeroArray((size[0] >> 5) * size[1]);
        var pixels = ctx.getImageData(0, 0, size[0] / ratio, size[1] / ratio).data;

        var w = size[0],
            w32 = w >> 5,
            h = size[1];
        for (var j = 0; j < h; j++) {
            for (var i = 0; i < w; i++) {
                var k = w32 * j + (i >> 5),
                    m = pixels[(j * w + i) << 2] ? 1 << (31 - (i % 32)) : 0;
                board[k] |= m;
            }
        }

        var boardLen = board.length;
        for (var boardCount = 0; boardCount < boardLen; boardCount++) {
            board[boardCount] = ~board[boardCount];
        }

        return board;

        function paintSprite() {

            // console.log("In paint");
            canvas1 = document.getElementById("paint");

            canvas1.width = w;
            canvas1.height = h;
            var c2 = canvas1.getContext("2d");
            c2.fillStyle = "green";

            var len = board.length;
            for (var i = 0; i < len; i++) {
                var arr = getBitArray(board[i]);
                for (var k = 0; k < 32; k++) {
                    if (arr[k]) {
                        // paint point
                        var y = parseInt(( i * 32 + k ) / w);
                        var x = ( i * 32 + k ) % w;
                        c2.rect(x, y, 1, 1);
                    }
                }
            }
            c2.fill();
        }
    }

    function getBitArray(numInt32) {

        var arr = [];
        for (var i = 0; i < 32; i++) {
            arr[31 - i] = numInt32 % 2;
            numInt32 >>= 1;
        }
        return arr;
    }

    function initCanvas() {
        // set the canvas
        var canvas,
            ratio = 1;

        if (typeof document !== "undefined") {
            canvas = document.createElement("canvas");
            canvas.width = 1;
            canvas.height = 1;
            canvas.width = (cw << 5) / ratio;
            canvas.height = ch / ratio;
        } else {
            // Attempt to use node-canvas.
            canvas = new Canvas(cw << 5, ch);
        }

        var c = canvas.getContext("2d");
        c.fillStyle = c.strokeStyle = "red";
        c.textAlign = "center";

        return c;
    }

    // Fetches a monochrome sprite bitmap for the specified text. Load in batches for speed.
    function tagSprite(d, data, di) {

        if (d.sprite)
            return;

        c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);

        var x = 0,
            y = 0,
            maxh = 0,
            n = data.length;

        --di;
        while (++di < n) {

            d = data[di];
            c.save();
            c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;

            var w = c.measureText(d.text + "m").width * ratio,
                h = d.size << 1;

            w = (w + 0x1f) >> 5 << 5;
            if (h > maxh)
                maxh = h;
            if (x + w >= (cw << 5)) {
                x = 0;
                y += maxh;
                maxh = 0;
            }
            if (y + h >= ch)
                break;

            c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
            c.fillText(d.text, 0, 0);

            c.restore();

            d.width = w;
            d.height = h;
            d.xoff = x;
            d.yoff = y;
            d.x1 = w >> 1;
            d.y1 = h >> 1;
            d.x0 = -d.x1;
            d.y0 = -d.y1;
            d.hasText = true;
            x += w;
        }

        var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
            sprite = [];

        while (--di >= 0) {

            d = data[di];

            if (!d.hasText)
                continue;

            var w = d.width,
                w32 = w >> 5,
                h = d.y1 - d.y0,
                p = d.padding;
            // Zero the buffer
            for (var i = 0; i < h * w32; i++)
                sprite[i] = 0;
            x = d.xoff;
            if (x == null)
                return;
            y = d.yoff;

            var seen = 0,
                seenRow = -1;
            for (var j = 0; j < h; j++) {
                for (var i = 0; i < w; i++) {
                    var k = w32 * j + (i >> 5),
                        m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;

                    if (p) {
                        if (j)
                            sprite[k - w32] |= m;

                        if (j < w - 1)
                            sprite[k + w32] |= m;

                        m |= (m << 1) | (m >> 1);
                    }

                    sprite[k] |= m;
                    seen |= m;
                }
                if (seen)
                    seenRow = j;
                else {
                    d.y0++;
                    h--;
                    j--;
                    y++;
                }
            }
            d.y1 = d.y0 + seenRow;
            d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
        }

        function paintSprite(d) {

            canvas1 = document.getElementById("paint");

            canvas1.width = w;
            canvas1.height = h;
            var c2 = canvas1.getContext("2d");
            c2.fillStyle = "green";

            var len = d.sprite.length;
            for (var i = 0; i < len; i++) {
                var arr = getBitArray(d.sprite[i]);
                for (var k = 0; k < 32; k++) {
                    if (arr[k]) {
                        // paint point
                        var y = parseInt(( i * 32 + k ) / d.width);
                        var x = ( i * 32 + k ) % d.width;
                        c2.rect(x, y, 1, 1);
                    }
                }
            }
            c2.fill();
        }
    }

    // Use mask-based collision detection.
    function cloudCollide(tag, board, sw) {
        sw >>= 5;
        var sprite = tag.sprite,
            w = tag.width >> 5,
            lx = tag.x - (w << 4),
            sx = lx & 0x7f,
            msx = 32 - sx,

        // msx = 32 - sx,
            h = tag.y1 - tag.y0,
            x = (tag.y + tag.y0) * sw + (lx >> 5),
            last;

        for (var j = 0; j < h; j++) {
            last = 0;
            for (var i = 0; i <= w; i++) {

                var left = ((last << (msx - 1)) << 1),
                    right = i < w ? (sprite[j * w + i] >>> sx) : 0;

                if (( left | right ) & board[x + i])
                    return true;
                last = sprite[j * w + i];
            }
            x += sw;
        }
        return false;
    }

    function cloudBounds(bounds, d) {

        var b0 = bounds[0],
            b1 = bounds[1];
        if (d.x + d.x0 < b0.x)
            b0.x = d.x + d.x0;

        if (d.y + d.y0 < b0.y)
            b0.y = d.y + d.y0;

        if (d.x + d.x1 > b1.x)
            b1.x = d.x + d.x1;

        if (d.y + d.y1 > b1.y)
            b1.y = d.y + d.y1;

    }

    function collideRects(a, b) {
        return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
    }

    function archimedeanSpiral(size) {
        var e = size[0] / size[1];
        return function (t) {
            return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
        };
    }

    function rectangularSpiral(size) {
        var dy = 4,
            dx = dy * size[0] / size[1],
            x = 0,
            y = 0;
        return function (t) {
            var sign = t < 0 ? -1 : 1;
            // See triangular numbers: T_n = n * (n + 1) / 2.
            switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
                case 0:
                    x += dx;
                    break;
                case 1:
                    y += dy;
                    break;
                case 2:
                    x -= dx;
                    break;
                default:
                    y -= dy;
                    break;
            }
            return [x, y];
        };
    }

    // TODO reuse arrays?
    function zeroArray(n) {
        var a = [],
            i = -1;
        while (++i < n) a[i] = 0;
        return a;
    }

    // Archimedean spiral
    function spiral(size) {
        var e = size[0] / size[1];
        return function (t) {
            return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
        };
    }

})();
