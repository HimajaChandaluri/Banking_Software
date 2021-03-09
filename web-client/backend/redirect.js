
function redirect_to_site(site_url) {
    window.location.replace(site_url);
}

function get_args_from_url() {
    var queryString = location.search.substring(1);
    return queryString.split("|");
}