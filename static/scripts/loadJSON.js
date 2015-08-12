console.log("load Json!!!");

var populate_articles_Jcdl;
// 异步

$.getJSON("data/topic.json", function (data) {

    console.log(data);
    var populate_topics_Jcdl = function () {
        readTopicsJSON(data);
    };

    $.getJSON("data/article.json", function (data) {

        console.log(data);

        populate_articles_Jcdl = function () {
            readArticlesJSON(data);
        };

        console.log(populate_articles_Jcdl);


        $.getJSON("data/category.json", function (data) {

            console.log(data);
            var populate_cat_data = function () {
                readCat_data(data);
            };

            console.log("hello world!!!");
            $.getJSON("data/topic_category.json", function (data) {

                console.log("yes: access!!!");

                console.log(data);
                var populate_top2cat = function () {
                    readTop2CatJson(data);
                };
                console.log((new Date()).getMilliseconds());

                // on ready

                $("#data_intro").click(function () {
                    window.open('./intro.html');
                    //$("#dataset-popup").show();
                    //$("#selectbox_datasets").show();
                });


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
