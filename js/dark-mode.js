function getModeCookie(c) {
    var a = document.cookie.split(";");
    for (var d = 0; d < a.length; d++) {
        var b = a[d].split("=");
        var e = b[0].trim();
        if (e == c) {
            return b[1]
        }
    }
}

function setModeCookie(c, d) {
    var b = new Date();
    var a = 10;
    b.setTime(b.getTime() + a * 24 * 60 * 60 * 1000);
    document.cookie = c + "=" + d + ";expires=" + b.toGMTString() + ";path=/"
}

function adddarkcss() {
    var a = $("head");
    a.append('<link rel="stylesheet" href="https://axu.nos-eastchina1.126.net/dark-mode.css">')
}

function removedarkcss() {
    var b = document.getElementsByTagName("link");
    for (var a = b.length; a >= 0; a--) {
        if (b[a] && b[a].getAttribute("href") != null && b[a].getAttribute("href").indexOf("https://axu.nos-eastchina1.126.net/dark-mode.css") != -1) {
            b[a].parentNode.removeChild(b[a])
        }
    }
}

function bedark() {
    var a = getModeCookie("status");
    if (a == "dark") {
        adddarkcss()
    }
}
bedark();

function changemode() {
    var a = getModeCookie("status");
    if (a == "dark") {
        removedarkcss();
        setModeCookie("status", "light")
    } else {
        adddarkcss();
        setModeCookie("status", "dark")
    }
};