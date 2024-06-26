var enable_site_search = 1;
var find_window_fixed = 1;
var find_window_background = "#07c160";
var find_text_color = "white";
var find_title_color = "white";
var find_window_width = 255;
var find_root_node = null;
var find_start_at_scroll = 1;
var find_timer = 0;
var drag = {
    tempx: '',
    tempy: '',
    isdrag: false
};
var highlights = [];
var find_pointer = -1;
var find_text = '';
var found_highlight_rule = 0;
var found_selected_rule = 0;
document.addEventListener("touchstart", MouseDown, false);
document.addEventListener("touchmove", MouseMove, {
    passive: false
});
document.addEventListener("touchend", MouseUp, false);

function highlight(word, node) {
    if (!node) node = document.body;
    for (node = node.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == 3) {
            var n = node;
            var match_pos = 0; {
                match_pos = n.nodeValue.toLowerCase().indexOf(word.toLowerCase());
                if (match_pos > -1) {
                    var before = n.nodeValue.substr(0, match_pos);
                    var middle = n.nodeValue.substr(match_pos, word.length);
                    var after = document.createTextNode(n.nodeValue.substr(match_pos + word.length));
                    var highlight_span = document.createElement("span");
                    if (found_highlight_rule == 1) highlight_span.className = "highlight";
                    else highlight_span.style.backgroundColor = "yellow";
                    highlight_span.appendChild(document.createTextNode(middle));
                    n.nodeValue = before;
                    n.parentNode.insertBefore(after, n.nextSibling);
                    n.parentNode.insertBefore(highlight_span, n.nextSibling);
                    highlights.push(highlight_span);
                    highlight_span.id = "highlight_span" + highlights.length;
                    node = node.nextSibling
                }
            }
        } else {
            if (node.nodeType == 1 && node.nodeName.match(/textarea|input/i) && node.type.match(/textarea|text|number|search|email|url|tel/i) && !getStyle(node, "display").match(/none/i)) textarea2pre(node);
            else {
                if (node.nodeType == 1 && !getStyle(node, "visibility").match(/hidden/i))
                    if (node.nodeType == 1 && !getStyle(node, "display").match(/none/i)) highlight(word, node)
            }
        }
    }
}

function unhighlight() {
    for (var i = 0; i < highlights.length; i++) {
        var the_text_node = highlights[i].firstChild;
        var parent_node = highlights[i].parentNode;
        if (highlights[i].parentNode) {
            highlights[i].parentNode.replaceChild(the_text_node, highlights[i]);
            if (i == find_pointer) selectElementContents(the_text_node);
            parent_node.normalize();
            normalize(parent_node)
        }
    }
    highlights = [];
    find_pointer = -1
}

function normalize(node) {
    if (!node) {
        return
    }
    if (node.nodeType == 3) {
        while (node.nextSibling && node.nextSibling.nodeType == 3) {
            node.nodeValue += node.nextSibling.nodeValue;
            node.parentNode.removeChild(node.nextSibling)
        }
    } else {
        normalize(node.firstChild)
    }
    normalize(node.nextSibling)
}

function findit(dir) {
    var string = document.getElementById('fwtext').value;
    dir = dir || 1;
    if (enable_site_search && document.getElementById("find_site_search").checked) {
        var url = "https://data.newrank.cn/m/s.html?s=OyowODQ2KTxLQA&k=" + string;
        window.open(url, "coolfind");
        return
    }
    findwindow.style.visibility = 'hidden';
    if (find_text.toLowerCase() == document.getElementById('fwtext').value.toLowerCase() && find_pointer >= 0) {
        if (dir == 1) findnext();
        else findprev()
    } else {
        unhighlight();
        if (string == '') {
            find_msg.innerHTML = "";
            findwindow.style.visibility = 'visible';
            return
        }
        find_text = string;
        if (find_root_node != null) var node = document.getElementById(find_root_node);
        else var node = null;
        highlight(string, node);
        if (highlights.length > 0) {
            find_pointer = -1;
            if (find_start_at_scroll) find_pointer = find_highlight_at_scroll();
            clearSelection();
            if (dir == 1) findnext();
            else findprev()
        } else {
            find_msg.innerHTML = "0 / 0";
            find_pointer = -1
        }
    }
    findwindow.style.visibility = 'visible'
}

function findnext() {
    var current_find;
    if (find_pointer != -1) {
        current_find = highlights[find_pointer];
        if (found_highlight_rule == 1) current_find.className = "highlight";
        else current_find.style.backgroundColor = "yellow"
    }
    find_pointer++;
    if (find_pointer >= highlights.length) find_pointer = 0;
    var display_find = find_pointer + 1;
    find_msg.innerHTML = display_find + " / " + highlights.length;
    current_find = highlights[find_pointer];
    if (found_selected_rule == 1) current_find.className = "find_selected";
    else current_find.style.backgroundColor = "orange";
    setTimeout(function() {
        scrollToPosition(highlights[find_pointer])
    }, 250)
}

