
console.log("load Json!!!");

var populate_articles_Jcdl;
var populate_topics_Jcdl;
var populate_top2cat;
var populate_cat_data;

// 异步

var articles = new Array();
var topics = new Array();
var svg_width;
var svg_height;

var top2cat;
var categories;
var cat_data;

var selected_topic_id = -1;

var setter = new Object(); // set the parameter of viz sketch
var init_mode = "normal";

// Method to draw the topic flow visualization.

var svg;

var textflow;

function drawViz() {

    var margin = {top: 10, right: 1, bottom: 0, left: 10},
        svg_width = 580 - margin.left - margin.right,
        //svg_width = 600 - margin.left - margin.right,
        svg_height = 480 - margin.top - margin.bottom,
        axis_height = 20,
        axis_title_height = 50;

    var width = $("#flow_viz").width();
    //d3.select("#flow_viz").attr("width");
    //data/ModernFamily/Tweet.json
    textflow = d3.layout.textflow()
        .size([(width + margin.left + margin.right), (svg_height + margin.top + margin.bottom)]);
    //textflow.keywordWeight(setter.keywordWeight);

    //.size([1024, 800])
    //.on("word", progress);
    // put topics into textflow
    textflow.topics(topics);

    //.size([svg_width, svg_height+margin.top+margin.bottom]);
    svg = d3.select("#flow_viz")
        .append("svg")
        .attr("class", "textflow")
//	    .attr("width", width + margin.left + margin.right)
        .attr("width", "100%")
        .attr("height", svg_height + margin.top + margin.bottom);

    // visulize svg: the selected element
    svg.call(textflow);
}

function changeMode(topic_mode) {
    //console.log("in changemode");
    //console.log(topic_mode);
    init_mode = topic_mode;
    textflow.mode(topic_mode);
}

function presentTags() {
    //console.log("in presenttags controller");
    // remove all the tags with class tag
    d3.selectAll(".tag").remove();
    textflow.presentTags();

}

function redraw() {
    //console.log("In redraw");
    // console.log(svg);
    if (setter.section != null) {
        //	console.log(setter);
    }

    textflow.section(setter.section);
    textflow.keywordWeight(setter.keywordWeight);
    textflow.topicSize(setter.topicSize);

    /*
     setter.topicSize = topicSize;
     setter.keywordWeight = [minWeight, maxWeight];
     setter.section = [left, right];
     */

    d3.select("#flow_viz").selectAll("path")
        .remove();

    d3.select("#flow_viz").selectAll("text")
        .remove();

    // visulize svg: the selected element
    svg.call(textflow);
    //setter.section

}

// draw the path
function drawVizPath() {
    var margin = {top: 10, right: 1, bottom: 0, left: 10},
        //svg_width = 620 - margin.left - margin.right,
        svg_width = 580 - margin.left - margin.right,
        svg_height = 280 - margin.top - margin.bottom,
        axis_height = 20,
        axis_title_height = 50;

    initDrawChart(topics);
}

/* Formats timestamp for the x-axis given a range*/
//function formatForAxis(start, end) {
//
//    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//    end = end.split(/[/ :]/);
//    start = start.split(/[/ :]/);
//
//    if (end[2] != start[2]) // Years are diff, print month + year
//        return months[start[0] - 1] + " " + start[2].substring(2) + " - " + months(end[0] - 1) + " " + end[2].substring(2);
//    else if (end[0] != start[0]) // Months are diff, print month + day
//        return months[start[0] - 1] + "/" + start[1] + " - " + months[end[0] - 1] + "/" + end[1];
//    else if (end[1] != start[1]) // Days are diff, print day
//        return start[1] + " - " + end[1];
//    else
//        return start[3] + ":" + start[4] + " - " + end[3] + ":" + end[4];
//}


/**
 * Method to read the JSON for articles.
 */
function readArticlesJSON(articles_data) {
    $.each(articles_data, function (i, article) {
        article_tmp = new Article();
        article_tmp.wrap(article);
        articles.push(article_tmp);
    });
}

/**
 * Method to read the JSON for topics.
 */
function readTopicsJSON(topics_data) {
    $.each(topics_data, function (i, topic) {
        topic_tmp = new Topic();
        topic_tmp.wrap(topic);
        topics.push(topic_tmp);
    });
}

/**
 * Method to initially populate the topic list.
 */
