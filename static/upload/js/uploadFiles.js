

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
                        //xhr.open(/* method */ "POST", /* target url */ "/upload-files?fileName=" + file.name /*, async, default to true */);
                        //xhr.open(/* method */ "POST", /* target url */ "/upload-files");
                        //console.log(i);
                        //console.log(reader.file_name());
                        console.log(file.name);
                        console.log(reader.result);
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

    }
    else {
        alert("Please choose a file.");
    }
}

