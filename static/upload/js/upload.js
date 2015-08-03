/**
 *
 * Created by bialy on 7/30/15.
 */

function uploadAndSubmit() {

    var form = document.forms["demoForm"];

    if (form["file"].files.length > 0) {

        var timestamp = Date.parse(new Date());
        // 设置一个唯一的id
        //console.log(form);
        // try sending

        reader = new FileReader();
        reader.onloadstart = function () {
            //console.log("onloadstart");
            document.getElementById("bytesTotal").textContent = file.size;
        };

        reader.onprogress = function (p) {
            //console.log("onprogress");
            document.getElementById("bytesRead").textContent = p.loaded;
        };

        reader.onload = function () {
            //console.log("load complete");
        };

        reader.onloadend = function () {
            if (reader.error) {
                console.log(reader.error);
            } else {
                document.getElementById("bytesRead").textContent = file.size;
                var xhr = new XMLHttpRequest();
                //xhr.open(/* method */ "POST", /* target url */ "/upload-files?fileName=" + file.name /*, async, default to true */);
                //xhr.open(/* method */ "POST", /* target url */ "/upload-files");
                console.log(i);
                //console.log(reader.file_name());
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

        files_len = form["file"].files.length;
        for (i=0; i<files_len && ; i++) {

            file = form["file"].files[i];
            //console.log(i);

            //console.log(form["file"].files);
            file = form["file"].files[i];
            //console.log(file.name);
            //console.log(file);
            reader.readAsBinaryString(file);
        }
    }
    else {
        alert("Please choose a file.");
    }
}