function populateTopics() {
    $("#topic_list").empty();
    var count = 0;
    $.each(topics, function (i, topic) {
        addTopic(topic);
        count = count + 1;
    });

    $("#topics_title").text("Topics (" + count + ")");
}

function addTopic(topic) {
    var t = "<li class='topic_card' id='" + topic.id + "'><span>Topic " + topic.id + "</span><span class='topic_summary'>" + topic.getHTMLSummary() + "</span></li>";
    $("#topic_list").append(t);
}

/**
 * Formats timestamp from year-month-day 24h:min:sec
 * to day, month day, year @ hour:minute merdian
 **/
function formatTime(timestamp) {

    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var ts = new Date(timestamp);
    var hour = ts.getHours();
    var mer = "AM";
    if (hour == 0) {
        hour = 12;
    } else if (hour > 12) {
        hour = hour - 12;
        mer = "PM";
    }

    var minute = String(ts.getMinutes());
    if (minute.length < 2) {
        minute = "0" + minute;
    }

    var ts = new Date(timestamp);
    return (ts.getMonth() + 1) + "/" + ts.getDate() + "/" + ts.getFullYear() + " at " + hour + ":" + minute + mer;
}

/**
 * Method to initially populate the tweet list.
 */
function populateArticles(start) {

    // Number of Articles to load at a time
    var totalArticles = Object.keys(articles).length;

    var count = 0;
    $.each(articles, function (i, article) {
        //console.log(article.abstract);
        addArticle(article);
        count = count + 1;
    });

    $("#article_title").text("Article (" + count + ")");

    /*
     // Display show more button if applicable
     if (end < totalArticles+1) {
     var button = $("<center><button id='display_more'>Load More Articles</button></center>");
     button.click(function() {
     $(this).remove();
     populateArticles(end);
     });

     $("#article_list").append(button);
     }
     */
}

function addArticle(article) {
    // Shorten the text field
    //console.log(article);
    //var text = article.abstract.substring(0, 80);
    //if (article.abstract.length > 80) text += "...";
    var t = "<li class='article_card' id='" + article.id + "'><span>Article " + article.id + "</span><span class='article_summary'>" + "<b>Title: </b>" + article.title + "</span><span class='article_summary'>" + "<b>Keywords: </b>" + article.keywords + "</span></li>";
    $("#article_list").append(t);
}

function unhighlightAllTopics() {
    $(".topic_card.selected").each(function () {
        $(this).removeClass("selected");
    });

    unhighlightViz();
}

// unhighlight the viz sketch...
function unhighlightViz() {
    // unhighlight all nodes
    $(".vselected").each(function (key, node) {
        // node.removeClass("vselected");
    });

    $(".nhighlighted").each(function (key, node) {
        // node.removeClass("nhighlighted");
    });

    // unhighlight all edges
    $(".link.highlighted").each(function (key, edge) {
        // edge.removeClass("highlighted");
    });

    // ungrey everything
    //$(".greyed").each(function(key, edge) {
    //	edge.removeClass("greyed");
    //});
}

function highlightTopic(id) {

    console.log("in highligh topics", id);
    unhighlightAllTopics();

    // if card is not in topic list, reset topic list and undo search
    if ($("#" + id + ".topic_card").length <= 0) {
        populateTopics();
        $(".search_clear").click();
    }

    $("#" + id + ".topic_card").addClass("selected");
    // Scroll to the selected topic in the list
    var offset = $("#topic_list").scrollTop() + ($("#" + id + ".topic_card").offset().top - $("#topic_list").offset().top);
    $('html, #topic_list').animate({scrollTop: offset}, 50);

    // Highlight in visualization
    highlightViz(id);
}

function highlightViz(id) {
    // Highlight node
    /*
     $("g #" + id + "> rect").each(function(key, node) {
     node.addClass("vselected");
     });

     // highlight subgraph
     highlightLeftSubgraph(id);
     highlightRightSubgraph(id);
     $("g.node > rect:not(.nhighlighted)").each(function(key, node) {
     if (!node.hasClass("vselected"))
     node.addClass("greyed");
     });
     $("path:not(.highlighted)").each(function(key, edge) {
     edge.addClass("greyed");
     });
     */
}


/**
 * Method to show the topic data when a user selects a specific topic.
 * @param id The id of the specified topic
 */