function findprev() {
    var current_find;
    if (highlights.length < 1) return;
    if (find_pointer != -1) {
        current_find = highlights[find_pointer];
        if (found_highlight_rule == 1) current_find.className = "highlight";
        else current_find.style.backgroundColor = "yellow"
    }
    find_pointer--;
    if (find_pointer < 0) find_pointer = highlights.length - 1;
    var display_find = find_pointer + 1;
    find_msg.innerHTML = display_find + " / " + highlights.length;
    current_find = highlights[find_pointer];
    if (found_selected_rule == 1) current_find.className = "find_selected";
    else current_find.style.backgroundColor = "orange";
    setTimeout(function() {
        scrollToPosition(highlights[find_pointer])
    }, 250)
}

function checkkey(e) {
    var keycode;
    if (window.event) keycode = window.event.keyCode;
    else keycode = e.which;
    if (keycode == 13) {
        if (window.event && event.srcElement.id.match(/fwtext/i)) event.srcElement.blur();
        else if (e && e.target.id.match(/fwtext/i)) e.target.blur();
        findit()
    } else if (keycode == 27) {
        hide()
    }
}

function show() {
    $("#myRewards").hide();
    $("#bottomSearch").hide();
    $(".menu").show();
    if (!find_window_fixed) findwindow.style.top = (document.body.scrollTop || document.documentElement.scrollTop || 0) + "px";
    var textbox = document.getElementById('fwtext');
    findwindow.style.visibility = 'visible';
    textbox.focus();
    textbox.select();
    textbox.setSelectionRange(0, 9999);
    if (!find_window_fixed) find_timer = setInterval('move_window();', 500);
    document.onkeydown = checkkey
}

function hide() {
    unhighlight();
    $("#myRewards").show();
    findwindow.style.visibility = 'hidden';
    clearTimeout(find_timer);
    document.onkeydown = null;
    var elems = document.getElementsByClassName('menu');
    for (var i = 0; i < elems.length; i += 1) {
        elems[i].style.display = 'none'
    }
    $("#bottomSearch").show()
}

function resettext() {
    if (find_text.toLowerCase() != document.getElementById('fwtext').value.toLowerCase()) unhighlight()
}

function move_window() {
    var fwtop = parseFloat(findwindow.style.top);
    var fwleft = parseFloat(findwindow.style.left);
    var fwheight = parseFloat(findwindow.offsetHeight);
    if (document.documentElement.scrollTop) var current_top = document.documentElement.scrollTop;
    else var current_top = document.body.scrollTop;
    var current_bottom = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) + current_top;
    if (document.documentElement.scrollLeft) var current_left = document.documentElement.scrollLeft;
    else var current_left = document.body.scrollLeft;
    var current_right = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) + current_left;
    if (fwtop < current_top) {
        findwindow.style.top = current_top + 30 + 'px'
    } else if (fwtop > current_bottom - fwheight) {
        findwindow.style.top = current_top + 30 + 'px'
    }
    if (fwleft < current_left || fwleft > current_right) {
        findwindow.style.left = current_left + 'px'
    }
}

function MouseDown(event) {
    if (!event) event = window.event;
    var fobj = event.target || event.srcElement;
    var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (typeof fobj.nodeName != "undefined")
        if (fobj.nodeName.toLowerCase() == "input" || fobj.nodeName.toLowerCase() == "textarea") return true;
    for (fobj; fobj; fobj = fobj.parentNode) {
        if (fobj.className)
            if (String(fobj.className).match(/dragme/i)) break
    }
    if (fobj)
        if (fobj.className.match(/dragme/i)) {
            drag.isdrag = true;
            if (event.type == "touchstart")
                if (event.touches.length == 1) {
                    var touch = event.touches[0];
                    var node = touch.target
                } return true
        }
}

function MouseMove(event) {
    if (drag.isdrag) {
        if (!event) event = window.event;
        var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (event.type == "touchmove")
            if (event.touches.length == 1) {
                var touch = event.touches[0];
                var node = touch.target;
                event.preventDefault();
                event.stopImmediatePropagation()
            } return false
    }
}

function MouseUp() {
    if (drag.isdrag == true) {
        if (drag.tempx == '' && drag.tempy == '') {}
    }
    drag.isdrag = false
}

function isOnScreen(el) {
    var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var scrollBottom = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) + scrollTop;
    var scrollRight = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) + scrollLeft;
    var onScreen = false;
    var rect = el.getBoundingClientRect();
    if (rect.bottom >= 0 && rect.right >= 0 && rect.top <= screenHeight && rect.left <= screenWidth) return true;
    else {
        var distance = Math.min(Math.abs(rect.bottom), Math.abs(rect.right), Math.abs(rect.top - screenHeight), Math.abs(rect.left - screenWidth));
        return -Math.abs(distance)
    }
}

function scrollToPosition(field) {
    var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var scrollBottom = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) + scrollTop;
    var scrollRight = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) + scrollLeft;
    if (field) {
        if (isOnScreen(field) != true) {
            var isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;
            if (isSmoothScrollSupported) {
                field.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                })
            } else {
                field.scrollIntoView(false)
            }
        }
    }
}

