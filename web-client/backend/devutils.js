
function check_cached_server_info() {
    var keys = ["hostname=", "port="];
    var serverInfo = {"hostname":"", "port":""};
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        for (var j = 0; j < keys.length; j++){
            if (c.indexOf(keys[j]) == 0) {
                serverInfo[keys[j].slice(0, -1)] = c.substring(keys[j].length, c.length);
            }
        }
    }
    return serverInfo;
}