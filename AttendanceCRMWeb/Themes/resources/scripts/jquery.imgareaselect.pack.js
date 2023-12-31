(function ($) {
    var _1 = Math.abs,
        _2 = Math.max,
        _3 = Math.min,
        _4 = Math.round;

    function _5() {
        return $("<div/>")
    };
    $.imgAreaSelect = function (_6, _7) {
        var _8 = $(_6),
            _9, _a = _5(),
            _b = _5(),
            _c = _5().add(_5()).add(_5()).add(_5()),
            _d = _5().add(_5()).add(_5()).add(_5()),
            _e = $([]),
            _f, _10, top, _11 = {
                left: 0,
                top: 0
            },
            _12, _13, _14, _15 = {
                left: 0,
                top: 0
            },
            _16 = 0,
            _17 = "absolute",
            _18, _19, _1a, _1b, _1c, _1d, _1e, _1f, _20, _21, _22, x1, y1, x2, y2, _23 = {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                width: 0,
                height: 0
            },
            _24 = document.documentElement,
            ua = navigator.userAgent,
            $p, d, i, o, w, h, _25;

        function _26(x) {
            return x + _11.left - _15.left
        };

        function _27(y) {
            return y + _11.top - _15.top
        };

        function _28(x) {
            return x - _11.left + _15.left
        };

        function _29(y) {
            return y - _11.top + _15.top
        };

        function evX(_2a) {
            return _2a.pageX - _15.left
        };

        function evY(_2b) {
            return _2b.pageY - _15.top
        };

        function _2c(_2d) {
            var sx = _2d || _1a,
                sy = _2d || _1b;
            return {
                x1: _4(_23.x1 * sx),
                y1: _4(_23.y1 * sy),
                x2: _4(_23.x2 * sx),
                y2: _4(_23.y2 * sy),
                width: _4(_23.x2 * sx) - _4(_23.x1 * sx),
                height: _4(_23.y2 * sy) - _4(_23.y1 * sy)
            }
        };

        function _2e(x1, y1, x2, y2, _2f) {
            var sx = _2f || _1a,
                sy = _2f || _1b;
            _23 = {
                x1: _4(x1 / sx || 0),
                y1: _4(y1 / sy || 0),
                x2: _4(x2 / sx || 0),
                y2: _4(y2 / sy || 0)
            };
            _23.width = _23.x2 - _23.x1;
            _23.height = _23.y2 - _23.y1
        };

        function _30() {
            if (!_9 || !_8.width()) {
                return
            }
            _11 = {
                left: _4(_8.offset().left),
                top: _4(_8.offset().top)
            };
            _12 = _8.innerWidth();
            _13 = _8.innerHeight();
            _11.top += (_8.outerHeight() - _13) >> 1;
            _11.left += (_8.outerWidth() - _12) >> 1;
            _1d = _4(_7.minWidth / _1a) || 0;
            _1e = _4(_7.minHeight / _1b) || 0;
            _1f = _4(_3(_7.maxWidth / _1a || 1 << 24, _12));
            _20 = _4(_3(_7.maxHeight / _1b || 1 << 24, _13));
            if ($().jquery == "1.3.2" && _17 == "fixed" && !_24["getBoundingClientRect"]) {
                _11.top += _2(document.body.scrollTop, _24.scrollTop);
                _11.left += _2(document.body.scrollLeft, _24.scrollLeft)
            }
            _15 = /absolute|relative/.test(_14.css("position")) ? {
                left: _4(_14.offset().left) - _14.scrollLeft(),
                top: _4(_14.offset().top) - _14.scrollTop()
            } : _17 == "fixed" ? {
                left: $(document).scrollLeft(),
                top: $(document).scrollTop()
            } : {
                left: 0,
                top: 0
            };
            _10 = _26(0);
            top = _27(0);
            if (_23.x2 > _12 || _23.y2 > _13) {
                _31()
            }
        };

        function _32(_33) {
            if (!_22) {
                return
            }
            _a.css({
                left: _26(_23.x1),
                top: _27(_23.y1)
            }).add(_b).width(w = _23.width).height(h = _23.height);
            _b.add(_c).add(_e).css({
                left: 0,
                top: 0
            });
            _c.width(_2(w - _c.outerWidth() + _c.innerWidth(), 0)).height(_2(h - _c.outerHeight() + _c.innerHeight(), 0));
            $(_d[0]).css({
                left: _10,
                top: top,
                width: _23.x1,
                height: _13
            });
            $(_d[1]).css({
                left: _10 + _23.x1,
                top: top,
                width: w,
                height: _23.y1
            });
            $(_d[2]).css({
                left: _10 + _23.x2,
                top: top,
                width: _12 - _23.x2,
                height: _13
            });
            $(_d[3]).css({
                left: _10 + _23.x1,
                top: top + _23.y2,
                width: w,
                height: _13 - _23.y2
            });
            w -= _e.outerWidth();
            h -= _e.outerHeight();
            switch (_e.length) {
                case 8:
                    $(_e[4]).css({
                        left: w >> 1
                    });
                    $(_e[5]).css({
                        left: w,
                        top: h >> 1
                    });
                    $(_e[6]).css({
                        left: w >> 1,
                        top: h
                    });
                    $(_e[7]).css({
                        top: h >> 1
                    });
                case 4:
                    _e.slice(1, 3).css({
                        left: w
                    });
                    _e.slice(2, 4).css({
                        top: h
                    })
            }
            if (_33 !== false) {
                if ($.imgAreaSelect.onKeyPress != _34) {
                    $(document).unbind($.imgAreaSelect.keyPress, $.imgAreaSelect.onKeyPress)
                }
                if (_7.keys) {
                    $(document)[$.imgAreaSelect.keyPress]($.imgAreaSelect.onKeyPress = _34)
                }
            }
            if (_35 && _c.outerWidth() - _c.innerWidth() == 2) {
                _c.css("margin", 0);
                setTimeout(function () {
                    _c.css("margin", "auto")
                }, 0)
            }
        };

        function _36(_37) {
            _30();
            _32(_37);
            x1 = _26(_23.x1);
            y1 = _27(_23.y1);
            x2 = _26(_23.x2);
            y2 = _27(_23.y2)
        };

        function _38(_39, fn) {
            _7.fadeSpeed ? _39.fadeOut(_7.fadeSpeed, fn) : _39.hide()
        };

        function _3a(_3b) {
            var x = _28(evX(_3b)) - _23.x1,
                y = _29(evY(_3b)) - _23.y1;
            if (!_25) {
                _30();
                _25 = true;
                _a.one("mouseout", function () {
                    _25 = false
                })
            }
            _1c = "";
            if (_7.resizable) {
                if (y <= _7.resizeMargin) {
                    _1c = "n"
                } else {
                    if (y >= _23.height - _7.resizeMargin) {
                        _1c = "s"
                    }
                }
                if (x <= _7.resizeMargin) {
                    _1c += "w"
                } else {
                    if (x >= _23.width - _7.resizeMargin) {
                        _1c += "e"
                    }
                }
            }
            _a.css("cursor", _1c ? _1c + "-resize" : _7.movable ? "move" : "");
            if (_f) {
                _f.toggle()
            }
        };

        function _3c(_3d) {
            $("body").css("cursor", "");
            if (_7.autoHide || _23.width * _23.height == 0) {
                _38(_a.add(_d), function () {
                    $(this).hide()
                })
            }
            $(document).unbind("mousemove", _3e);
            _a.mousemove(_3a);
            _7.onSelectEnd(_6, _2c())
        };

        function _3f(_40) {
            if (_40.which != 1) {
                return false
            }
            _30();
            if (_1c) {
                $("body").css("cursor", _1c + "-resize");
                x1 = _26(_23[/w/.test(_1c) ? "x2" : "x1"]);
                y1 = _27(_23[/n/.test(_1c) ? "y2" : "y1"]);
                $(document).mousemove(_3e).one("mouseup", _3c);
                _a.unbind("mousemove", _3a)
            } else {
                if (_7.movable) {
                    _18 = _10 + _23.x1 - evX(_40);
                    _19 = top + _23.y1 - evY(_40);
                    _a.unbind("mousemove", _3a);
                    $(document).mousemove(_41).one("mouseup", function () {
                        _7.onSelectEnd(_6, _2c());
                        $(document).unbind("mousemove", _41);
                        _a.mousemove(_3a)
                    })
                } else {
                    _8.mousedown(_40)
                }
            }
            return false
        };

        function _42(_43) {
            if (_21) {
                if (_43) {
                    x2 = _2(_10, _3(_10 + _12, x1 + _1(y2 - y1) * _21 * (x2 > x1 || -1)));
                    y2 = _4(_2(top, _3(top + _13, y1 + _1(x2 - x1) / _21 * (y2 > y1 || -1))));
                    x2 = _4(x2)
                } else {
                    y2 = _2(top, _3(top + _13, y1 + _1(x2 - x1) / _21 * (y2 > y1 || -1)));
                    x2 = _4(_2(_10, _3(_10 + _12, x1 + _1(y2 - y1) * _21 * (x2 > x1 || -1))));
                    y2 = _4(y2)
                }
            }
        };

        function _31() {
            x1 = _3(x1, _10 + _12);
            y1 = _3(y1, top + _13);
            if (_1(x2 - x1) < _1d) {
                x2 = x1 - _1d * (x2 < x1 || -1);
                if (x2 < _10) {
                    x1 = _10 + _1d
                } else {
                    if (x2 > _10 + _12) {
                        x1 = _10 + _12 - _1d
                    }
                }
            }
            if (_1(y2 - y1) < _1e) {
                y2 = y1 - _1e * (y2 < y1 || -1);
                if (y2 < top) {
                    y1 = top + _1e
                } else {
                    if (y2 > top + _13) {
                        y1 = top + _13 - _1e
                    }
                }
            }
            x2 = _2(_10, _3(x2, _10 + _12));
            y2 = _2(top, _3(y2, top + _13));
            _42(_1(x2 - x1) < _1(y2 - y1) * _21);
            if (_1(x2 - x1) > _1f) {
                x2 = x1 - _1f * (x2 < x1 || -1);
                _42()
            }
            if (_1(y2 - y1) > _20) {
                y2 = y1 - _20 * (y2 < y1 || -1);
                _42(true)
            }
            _23 = {
                x1: _28(_3(x1, x2)),
                x2: _28(_2(x1, x2)),
                y1: _29(_3(y1, y2)),
                y2: _29(_2(y1, y2)),
                width: _1(x2 - x1),
                height: _1(y2 - y1)
            };
            _32();
            _7.onSelectChange(_6, _2c())
        };

        function _3e(_44) {
            x2 = /w|e|^$/.test(_1c) || _21 ? evX(_44) : _26(_23.x2);
            y2 = /n|s|^$/.test(_1c) || _21 ? evY(_44) : _27(_23.y2);
            _31();
            return false
        };

        function _45(_46, _47) {
            x2 = (x1 = _46) + _23.width;
            y2 = (y1 = _47) + _23.height;
            $.extend(_23, {
                x1: _28(x1),
                y1: _29(y1),
                x2: _28(x2),
                y2: _29(y2)
            });
            _32();
            _7.onSelectChange(_6, _2c())
        };

        function _41(_48) {
            x1 = _2(_10, _3(_18 + evX(_48), _10 + _12 - _23.width));
            y1 = _2(top, _3(_19 + evY(_48), top + _13 - _23.height));
            _45(x1, y1);
            _48.preventDefault();
            return false
        };

        function _49() {
            $(document).unbind("mousemove", _49);
            _30();
            x2 = x1;
            y2 = y1;
            _31();
            _1c = "";
            if (!_d.is(":visible")) {
                _a.add(_d).hide().fadeIn(_7.fadeSpeed || 0)
            }
            _22 = true;
            $(document).unbind("mouseup", _4a).mousemove(_3e).one("mouseup", _3c);
            _a.unbind("mousemove", _3a);
            _7.onSelectStart(_6, _2c())
        };

        function _4a() {
            $(document).unbind("mousemove", _49).unbind("mouseup", _4a);
            _38(_a.add(_d));
            _2e(_28(x1), _29(y1), _28(x1), _29(y1));
            if (!(this instanceof $.imgAreaSelect)) {
                _7.onSelectChange(_6, _2c());
                _7.onSelectEnd(_6, _2c())
            }
        };

        function _4b(_4c) {
            if (_4c.which != 1 || _d.is(":animated")) {
                return false
            }
            _30();
            _18 = x1 = evX(_4c);
            _19 = y1 = evY(_4c);
            $(document).mousemove(_49).mouseup(_4a);
            return false
        };

        function _4d() {
            _36(false)
        };

        function _4e() {
            _9 = true;
            _4f(_7 = $.extend({
                classPrefix: "imgareaselect",
                movable: true,
                parent: "body",
                resizable: true,
                resizeMargin: 10,
                onInit: function () { },
                onSelectStart: function () { },
                onSelectChange: function () { },
                onSelectEnd: function () { }
            }, _7));
            _a.add(_d).css({
                visibility: ""
            });
            if (_7.show) {
                _22 = true;
                _30();
                _32();
                _a.add(_d).hide().fadeIn(_7.fadeSpeed || 0)
            }
            setTimeout(function () {
                _7.onInit(_6, _2c())
            }, 0)
        };
        var _34 = function (_50) {
            var k = _7.keys,
                d, t, key = _50.keyCode;
            d = !isNaN(k.alt) && (_50.altKey || _50.originalEvent.altKey) ? k.alt : !isNaN(k.ctrl) && _50.ctrlKey ? k.ctrl : !isNaN(k.shift) && _50.shiftKey ? k.shift : !isNaN(k.arrows) ? k.arrows : 10;
            if (k.arrows == "resize" || (k.shift == "resize" && _50.shiftKey) || (k.ctrl == "resize" && _50.ctrlKey) || (k.alt == "resize" && (_50.altKey || _50.originalEvent.altKey))) {
                switch (key) {
                    case 37:
                        d = -d;
                    case 39:
                        t = _2(x1, x2);
                        x1 = _3(x1, x2);
                        x2 = _2(t + d, x1);
                        _42();
                        break;
                    case 38:
                        d = -d;
                    case 40:
                        t = _2(y1, y2);
                        y1 = _3(y1, y2);
                        y2 = _2(t + d, y1);
                        _42(true);
                        break;
                    default:
                        return
                }
                _31()
            } else {
                x1 = _3(x1, x2);
                y1 = _3(y1, y2);
                switch (key) {
                    case 37:
                        _45(_2(x1 - d, _10), y1);
                        break;
                    case 38:
                        _45(x1, _2(y1 - d, top));
                        break;
                    case 39:
                        _45(x1 + _3(d, _12 - _28(x2)), y1);
                        break;
                    case 40:
                        _45(x1, y1 + _3(d, _13 - _29(y2)));
                        break;
                    default:
                        return
                }
            }
            return false
        };

        function _51(_52, _53) {
            for (var _54 in _53) {
                if (_7[_54] !== undefined) {
                    _52.css(_53[_54], _7[_54])
                }
            }
        };

        function _4f(_55) {
            if (_55.parent) {
                (_14 = $(_55.parent)).append(_a.add(_d))
            }
            $.extend(_7, _55);
            _30();
            if (_55.handles != null) {
                _e.remove();
                _e = $([]);
                i = _55.handles ? _55.handles == "corners" ? 4 : 8 : 0;
                while (i--) {
                    _e = _e.add(_5())
                }
                _e.addClass(_7.classPrefix + "-handle").css({
                    position: "absolute",
                    fontSize: 0,
                    zIndex: _16 + 1 || 1
                });
                if (!parseInt(_e.css("width")) >= 0) {
                    _e.width(5).height(5)
                }
                if (o = _7.borderWidth) {
                    _e.css({
                        borderWidth: o,
                        borderStyle: "solid"
                    })
                }
                _51(_e, {
                    borderColor1: "border-color",
                    borderColor2: "background-color",
                    borderOpacity: "opacity"
                })
            }
            _1a = _7.imageWidth / _12 || 1;
            _1b = _7.imageHeight / _13 || 1;
            if (_55.x1 != null) {
                _2e(_55.x1, _55.y1, _55.x2, _55.y2);
                _55.show = !_55.hide
            }
            if (_55.keys) {
                _7.keys = $.extend({
                    shift: 1,
                    ctrl: "resize"
                }, _55.keys)
            }
            _d.addClass(_7.classPrefix + "-outer");
            _b.addClass(_7.classPrefix + "-selection");
            for (i = 0; i++ < 4;) {
                $(_c[i - 1]).addClass(_7.classPrefix + "-border" + i)
            }
            _51(_b, {
                selectionColor: "background-color",
                selectionOpacity: "opacity"
            });
            _51(_c, {
                borderOpacity: "opacity",
                borderWidth: "border-width"
            });
            _51(_d, {
                outerColor: "background-color",
                outerOpacity: "opacity"
            });
            if (o = _7.borderColor1) {
                $(_c[0]).css({
                    borderStyle: "solid",
                    borderColor: o
                })
            }
            if (o = _7.borderColor2) {
                $(_c[1]).css({
                    borderStyle: "dashed",
                    borderColor: o
                })
            }
            _a.append(_b.add(_c).add(_f)).append(_e);
            if (_35) {
                if (o = (_d.css("filter") || "").match(/opacity=(\d+)/)) {
                    _d.css("opacity", o[1] / 100)
                }
                if (o = (_c.css("filter") || "").match(/opacity=(\d+)/)) {
                    _c.css("opacity", o[1] / 100)
                }
            }
            if (_55.hide) {
                _38(_a.add(_d))
            } else {
                if (_55.show && _9) {
                    _22 = true;
                    _a.add(_d).fadeIn(_7.fadeSpeed || 0);
                    _36()
                }
            }
            _21 = (d = (_7.aspectRatio || "").split(/:/))[0] / d[1];
            _8.add(_d).unbind("mousedown", _4b);
            if (_7.disable || _7.enable === false) {
                _a.unbind("mousemove", _3a).unbind("mousedown", _3f);
                $(window).unbind("resize", _4d)
            } else {
                if (_7.enable || _7.disable === false) {
                    if (_7.resizable || _7.movable) {
                        _a.mousemove(_3a).mousedown(_3f)
                    }
                    $(window).resize(_4d)
                }
                if (!_7.persistent) {
                    _8.add(_d).mousedown(_4b)
                }
            }
            _7.enable = _7.disable = undefined
        };
        this.remove = function () {
            _4f({
                disable: true
            });
            _a.add(_d).remove()
        };
        this.getOptions = function () {
            return _7
        };
        this.setOptions = _4f;
        this.getSelection = _2c;
        this.setSelection = _2e;
        this.cancelSelection = _4a;
        this.update = _36;
        var _35 = (/msie ([\w.]+)/i.exec(ua) || [])[1],
            _56 = /opera/i.test(ua),
            _57 = /webkit/i.test(ua) && !/chrome/i.test(ua);
        $p = _8;
        while ($p.length) {
            _16 = _2(_16, !isNaN($p.css("z-index")) ? $p.css("z-index") : _16);
            if ($p.css("position") == "fixed") {
                _17 = "fixed"
            }
            $p = $p.parent(":not(body)")
        }
        _16 = _7.zIndex || _16 + 1000;
        if (_35) {
            _8.attr("unselectable", "on")
        }
        $.imgAreaSelect.keyPress = _35 || _57 ? "keydown" : "keypress";
        if (_56) {
            _f = _5().css({
                width: "100%",
                height: "100%",
                position: "absolute",
                zIndex: _16 + 2 || 2
            })
        }
        _a.add(_d).css({
            visibility: "hidden",
            position: _17,
            overflow: "hidden",
            zIndex: _16 || "0"
        });
        _a.css({
            zIndex: _16 + 2 || 2
        });
        _b.add(_c).css({
            position: "absolute",
            fontSize: 0
        });
        _6.complete || _6.readyState == "complete" || !_8.is("img") ? _4e() : _8.one("load", _4e);
        if (!_9 && _35 && _35 >= 7) {
            _6.src = _6.src
        }
    };
    $.fn.imgAreaSelect = function (_58) {
        _58 = _58 || {};
        this.each(function () {
            if ($(this).data("imgAreaSelect")) {
                if (_58.remove) {
                    $(this).data("imgAreaSelect").remove();
                    $(this).removeData("imgAreaSelect")
                } else {
                    $(this).data("imgAreaSelect").setOptions(_58)
                }
            } else {
                if (!_58.remove) {
                    if (_58.enable === undefined && _58.disable === undefined) {
                        _58.enable = true
                    }
                    $(this).data("imgAreaSelect", new $.imgAreaSelect(this, _58))
                }
            }
        });
        if (_58.instance) {
            return $(this).data("imgAreaSelect")
        }
        return this
    }
})(jQuery);