function getStyle(el, styleProp) {
    var x = (document.getElementById(el)) ? document.getElementById(el) : el;
    if (x.currentStyle) var y = x.currentStyle[styleProp];
    else if (window.getComputedStyle) var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
    return y
}

function create_div(dleft, dtop, dwidth, dheight) {
    var position = (find_window_fixed) ? "fixed" : "absolute";
    if (document.documentElement.scrollTop) var current_top = document.documentElement.scrollTop;
    else var current_top = document.body.scrollTop;
    if (document.getElementById('findwindow')) {
        findwindow = document.getElementById('findwindow')
    } else {
        findwindow.id = "findwindow";
        findwindow.style.position = position;
        document.body.insertBefore(findwindow, document.body.firstChild);
        findwindow.className = 'findwindow dragme';
        findwindow.style.visibility = 'hidden'
    }
    findwindow.style.backgroundColor = find_window_background;
    findwindow.style.color = find_text_color;
    findwindow.style.width = find_window_width + 'px';
    findwindow.style.borderRadius = '6px';
    findwindow.style.position = 'fixed';
    findwindow.style.bottom = '10px';
    findwindow.style.right = '0px';
    findwindow.style.left = '0px';
    findwindow.style.margin = 'auto';
    findwindow.style.zIndex = 2147483647;
    findwindow.style.fontSize = '12px';
    findwindow.style.overflowX = 'hidden';
    var string = '<div onclick="hide();" class="close" style="text-align: center;width: ' + (20) + 'px;cursor: pointer;position: absolute; top: 8px; right: 6px ; font-size: 14px ;">X</div>\n';
    string += '<div id="window_body" style="padding: 5px;"><form style="margin:0px;" onsubmit="return false;"><input type="search" size="25" maxlength="25" id="fwtext" style="width:90%; font-size:12px;margin: 0 0 4 0;border-color:#FFF;" onchange="resettext();" placeholder="输入关键词后，点击翻页键即可搜索"><input class="button" type="button" value="∧" onclick="this.blur(); findit(2);" title="查找上一个" style="margin-right: 4px;"><input class="button" type="button" value="∨" onclick="this.blur(); findit();" title="查找下一个"> <span id="find_msg"></span>';
    if (enable_site_search) {
        string += ' <label style="font-size: 12px;margin-left: -4px;"><input type="radio" name="search_type" value="page" checked>储物间</label><label style="font-size: 12px;"><input type="radio" name="search_type" value="site" id="find_site_search">公众号文章</label>'
    }
    string += '</form></div>\n';
    findwindow.innerHTML = string;
    var sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
        try {
            var rules = (sheets[i].rules) ? sheets[i].rules : sheets[i].cssRules;
            if (rules != null)
                for (var j = 0; j < rules.length; j++) {
                    if (rules[j].selectorText == '.highlight') found_highlight_rule = 1;
                    else if (rules[j].selectorText == '.find_selected') found_selected_rule = 1
                }
        } catch (error) {
            console.error("Caught Firefox CSS loading error: " + error)
        }
    }
}

function textarea2pre(el) {
    if (el.nextSibling && el.nextSibling.id && el.nextSibling.id.match(/pre_/i)) var pre = el.nextsibling;
    else var pre = document.createElement("pre");
    var the_text = el.value;
    the_text = the_text.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    pre.innerHTML = the_text;
    var completeStyle = "";
    if (typeof getComputedStyle !== 'undefined') {
        completeStyle = window.getComputedStyle(el, null).cssText;
        if (completeStyle != "") pre.style.cssText = completeStyle;
        else {
            var style = window.getComputedStyle(el, null);
            for (var i = 0; i < style.length; i++) {
                completeStyle += style[i] + ": " + style.getPropertyValue(style[i]) + "; "
            }
            pre.style.cssText = completeStyle
        }
    } else if (el.currentStyle) {
        var elStyle = el.currentStyle;
        for (var k in elStyle) {
            completeStyle += k + ":" + elStyle[k] + ";"
        }
        pre.style.border = "1px solid black"
    }
    el.parentNode.insertBefore(pre, el.nextSibling);
    el.onblur = function() {
        this.style.display = "none";
        pre.style.display = "block"
    };
    el.onchange = function() {
        pre.innerHTML = el.value.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
    };
    el.style.display = "none";
    pre.id = "pre_" + highlights.length;
    pre.onclick = function() {
        this.style.display = "none";
        el.style.display = "block";
        el.focus();
        el.click()
    }
}

function selectElementContents(el) {
    if (window.getSelection && document.createRange) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range)
    } else if (document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select()
    }
}
var findwindow = document.createElement("div");
create_div();
var find_msg = document.getElementById('find_msg');

function find_highlight_at_scroll() {
    var scrollTop = window.scrollY || window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0;
    var pointer = -1;
    for (var i = 0; i < highlights.length; i++) {
        if ((highlights[i].getBoundingClientRect().y + scrollTop) > scrollTop) break;
        pointer = i
    }
    return pointer
}

function clearSelection() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges()
    } else if (document.selection) {
        document.selection.empty()
    }
}