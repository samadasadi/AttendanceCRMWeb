
function fitVertical(a, b) {
	var c = parseInt(b) || $(a).offset().top;
	return c + $(a).height() <= getWindowHeight() + getScrollTop() && c - getScrollTop() >= 0
}
function fitHorizontal(a, b) {
	var c = parseInt(b) || $(a).offset().left;
	return c + $(a).width() <= getWindowWidth() + getScrollLeft() && c - getScrollLeft() >= 0
}
function getWindowWidth() {
	var a = document.documentElement;
	return self.innerWidth || a && a.clientWidth || document.body.clientWidth
}
function getWindowHeight() {
	var a = document.documentElement;
	return self.innerHeight || a && a.clientHeight || document.body.clientHeight
}
function getScrollLeft() {
	return self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
}
function getScrollTop() {
	return self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
}
function sortBigToSmall(a, b) {
	return b - a
}
function menuA(a, b) {
	var c = this;
	var a = $(a);
	var d = $('<div name="unpanel_menuA_Tree" class="fg-menuA-container ui-widget ui-widget-content ui-corner-all">' + b.content + "</div>");
	this.menuAOpen = false;
	this.menuAExists = false;
	var b = jQuery.extend({ content: null, width: 225, maxHeight: 233, positionOpts: { posX: "left", posY: "bottom", offsetX: 0, offsetY: 0, directionH: "right", directionV: "down", detectH: true, detectV: true, linkToFront: false }, showSpeed: 200, callerOnState: "ui-state-active", loadingState: "ui-state-loading", linkHover: "ui-state-hover", linkHoverSecondary: "li-hover", crossSpeed: 200, crumbDefaultText: "Please select", backLink: true, backLinkText: "Back", flyOut: false, flyOutOnState: "ui-state-default", nextmenuALink: "ui-icon-triangle-1-e", topLinkText: "All", nextCrumbLink: "ui-icon-carat-1-e" }, b);
	var e = function () {
		$.each(allUImenuAs, function (a) {
			if (allUImenuAs[a].menuAOpen) {
				allUImenuAs[a].kill()
			}
		})
	};
	this.kill = function () {
		a.removeClass(b.loadingState).removeClass("fg-menuA-open").removeClass(b.callerOnState);
		d.find("li").removeClass(b.linkHoverSecondary).find("a").removeClass(b.linkHover);
		if (b.flyOutOnState) {
			d.find("li a").removeClass(b.flyOutOnState)
		}
		if (b.callerOnState) {
			a.removeClass(b.callerOnState)
		}
		if (d.is(".fg-menuA-ipod")) {
			c.resetDrilldownmenuA()
		}
		if (d.is(".fg-menuA-flyout")) {
			c.resetFlyoutmenuA()
		}
		d.parent().hide();
		c.menuAOpen = false;
		$(document).unbind("click", e);
		$(document).unbind("keydown")
	};
	this.showLoading = function () {
		a.addClass(b.loadingState)
	};
	this.showmenuA = function () {
		e();
		if (!c.menuAExists) {
			c.create()
		}
		a.addClass("fg-menuA-open").addClass(b.callerOnState);
		d.parent().show().click(function () {
			return false
		});
		d.hide().slideDown(b.showSpeed).find(".fg-menuA:eq(0)");
		c.menuAOpen = true;
		a.removeClass(b.loadingState);
		$(document).click(e);
		$(document).keydown(function (a) {
			var c;
			if (a.which != "") {
				c = a.which
			} else if (a.charCode != "") {
				c = a.charCode
			} else if (a.keyCode != "") {
				c = a.keyCode
			}
			var f = $(a.target).parents("div").is(".fg-menuA-flyout") ? "flyout" : "ipod";
			switch (c) {
				case 37:
					if (f == "flyout") {
						$(a.target).trigger("mouseout");
						if ($("." + b.flyOutOnState).size() > 0) {
							$("." + b.flyOutOnState).trigger("mouseover")
						}
					}
					if (f == "ipod") {
						$(a.target).trigger("mouseout");
						if ($(".fg-menuA-footer").find("a").size() > 0) {
							$(".fg-menuA-footer").find("a").trigger("click")
						}
						if ($(".fg-menuA-header").find("a").size() > 0) {
							$(".fg-menuA-current-crumb").prev().find("a").trigger("click")
						}
						if ($(".fg-menuA-current").prev().is(".fg-menuA-indicator")) {
							$(".fg-menuA-current").prev().trigger("mouseover")
						}
					}
					return false;
					break;
				case 38:
					if ($(a.target).is("." + b.linkHover)) {
						var g = $(a.target).parent().prev().find("a:eq(0)");
						if (g.size() > 0) {
							$(a.target).trigger("mouseout");
							g.trigger("mouseover")
						}
					} else {
						d.find("a:eq(0)").trigger("mouseover")
					}
					return false;
					break;
				case 39:
					if ($(a.target).is(".fg-menuA-indicator")) {
						if (f == "flyout") {
							$(a.target).next().find("a:eq(0)").trigger("mouseover")
						} else if (f == "ipod") {
							$(a.target).trigger("click");
							setTimeout(function () {
								$(a.target).next().find("a:eq(0)").trigger("mouseover")
							}, b.crossSpeed)
						}
					}
					return false;
					break;
				case 40:
					if ($(a.target).is("." + b.linkHover)) {
						var h = $(a.target).parent().next().find("a:eq(0)");
						if (h.size() > 0) {
							$(a.target).trigger("mouseout");
							h.trigger("mouseover")
						}
					} else {
						d.find("a:eq(0)").trigger("mouseover")
					}
					return false;
					break;
				case 27:
					e();
					break;
				case 13:
					if ($(a.target).is(".fg-menuA-indicator") && f == "ipod") {
						$(a.target).trigger("click");
						setTimeout(function () {
							$(a.target).next().find("a:eq(0)").trigger("mouseover")
						}, b.crossSpeed)
					}
					break
			}
		})
	};
	this.create = function () {
		d.css({ width: b.width }).appendTo("body").find("ul:first").not(".fg-menuA-breadcrumb").addClass("fg-menuA");
		d.find("ul, li a").addClass("ui-corner-all");
		d.find("ul").attr("role", "menuA").eq(0).attr("aria-activedescendant", "active-menuAitem").attr("aria-labelledby", a.attr("id"));
		d.find("li").attr("role", "menuAitem");
		d.find("li:has(ul)").attr("aria-haspopup", "true").find("ul").attr("aria-expanded", "false");
		d.find("a").attr("tabindex", "-1");
		if (d.find("ul").size() > 1) {
			if (b.flyOut) {
				c.flyout(d, b)
			} else {
				c.drilldown(d, b)
			}
		} else {
			d.find("a").click(function () {
				c.chooseItem(this);
				return false
			})
		}
		if (b.linkHover) {
			var e = d.find(".fg-menuA li a");
			e.hover(function () {
				var a = $(this);
				$("." + b.linkHover).removeClass(b.linkHover).blur().parent().removeAttr("id");
				$(this).addClass(b.linkHover).focus().parent().attr("id", "active-menuAitem")
			}, function () {
				$(this).removeClass(b.linkHover).blur().parent().removeAttr("id")
			})
		}
		if (b.linkHoverSecondary) {
			d.find(".fg-menuA li").hover(function () {
				$(this).siblings("li").removeClass(b.linkHoverSecondary);
				if (b.flyOutOnState) {
					$(this).siblings("li").find("a").removeClass(b.flyOutOnState)
				}
				$(this).addClass(b.linkHoverSecondary)
			}, function () {
				$(this).removeClass(b.linkHoverSecondary)
			})
		}
		c.setPosition(d, a, b);
		c.menuAExists = true
	};
	this.chooseItem = function (a) {
		c.kill();
		if (a.name == "select1") {
			$("#hierarchybreadcrumb1").text(a.title);
		} else if (a.name == "select1_Server") {
			$("#ctl00_ContentHolder_hierarchybreadcrumb1").text(a.title);
		} else if (a.name == "select2") {
			$("#hierarchybreadcrumb2").text(a.title);
		} else if (a.name == "select2_Server") {
			$("#ctl00_ContentHolder_hierarchybreadcrumb2").text(a.title);
		} else if (a.name == "select3") {
			$("#hierarchybreadcrumb3").text(a.title);
		} else if (a.name == "select3_Server") {
			$("#ctl00_ContentHolder_hierarchybreadcrumb3").text(a.title);
		} else if (a.name == "select4") {
			$("#hierarchybreadcrumb4").text(a.title);
		} else if (a.name == "select4_Server") {
			$("#ctl00_ContentHolder_hierarchybreadcrumb4").text(a.title);
		} else if (a.name == "select5") {
			$("#hierarchybreadcrumb5").text(a.title);
		} else if (a.name == "select5_Server") {
			$("#ctl00_ContentHolder_hierarchybreadcrumb5").text(a.title);
		} else if (a.name == "select6") {
			$("#hierarchybreadcrumb6").text(a.title);
		} else if (a.name == "select7") {
			$("#hierarchybreadcrumb7").text(a.title);
		} else if (a.name == "select8") {
			$("#hierarchybreadcrumb8").text(a.title);
		}
	}
}
var allUImenuAs = [];
$.fn.menuA = function (a) {
	var b = this;
	var a = a;
	var c = new menuA(b, a);
	allUImenuAs.push(c);
	$(this).mousedown(function () {
		if (!c.menuAOpen) {
			c.showLoading()
		}
	}).click(function () {
		if (c.menuAOpen == false) {
			c.showmenuA()
		} else {
			c.kill()
		}
		return false
	})
};
menuA.prototype.flyout = function (a, b) {
	var c = this;
	this.resetFlyoutmenuA = function () {
		var b = a.find("ul ul");
		b.removeClass("ui-widget-content").hide()
	};
	a.addClass("fg-menuA-flyout").find("li:has(ul)").each(function () {
		var c = a.width();
		var d, e;
		var f = $(this).find("ul");
		f.css({ left: c, width: c }).hide();
		$(this).find("a:eq(0)").addClass("fg-menuA-indicator").html("<span>" + $(this).find("a:eq(0)").text() + '</span><span class="ui-icon ' + b.nextmenuALink + '"></span>').hover(function () {
			clearTimeout(e);
			var a = $(this).next();
			if (!fitVertical(a, $(this).offset().top)) {
				a.css({ top: "auto", bottom: 0 })
			}
			if (!fitHorizontal(a, $(this).offset().left + 100)) {
				a.css({ left: "auto", right: c, "z-index": 999 })
			}
			d = setTimeout(function () {
				a.addClass("ui-widget-content").show(b.showSpeed).attr("aria-expanded", "true")
			}, 300)
		}, function () {
			clearTimeout(d);
			var a = $(this).next();
			e = setTimeout(function () {
				a.removeClass("ui-widget-content").hide(b.showSpeed).attr("aria-expanded", "false")
			}, 400)
		});
		$(this).find("ul a").hover(function () {
			clearTimeout(e);
			if ($(this).parents("ul").prev().is("a.fg-menuA-indicator")) {
				$(this).parents("ul").prev().addClass(b.flyOutOnState)
			}
		}, function () {
			e = setTimeout(function () {
				f.hide(b.showSpeed);
				a.find(b.flyOutOnState).removeClass(b.flyOutOnState)
			}, 500)
		})
	});
	a.find("a").click(function () {
		c.chooseItem(this);
		return false
	})
};
menuA.prototype.drilldown = function (a, b) {
	var c = this;
	var d = a.find(".fg-menuA");
	var e = $('<ul class="fg-menuA-breadcrumb ui-widget-header ui-corner-all ui-helper-clearfix"></ul>');
	var f = $('<li class="fg-menuA-breadcrumb-text">' + b.crumbDefaultText + "</li>");
	var g = b.backLink ? b.backLinkText : b.topLinkText;
	var h = b.backLink ? "fg-menuA-prev-list" : "fg-menuA-all-lists";
	var i = b.backLink ? "ui-state-default ui-corner-all" : "";
	var j = b.backLink ? '<span class="ui-icon ui-icon-triangle-1-w"></span>' : "";
	var k = $('<li class="' + h + '"><a href="#" class="' + i + '">' + j + g + "</a></li>");
	a.addClass("fg-menuA-ipod");
	if (b.backLink) {
		e.addClass("fg-menuA-footer").appendTo(a).hide()
	} else {
		e.addClass("fg-menuA-header").prependTo(a)
	}
	e.append(f);
	var l = function (a) {
		if (a.height() > b.maxHeight) {
			$("[name=unpanel_menuA_Tree]").height(a.height() + 50)
		}
		a.css({ height: a.height() })
	};
	var m = function (a) {
		a.removeClass("fg-menuA-scroll").removeClass("fg-menuA-current").height("auto")
	};
	this.resetDrilldownmenuA = function () {
		$(".fg-menuA-current").removeClass("fg-menuA-current");
		d.animate({ left: 0 }, b.crossSpeed, function () {
			$(this).find("ul").each(function () {
				$(this).hide();
				m($(this))
			});
			d.addClass("fg-menuA-current")
		});
		$(".fg-menuA-all-lists").find("span").remove();
		e.empty().append(f);
		$(".fg-menuA-footer").empty().hide();
		l(d)
	};
	d.addClass("fg-menuA-content fg-menuA-current ui-widget-content ui-helper-clearfix").css({ width: a.width() }).find("ul").css({ width: a.width(), left: a.width() }).addClass("ui-widget-content").hide();
	l(d);
	d.find("a").each(function () {
		if ($(this).next().is("ul")) {
			$(this).addClass("fg-menuA-indicator").each(function () {
				$(this).html("<span>" + $(this).text() + '</span><span class="ui-icon ' + b.nextmenuALink + '"></span>')
			}).click(function () {
				var f = $(this).next();
				var g = $(this).parents("ul:eq(0)");
				var h = g.is(".fg-menuA-content") ? 0 : parseFloat(d.css("left"));
				var i = Math.round(h - parseFloat(a.width()));
				var j = $(".fg-menuA-footer");
				m(g);
				l(f);
				d.animate({ left: i }, b.crossSpeed);
				f.show().addClass("fg-menuA-current").attr("aria-expanded", "true");
				var n = function (a) {
					var b = a;
					var c = $(".fg-menuA-current");
					var d = c.parents("ul:eq(0)");
					c.hide().attr("aria-expanded", "false");
					m(c);
					l(d);
					d.addClass("fg-menuA-current").attr("aria-expanded", "true");
					if (d.hasClass("fg-menuA-content")) {
						b.remove();
						j.hide()
					}
				};
				if (b.backLink) {
					if (j.find("a").size() == 0) {
						j.show();
						$('<a href="#"><span class="ui-icon ui-icon-triangle-1-w"></span> <span>Back</span></a>').appendTo(j).click(function () {
							var c = $(this);
							var e = parseFloat(d.css("left")) + a.width();
							d.animate({ left: e }, b.crossSpeed, function () {
								n(c)
							});
							return false
						})
					}
				} else {
					if (e.find("li").size() == 1) {
						e.empty().append(k);
						k.find("a").click(function () {
							c.resetDrilldownmenuA();
							return false
						})
					}
					$(".fg-menuA-current-crumb").removeClass("fg-menuA-current-crumb");
					var o = $(this).find("span:eq(0)").text();
					var p = $('<li class="fg-menuA-current-crumb"><a href="javascript://" class="fg-menuA-crumb">' + o + "</a></li>");
					p.appendTo(e).find("a").click(function () {
						if ($(this).parent().is(".fg-menuA-current-crumb")) {
							c.chooseItem(this)
						} else {
							var a = -($(".fg-menuA-current").parents("ul").size() - 1) * 225;
							d.animate({ left: a }, b.crossSpeed, function () {
								n()
							});
							$(this).parent().addClass("fg-menuA-current-crumb").find("span").remove();
							$(this).parent().nextAll().remove()
						}
						return false
					});
					p.prev().append(' <span class="ui-icon ' + b.nextCrumbLink + '"></span>')
				}
				return false
			})
		} else {
			$(this).click(function () {
				if (this.name == "select1" || this.name == "select1_Server" || this.name == "select2_Server" || this.name == "select2" || this.name == "select3" || this.name == "select3_Server" || this.name == "select4" || this.name == "select4_Server" || this.name == "select5" || this.name == "select5_Server" || this.name == "select6" || this.name == "select7" || this.name == "select8") {
					c.chooseItem(this);
					c.kill()
				}
				return false
			})
		}
	})
};
menuA.prototype.setPosition = function (a, b, c) {
	var d = a;
	var e = b;
	var f = { refX: e.offset().left, refY: e.offset().top, refW: e.getTotalWidth(), refH: e.getTotalHeight() };
	var c = c;
	var g, h;
	var i = $('<div id="positionHelper" class="positionHelper"></div>');
	i.css({ position: "absolute", left: f.refX, top: f.refY, width: f.refW, height: f.refH });
	d.wrap(i);
	switch (c.positionOpts.posX) {
		case "left":
			g = -23;
			break;
		case "center":
			g = f.refW / 2;
			break;
		case "right":
			g = f.refW;
			break
	}
	switch (c.positionOpts.posY) {
		case "top":
			h = 0;
			break;
		case "center":
			h = f.refH / 2;
			break;
		case "bottom":
			h = f.refH;
			break
	}
	g += c.positionOpts.offsetX;
	h += c.positionOpts.offsetY;
	d.css({ bottom: "auto", top: h });
	if (c.positionOpts.directionH == "left") {
		d.css({ left: "auto", right: g });
		if (c.positionOpts.detectH && !fitHorizontal(d)) {
			d.css({ right: "auto", left: g })
		}
	} else {
		d.css({ right: "auto", left: g });
		if (c.positionOpts.detectH && !fitHorizontal(d)) {
			d.css({ left: "auto", right: g })
		}
	}
	if (c.positionOpts.linkToFront) {
		e.clone().addClass("linkClone").css({ position: "absolute", top: 0, right: "auto", bottom: "auto", left: 0, width: e.width(), height: e.height() }).insertAfter(d)
	}
};
jQuery.fn.getTotalWidth = function () {
	return $(this).width() + parseInt($(this).css("paddingRight")) + parseInt($(this).css("paddingLeft")) + parseInt($(this).css("borderRightWidth")) + parseInt($(this).css("borderLeftWidth"))
};
jQuery.fn.getTotalHeight = function () {
	return $(this).height() + parseInt($(this).css("paddingTop")) + parseInt($(this).css("paddingBottom")) + parseInt($(this).css("borderTopWidth")) + parseInt($(this).css("borderBottomWidth"))
};
Number.prototype.pxToEm = String.prototype.pxToEm = function (a) {
	a = jQuery.extend({ scope: "body", reverse: false }, a);
	var b = this == "" ? 0 : parseFloat(this);
	var c;
	var d = function () {
		var a = document.documentElement;
		return self.innerWidth || a && a.clientWidth || document.body.clientWidth
	};
	if (a.scope == "body" && $.browser.msie && (parseFloat($("body").css("font-size")) / d()).toFixed(1) > 0) {
		var e = function () {
			return (parseFloat($("body").css("font-size")) / d()).toFixed(3) * 16
		};
		c = e()
	} else {
		c = parseFloat(jQuery(a.scope).css("font-size"))
	}
	var f = a.reverse == true ? (b * c).toFixed(2) + "px" : (b / c).toFixed(2) + "em";
	return f
}
