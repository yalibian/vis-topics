/**
 *
 * Created by bialy on 8/4/15.
 */

var get_ID =  function (time_stamp) {
    $.getJSON("/get-ip", function (data) {

        //console.log("-------------------");
        console.log(data);
        console.log(data.ip_address);
        //con
        //console.log("-------------------");
        var ID =  time_stamp + data_ipaddress;
        return data.ip_address + time_stamp;
    })
}