function showTopicData(id) {

    // if topic is already selected, then do deselect.
    var selected = $("rect.vselected").parent();
    if (selected.length > 0) {
        if (selected[0].__data__.name == id) {
            $("#view_all").click();
            return;
        }
    }


    console.log("to show topic: ", id);
    console.log("the topic is selected: ", selected_topic_id);
    if (id == selected_topic_id) {
        selected_topic_id = -1;
        console.log("yes, the two things are equal");
        populateTopics();
        populateArticles(0);
        //clearArticleData();
        //clearTopicData();
        return;
    }
    selected_topic_id = id;


    // Clear article data
    clearArticleData();

    // Show the word distribution for the topic
    var tmp_topic = new Object();
    // console.log(topics);
    for (id_tmp in topics) {
        if (id_tmp == id) {
            tmp_topic = topics[id_tmp];
            break;
        }
    }

    console.log(tmp_topic);
    showWordsForTopic(tmp_topic);
    // Show the top articles for the topic

    showArticlesForTopic(tmp_topic);

    // Highlight selected topic & its paths in and out
    highlightTopic(id);
}

/**
 * Method to clear topic data for any selected topic.
 * For optimization, first checks that there is a selected topic.
 */
function clearTopicData() {

    // Check that there is a selected topic
    if ($(".selected").length > 0) {
        return;
    }

    // Clear the word distribution
    $("#topic_cloud").remove();

    // Unselect any selected topics
    unhighlightAllTopics();

    // Show all tweets
    $("#topic_list_panel > .panel_name > #view_all").hide();
    $("#article_list").empty();
    populateArticles(-1);
}

/**
 * Method to show the article data when a user selects a specific article.
 * @param id  The id of the specified article
 */
function showArticleData(id) {
    // if article is already selected, deselect it
    if ($(".article_card.selected#" + id).length > 0) {
        clearArticleData();
        return;
    }

    // deselect any other articles
    clearArticleData();

    // highlight selected article
    $(".article_card.selected").each(function () {
        $(this).removeClass("selected");
    });
    $("#" + id + ".article_card").addClass("selected");

    // Show Selected Article information
    showFullArticle(id);
    //showTopicsForArticle(id);
}

function clearArticleData() {
    // end if no tweet is selected
    if ($(".article_card.selected").length == 0)
        return;

    // reset the tweet
    var id = $(".article_card.selected").attr("id");
    var article = new Object(); //articles[id];
    for (i in articles) {
        article = articles[i];
        if (article.id == id) {
            break;
        }
    }
    // console.log(article);
    $(".article_card.selected").replaceWith(addArticle(article));
}

/**
 * Method to show the articles for the selected topic.
 *
 * Empties the articles list and shows only those articles related to the selected topic.
 * The displayed articles are ordered by P(articles|topic) where P(article|topic) ~ P(topic|article)
 * @param topic  The topic object
 */
function showArticlesForTopic(topic) {
    //var articlesToShow = topic.topic2doc;

    // order the tweets by P(tweet|topic)
    var sortable = [];
    for (var article in topic.topic2doc) {
        sortable.push([article, topic.topic2doc[article]]);
    }
    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });
    // Show the tweets
    $("#article_list").empty();
    var articlesToAdd = "";
    var count = 0;
    for (var pair in sortable) {
        count = count + 1;
        // []
        // console.log(sortable[pair][0]);
        var article_tmp = new Object();
        for (i in articles) {
            article_tmp = articles[i];
            if (article_tmp.id == sortable[pair][0]) {
                break;
            }
        }
        addArticle(article_tmp);
    }

    $("#article_list_panel > #article_list_title").text("Article: Topic " + topic.id + " (" + count + ")");
    $("#topic_list_panel > .panel_name > #view_all").show();
}


/**
 * Method to display the word distribution for the selected topic.
 *
 * Displays a word cloud representing the distribution of P(word|topic)
 * @param topic  The topic object for which to show the word cloud
 */
