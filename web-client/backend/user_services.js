
function get_current_user() {
    var name = "username=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function user_sign_in_as(username){
    // Other sign in procedures need to occur here as well.
    // Return false if user is not authenticated
    var cookieStr = "username=" + username + "; path=/;";
    document.cookie = cookieStr;
    return true;
}

function user_sign_out() {
    // Other things need to happen as well, such as notifying server of sign out.
    // Cookies are deleted by setting some arbitrary past date, which is really weird, but oh well...
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}