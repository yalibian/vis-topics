

/**
 *
 * Created by bialy on 7/30/15.
 */

function uploadAndSubmit() {

    var form = document.forms["demoForm"];

    if (form["file"].files.length > 0) {

        var timestamp = Date.parse(new Date());

        files = form["file"].files;
        for (var i = 0; i < files.length; i++) { //for multiple files
            (function(file) {
                var name = file.name;
                var reader = new FileReader();

                reader.onloadstart = function () {
                    //console.log("onloadstart");
                    document.getElementById("bytesTotal").textContent = file.size;
                };

                reader.onprogress = function (p) {
                    //console.log("onprogress");
                    document.getElementById("bytesRead").textContent = p.loaded;
                };

                reader.onloadend = function () {
                    if (reader.error) {
                        console.log(reader.error);
                    } else {
                        document.getElementById("bytesRead").textContent = file.size;
                        var xhr = new XMLHttpRequest();
                        console.log(timestamp);
                        xhr.open(/* method */ "POST", /* target url */ "/upload-files?timestamp=" + timestamp+";file-name="+file.name);
                        xhr.overrideMimeType("application/octet-stream");
                        //xhr.sendAsBinary(reader.result);
                        xhr.send(reader.result);

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                if (xhr.status == 200) {
                                    //console.log("upload complete");
                                    console.log("response: " + xhr.responseText);
                                }
                            }
                        }
                    }

                };


                reader.onload = function(e) {
                    // get file content
                    var text = e.target.result;
                    var ul = document.createElement("ul");
                    var li = document.createElement("li");
                    li.innerHTML = name + "____" + text;
                    ul.appendChild(li);
                };

                reader.readAsBinaryString(file);
                //reader.readAsText(file, "UTF-8");
            })(files[i]);
        }


        // pop-out the embed-iframe
        // change the contents of the iframe box
        //console.log(get_ID(timestamp));

        $.getJSON("/get-ip", function (data) {

            //console.log("-------------------");
            ID = data.ip_address + timestamp ;
            embed_code = "<iframe src='" + "/vis-repo/" + ID + "' width='100%' height='650' frameboader='0'> </iframe>";
            link = "/serve/" + ID;
            download = "/download/" + ID;
            $('#preview-embed-link').attr("href", link);
            $('#download-embed-link').attr("href", download);
            $('#embed_code').text( embed_code);
            $('.embed-iframe').show();
        })

    }
    else {
        alert("Please choose a file.");
    }
}