function showWordsForTopic(topic) {
    $("#topic_cloud").remove();
    $("li.topic_card#" + topic.id).append("<div id=\"topic_cloud\"></div>");

    var data = new Array();
    // console.log(topic.getWordlist());
    $.each(topic.getWordlist(), function (word, prob) {
        data.push({text: word, value: prob});
    });

    data.sort(function (a, b) {
        return b.value - a.value;
    });
    var w = 250,
        h = 20,
        padding = 5;

    var chart = d3.select("#topic_cloud").append("svg")
        .attr("class", "chart")
        .attr("width", w)
        .attr("height", (h + padding) * data.length);

    // word labels
    chart.selectAll("text")
        .data(data)
        .enter().append("text")
        .text(function (d) {
            return d.text;
        })
        .attr("y", function (d, i) {
            return i * (h + padding) + 15;
        })
        .attr("text-anchor", "end");

    var texts = chart.selectAll("text")[0];
    var word_axis = 0;
    chart.selectAll("text")[0].forEach(function (text) {
        if (word_axis < text.getBBox().width) {
            word_axis = text.getBBox().width;
        }
    });

    chart.selectAll("text")
        .attr("x", word_axis);

    // bar charts
    var maxVal = data.reduce(function (a, b) {
        return Math.max(a, b.value);
    }, 0);

    var chartScale = d3.scale.linear().domain([0, maxVal]).range([0, w - word_axis - padding]);
    chart.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", word_axis + padding)
        .attr("y", function (d, i) {
            return i * (h + padding);
        })
        .attr("width", function (d) {
            return chartScale(d.value);
        })
        .attr("height", h)
        .attr("fill", "orange");

    chart.selectAll("text")
        .data(data)
        .enter().append("text")
        .text(function (d) {
            return String(d.value);
        })
        .attr("x", function (d) {
            chartScale(d.value);
        })
        .attr("y", function (d, i) {
            return i * (h + padding) + 15;
        })
        .attr("text-anchor", "end");
}


/**
 * Method to display the full tweet in the tweet panel
 * @param id the id of the tweet to display
 */
function showFullArticle(id) {
    // console.log(id);
    $(".article_card.selected#" + id).empty();
    var article = new Object();//= articles[id];
    for (i in articles) {
        article = articles[i];
        if (article.id == id) {
            //console.log(article);
            break;
        }
    }
    // console.log(article.abstract);
    var t = "<li class='article_card' id='" + article.id + "'><span>Article " + article.id + "</span><span class='article_summary'>" + "<b>Title: </b>" + article.title + "</span><span class='article_summary'>" + "<b>Authors: </b>" + article.author + "</span><span class='article_summary'>" + "<b>Keywords: </b>" + article.keywords + "</span><span class='article_summary'>" + "<b>Categories: </b>" + article.categories + "</span><span class='article_summary'>" + "<b>Abstract: </b>" + article.abstract + "</span></li>";
    $(".article_card.selected#" + id).html(t);
}


/**
 * Method to clear the interface
 */
function clear() {

    articles = new Array();
    $("#article_list").empty();
    $("#topic_list").empty();
    $("#flow_viz").empty();

    // Clear searchbox
    $("input#topic_searchbox").val("");
    // Hide topic subpanel in tweet box/topic boxes
    clearArticleData();
    clearTopicData();
}

/**
 * Method to populate the visualization with the selected dataset.
 * @param selected_data  the selected data set
 */
