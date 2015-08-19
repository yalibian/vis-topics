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
            (function (file) {
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
                        xhr.open(/* method */ "POST", /* target url */ "/upload-files?timestamp=" + timestamp + ";file-name=" + file.name);
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


                reader.onload = function (e) {
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
            ID = data.ip_address + timestamp;
            embed_code = "<iframe src='" + "/vis-repo/" + ID + "' width='100%' height='650' frameboader='0'> </iframe>";
            link = "/vis-repo/" + ID;
            //download = "/download/" + ID;
            download = "/download-repo/" + ID;
            $('#preview-embed-link').attr("href", link);

            $('#download-embed-link').attr("href", download+".zip")
                .attr("download", "topic_vis.zip");

            //
            //$('#download-embed-link').on("click", function () {
            //
            //    console.log("In download-test!");
            //    console.log("in blog");
            //    function getBlob(url, callback) {
            //        var xhr = new XMLHttpRequest();
            //        xhr.open("GET", url);
            //        xhr.responseType = "blob";
            //        xhr.onload = function () {
            //            callback(xhr.response);
            //        };
            //        xhr.send(null);
            //    }
            //
            //    getBlob(download, function (response) {
            //        console.log("In getBlob callback");
            //        console.log(response);
            //
            //        // content is the data (a string) you'll write to file.
            //        // filename is a string filename to write to on server side.
            //        // This function uses iFrame as a buffer, it fills it up with your content
            //        // and prompts the user to save it out.
            //        function save_content_to_file(content, filename) {
            //            var dlg = false;
            //            with (document) {
            //                ir = createElement('iframe');
            //                ir.id = 'ifr';
            //                ir.location = 'about.blank';
            //                ir.style.display = 'none';
            //                body.appendChild(ir);
            //                with (getElementById('ifr').contentWindow.document) {
            //                    open("text/plain", "replace");
            //                    //charset = "utf-8";
            //                    write(content);
            //                    close();
            //                    //document.charset = "utf-8";
            //                    dlg = execCommand('SaveAs', false, filename);
            //                }
            //                body.removeChild(ir);
            //            }
            //            return dlg;
            //        }
            //
            //        msg = "I am the president of tautology club.";
            //        save_content_to_file(msg, "~/helloworld");
            //    });
            //
            //
            //    function downloadFile(fileName, content){
            //        var aLink = document.createElement('a');
            //        var blob = new Blob([content]);
            //        var evt = document.createEvent("HTMLEvents");
            //        evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
            //        aLink.download = fileName;
            //        aLink.href = URL.createObjectURL(blob);
            //        aLink.dispatchEvent(evt);
            //    }
            //});


            $('#embed_code').text(embed_code);
            $('.embed-iframe').show();
        });


    }
    else {
        alert("Please choose a file.");
    }
}

