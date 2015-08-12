/**
 * Author: Yali Bian
 * Mail: bianyali@hotmail.com
 * Executes once the DOM is fully loaded
 */

$(document).ready(function () {


    $("#create-vis-1").click(function(){
        $("#upload-1").show();
    });

    // Select handler for the dataset selector
    $("#data_intro").click(function() {
        //window.open('./intro.html');
        $("#dataset-popup").show();
        $("#selectbox_datasets").show();
    });

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
    $("#dataset-popup").hide();
    $("#selectbox_datasets").hide();


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

});