function populateVisualization(selected_data) {
    // Show the loading image
    $("#loader").show();
    // Clear the interface
    clear();
    var idToName = {"chi": "CHI Conference", "sandy": "Sandy and NJ", "jcdl": "JCDL"};

    // Populate the interface with the selected data set
    // let default selected_data be jcdl


    //while (typeof(populate_articles_Jcdl) == "undefined") {
    if(typeof(populate_articles_Jcdl) == "undefined"){

        console.log("undefined");
    }
    //}

    console.log("its here");
    selected_data = "jcdl";
    if (selected_data === "jcdl") {
        populate_articles_Jcdl();
        // populate_articles_Jcdl();
        populate_topics_Jcdl();
    }

    // Populate the visualization
    drawViz();

    ////////////////drawVizPath();
    // Populate the topic list - need to figure out how to handle topics at different bin slices
    populateTopics();

    // Populate the tweet list
    populateArticles(0);

    // Change labels for title
    $('#dataset_name').text(' | ' + idToName[selected_data]);

    // Hide the loading image
    $("#loader").hide();

    // Filters pane--set topics to present and keyword to display
    // set the segment to display
    // whith means we shoud set the present setter here
    $(function () {
        // topic number set
        var minSize = 0;
        var maxSize = 6;
        $("#topic_size_slider").slider({
            //range: true,
            range: "min",
            min: minSize,
            max: maxSize,
            value: 6,
            //animate:true,
            //values: [ minSize, maxSize ],

            slide: function (event, ui) {
                $("#topic_size").text(ui.value);
                $("#topic_size_slider").val("$" + ui.value);
                //filterViz();
            },
            change: function (event, ui) {
                $("#topic_size").text(ui.value);
                $("#topic_size_slider").val("$" + ui.value);
                //filterViz();
            }
        });
        $("#topic_size")
            .text($("#topic_size_slider").slider("value"));
        // keyword weight set
        var minSize = 1;
        var maxSize = 40;
        var size1, size2;
        $("#keyword_weight_slider").slider({
            range: true,
            min: minSize,
            max: maxSize,
            values: [minSize, maxSize],
            slide: function (event, ui) {
                $("#keyword_weight")
                    .text(ui.values[0] + " - " + ui.values[1]);
                //filterViz();
            },
            change: function (event, ui) {
                $("#keyword_weight")
                    .text(ui.values[0] + " - " + ui.values[1]);
                //filterViz();
            }
        });
        var size = $("#keyword_weight_slider").slider("option", "values");
        // console.log(size);
        $("#keyword_weight")
            .text(size[0] + " - " + size[1]);
        //alert("hello period")
        // periods section
        var timebase = 2008;
        var minSize = 0;
        var maxSize = 5;
        var time1, time2;
        $("#period_section_slider").slider({
            range: true,
            min: minSize,
            max: maxSize,
            values: [minSize, maxSize],
            slide: function (event, ui) {
                time1 = timebase + ui.values[0];
                time2 = timebase + ui.values[1];
                $("#period_section").text(time1 + " - " + time2);
                //filterViz();
            },
            change: function (event, ui) {
                time1 = timebase + ui.values[0];
                time2 = timebase + ui.values[1];
                $("#period_section").text(time1 + " - " + time2);
                //filterViz();
            }
        });
        time1 = timebase + $("#period_section_slider").slider("values", 0);
        time2 = timebase + $("#period_section_slider").slider("values", 1);
        $("#period_section").text(time1 + " - " + time2);
        /*
         // topic type checkboxes
         if ($(":checked").length < 5) {
         $('input:checkbox:not(:checked)').attr("checked","true");
         showAllNodesAndEdges();
         }
         $('.checkall').click(function () {
         $(this).parents('fieldset:eq(0)').find(':checkbox').attr('checked', this.checked);
         });
         $('input[type=checkbox]').on("click", filterViz);
         */
    });

    /*
     $('.type_option').on("click",function(e) {
     var type = e.currentTarget.classList[0];
     if (type=="all")
     return;
     var $box = $('input[type=checkbox][value='+type+']');
     $box.attr("checked",!$box.attr("checked"));
     filterViz();
     })
     */
}


// change the viz with the filter
function filterViz() {
    // $('.search_clear').click();
    // showAllNodesAndEdges();

    var topicSize = $("#topic_size_slider").slider("value");
    setter.topicSize = topicSize;

    var minWeight = $("#keyword_weight_slider").slider("values")[0];
    var maxWeight = $("#keyword_weight_slider").slider("values")[1];
    setter.keywordWeight = [minWeight, maxWeight];

    var leftSection = $("#period_section_slider").slider("values")[0];
    var rightSection = $("#period_section_slider").slider("values")[1];
    setter.section = [leftSection, rightSection];

    redraw();
}


function resetFilters() {
    $("#topic_size_slider").slider("value", max);
    $("input[type=checkbox]:not(:checked)").attr("checked", "yes");
    $("#keyword_weight_slider").slider("values", [$("#keyword_weight_slider")
        .slider("option", "min"), $("#keyword_weight_slider")
        .slider("option", "max")]);
    $("#period_section_slider").slider("values", [$("#period_section_slider")
        .slider("option", "min"), $("#period_section_slider")
        .slider("option", "max")]);
    populateTopics();
    $("#reset_filters").hide();
}

// present the topic2category bar chart and the multi-layer chart.
function populateCategories(topic_id) {

    // first, rm all the category tree that render last time.

    console.log("hello world");
    // d3.select("#path_viz").html("");

    populate_top2cat();
    populate_cat_data();

    //console.log(top2cat);
    //console.log(cat_data)
//  console.log(d3.select("#path_viz"));
    categories = d3.layout.categories()
        .top2cat(top2cat)
        .top_id(topic_id)
        .cat_data(cat_data)
        .cat_id("")
        .show();
}


