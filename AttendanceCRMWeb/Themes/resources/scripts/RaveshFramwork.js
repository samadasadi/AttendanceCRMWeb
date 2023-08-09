function RV(tagName) {
    function RaveshElem(tagName) {
        var self = this;
        var elem;
        if (tagName.indexOf('<') == 0) {
            tagName = tagName.replace('<', '').replace('>', '').toLowerCase();
            if (['svg', 'circle', 'rect', 'path'].indexOf(tagName) != -1) {
                elem = document.createElementNS('http://www.w3.org/2000/svg', tagName);
            } else {
                elem = document.createElement(tagName);
            }
        } else {
            elem = document.querySelector(tagName);
        }

        self[0] = elem;
        self.css = function (cssList) { for (css in cssList) { elem.style[css] = cssList[css]; } return self; };
        self.attr = function (attrList) { for (attr in attrList) { elem.setAttribute(attr, attrList[attr]); } return self; };
        self.appendChild = function () { for (var i = 0; i <= arguments.length - 1; i++) { elem.appendChild(arguments[i]) } return self; };
        self.append = function () { for (var i = 0; i <= arguments.length - 1; i++) { if (arguments[i]) arguments[i].appendTo(elem); } return self; };
        self.appendTo = function (parentNode) { parentNode.appendChild(elem); return self; };
        self.prepend = function (node) { if (node[0].nodeType === 1) { elem.insertBefore(node[0], elem.firstChild); } }
        self.before = function (node) { elem.parentNode.insertBefore(node[0], elem); }
        self.empty = function () { while (elem.firstChild) { elem.removeChild(elem.firstChild); } return self; };
        self.hide = function () { elem.style.display = 'none'; return self; };
        self.show = function () { elem.style.display = 'block'; return self; };
        self.toggle = function (enable) { if (enable) self.show(); else self.hide(); return self; };
        self.addClass = function (classNames) { var arrClassNames = classNames.split(' '); for (i in arrClassNames) { elem.classList.add(arrClassNames[i]); } return self; };
        self.removeClass = function (className) { elem.classList.remove(className); return self; };
        self.toggleClass = function (className, enable) { if (enable) self.addClass(className); else self.removeClass(className); return self; };
        self.hasClass = function (className) { className = " " + className + " "; if ((" " + elem.className + " ").replace(/[\n\t\r]/g, " ").indexOf(className) > -1) { return true; } return false; }
        self.text = function (text) { self.empty().appendChild(document.createTextNode(text)); return self; };
        self.html = function (html) { elem.innerHTML = html; return self; };
        self.val = function (text) { if (text != null) { elem.value = text; return self; } else { return elem.value; } }
        self.remove = function () { elem.remove(); return self; }

        self.click = function (listener) { if (listener) { elem.onclick = listener; } else { elem.click(); } return self; };
        self.change = function (listener) { if (listener) { elem.onchange = listener; } else { elem.onchange(); } return self; };
        self.keydown = function (listener) { elem.onkeydown = listener; return self; };
        self.keyup = function (listener) { elem.onkeyup = listener; return self; };
        self.bind = function (eventName, callback) { var arrEventNames = eventName.split(' '); for (i in arrEventNames) { elem.addEventListener(arrEventNames[i], callback); } };
    }
    return new RaveshElem(tagName);
}

RV.each = function (object, callback) {
    for (name in object) {
        if (callback.call(object[name], name, object[name]) === false) {
            break;
        }
    }
}

RV.grep = function (elems, callback, inv) {
    var ret = [], retVal;
    inv = !!inv;
    for (var i = 0, length = elems.length; i < length; i++) {
        retVal = !!callback(elems[i], i);
        if (inv !== retVal) {
            ret.push(elems[i]);
        }
    }
    return ret;
}

RV.extend = function (defaults, options) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};