function readTop2CatJson(topic2category) {
    top2cat = topic2category;
}

function readCat_data(data) {
    cat_data = data;
}

$.getJSON("data/topic.json", function (data) {

    console.log(data);
    populate_topics_Jcdl = function () {
        readTopicsJSON(data);
    };

    $.getJSON("data/article.json", function (data) {

        //console.log(data);

        populate_articles_Jcdl = function () {
            readArticlesJSON(data);
        };

        //console.log(populate_articles_Jcdl);


        $.getJSON("data/category.json", function (data) {

            //console.log(data);
            populate_cat_data = function () {
                readCat_data(data);
            };

            //console.log("hello world!!!");
            $.getJSON("data/topic_category.json", function (data) {

                //console.log("yes: access!!!");

                //console.log(data);
                populate_top2cat = function () {
                    readTop2CatJson(data);
                };
                //console.log((new Date()).getMilliseconds());

                // on ready


                /*
                 $("#data_selector").click(function() {
                 $("#dataset-popup").show();
                 $("#selectbox_datasets").show();
                 });

                 $("#popup_data_selector").menu({
                 select: function(event, ui) {
                 var selection = ui.item.context.id;
                 if (selection == "load_new")
                 return;
                 $("#dataset-popup").hide();
                 $("#selectbox_datasets").hide();
                 populateVisualization(selection);
                 }});
                 */
                $("#dataset-popup").hide();
                $("#selectbox_datasets").hide();
                populateVisualization(null);
                // Select handler for the about box
                $("#about").click(function () {
                    $("#dataset-popup").show();
                    $("#about-popup").show();
                });

                // Close about box
                $("#close_about").click(function () {
                    $("#dataset-popup").hide();
                    $("#about-popup").hide();
                });

                $("#tag_present").click(function () {
                    //alert("hello");
                    //console.log("hello tag_present");
                    // present the tags in the flows
                    //filterViz();
                    if (init_mode == "normal") {
                        filterViz();
                    } else {
                        presentTags();
                    }
                });

                $("#button_reset").click(function () {
                    // reset == refreash
                    console.log("will refresh");
                    location.reload();
                });

                // Close data selector
                $("#close_select").click(function () {
                    $("#dataset-popup").hide();
                    $("#selectbox_datasets").hide();
                });

                $("#close_about").show();
                $("#close_select").show();

                $("#view_all").click(function () {
                    // if there is stuff in the search box, rehighlight (this will take care of unselecting topic too)
                    liveSearch();
                });

                $("#reset_filters").click(resetFilters);
                $('input#topic_searchbox').keyup(liveSearch)
                    .wrap('<span class=\"search_box\"></span>')
                    .after('<img src="images/search_clear.png" alt="" / class=\"search_clear\" style=\"display:none;\">');

                $('.search_clear').click(function () {
                    $(this).parent().find('input').val('');
                    liveSearch();
                });

                // to show/hide "Search for word..." prompt
                $('input[type=text][title]').each(function (i) {
                    $(this).addClass('input-prompt-' + i);
                    var promptSpan = $('<span class="input-prompt"/>');
                    $(promptSpan).attr('id', 'input-prompt-' + i);
                    $(promptSpan).append($(this).attr('title'));
                    $(promptSpan).click(function () {
                        $(this).hide();
                        $('.' + $(this).attr('id')).focus();
                    });
                    if ($(this).val() != '') {
                        $(promptSpan).hide();
                    }
                    $(this).before(promptSpan);
                    $(this).focus(function () {
                        $('#input-prompt-' + i).hide();
                    });
                    $(this).blur(function () {
                        if ($(this).val() == '') {
                            $('#input-prompt-' + i).show();
                        }
                    });
                });

                $(".topic_mode")
                    .on("click", function () {
                        var topic_mode = $(".topic_mode:checked").val();
                        //console.log(topic_mode);
                        changeMode(topic_mode);
                    });

                // Add click handler for article list
                $("#article_list").delegate(".article_card", "click", function () {
                    // Show the article data
                    var id = $(this).attr("id");
                    showArticleData(id);
                });

                $("#topic_list").delegate(".topic_card", "click", function () {
                    var id = $(this).attr("id");
                    showTopicData(id);
                });


            });

        });
    });

});
