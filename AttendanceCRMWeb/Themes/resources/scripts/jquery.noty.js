/**
* jQuery Noty Plugin v1.1.1
* Authors: Nedim Arabacı (http://ned.im), Muhittin Özer (http://muhittinozer.com)
*
* Examples and Documentation - http://needim.github.com/noty/
*
* Licensed under the MIT licenses:
* http://www.opensource.org/licenses/mit-license.php
*
**/
(function ($) {
    $.noty = function (options, customContainer) {

        var base = this;
        var $noty = null;
        var isCustom = false;

        base.init = function (options) {
            base.options = $.extend({}, $.noty.defaultOptions, options);
            base.options.type = base.options.cssPrefix + base.options.type;
            base.options.id = base.options.type + '_' + new Date().getTime();
            base.options.layout = base.options.cssPrefix + 'layout_' + base.options.layout;

            if (base.options.custom.container) customContainer = base.options.custom.container;
            isCustom = ($.type(customContainer) === 'object') ? true : false;

            return base.addQueue();
        };

        // Push notification to queue
        base.addQueue = function () {
            var isGrowl = ($.inArray(base.options.layout, $.noty.growls) == -1) ? false : true;
            if (!isGrowl) (base.options.force) ? $.noty.queue.unshift({ options: base.options }) : $.noty.queue.push({ options: base.options });
            return base.render(isGrowl);
        };

        // Render the noty
        base.render = function (isGrowl) {

            // Layout spesific container settings
            var container = (isCustom) ? customContainer.addClass(base.options.theme + ' ' + base.options.layout + ' noty_custom_container') : $('body');
            if (isGrowl) {
                if ($('ul.noty_cont.' + base.options.layout).length == 0)
                    container.prepend($('<ul/>').addClass('noty_cont ' + base.options.layout));
                container = $('ul.noty_cont.' + base.options.layout);
            } else {
                if ($.noty.available) {
                    var fromQueue = $.noty.queue.shift(); // Get noty from queue
                    if ($.type(fromQueue) === 'object') {
                        $.noty.available = false;
                        base.options = fromQueue.options;
                    } else {
                        $.noty.available = true; // Queue is over
                        return base.options.id;
                    }
                } else {
                    return base.options.id;
                }
            }
            base.container = container;

            // Generating noty bar
            base.bar = $('<div class="noty_bar"/>').attr('id', base.options.id).addClass(base.options.theme + ' ' + base.options.layout + ' ' + base.options.type);
            $noty = base.bar;
            var templateNoty = $(base.options.template);
            templateNoty.find('.noty_text').html(base.options.text);
            templateNoty.find('.noty_title').html(base.options.texttitle);
            templateNoty.find('.noty_Icons').html(base.options.icons);
            $noty.append(templateNoty);
            $noty.data('noty_options', base.options);

            // Close button display
            (base.options.closeButton) ? $noty.addClass('noty_closable').find('.noty_close').show() : $noty.find('.noty_close').remove();

            // Bind close event to button
            $noty.find('.noty_close').bind('click', function () { $noty.trigger('noty.close'); });

            // If we have a button we must disable closeOnSelfClick and closeOnSelfOver option
            if (base.options.buttons) base.options.closeOnSelfClick = base.options.closeOnSelfOver = false;
            // Close on self click
            if (base.options.closeOnSelfClick) $noty.bind('click', function () { $noty.trigger('noty.close'); }).css('cursor', 'pointer');
            // Close on self mouseover
            if (base.options.closeOnSelfOver) $noty.bind('mouseover', function () { $noty.trigger('noty.close'); }).css('cursor', 'pointer');

            // Set buttons if available
            if (base.options.buttons) {
                $buttons = $('<div/>').addClass('noty_buttons');
                $noty.find('.noty_message').append($buttons);
                $.each(base.options.buttons, function (i, button) {
                    bclass = (button.type) ? button.type : 'gray';
                    $button = $('<button/>').addClass(bclass).html(button.text).appendTo($noty.find('.noty_buttons'))
					.bind('click', function () {
					    if ($.isFunction(button.click)) {
					        button.click.call($button, $noty);
					    }
					});
                });
            }

            return base.show(isGrowl);
        };

        base.show = function (isGrowl) {

            // is Modal?
            if (base.options.modal) $('<div/>').addClass('noty_modal').addClass(base.options.theme).prependTo($('body')).fadeIn('fast');

            $noty.close = function () { return this.trigger('noty.close'); };

            // Prepend noty to container
            (isGrowl) ? base.container.prepend($('<li/>').append($noty)) : base.container.prepend($noty);

            // topCenter and center specific options
            if (base.options.layout == 'noty_layout_topCenter' || base.options.layout == 'noty_layout_center') {
                $.noty.reCenter($noty);
            }

            $noty.bind('noty.setText', function (event, text) {
                $noty.find('.noty_text').html(text);

                if (base.options.layout == 'noty_layout_topCenter' || base.options.layout == 'noty_layout_center') {
                    $.noty.reCenter($noty);
                }
            });

            $noty.bind('noty.setType', function (event, type) {
                $noty.removeClass($noty.data('noty_options').type);

                type = $noty.data('noty_options').cssPrefix + type;

                $noty.data('noty_options').type = type;

                $noty.addClass(type);

                if (base.options.layout == 'noty_layout_topCenter' || base.options.layout == 'noty_layout_center') {
                    $.noty.reCenter($noty);
                }
            });

            $noty.bind('noty.getId', function (event) {
                return $noty.data('noty_options').id;
            });

            // Bind close event
            $noty.one('noty.close', function (event) {
                var options = $noty.data('noty_options');
                if (options.onClose) {
                    try {
                        $noty.clearQueue().stop().animate(
						$noty.data('noty_options').animateClose,
						$noty.data('noty_options').speed,
						$noty.data('noty_options').easing,
						$noty.data('noty_options').onClosed)
				.promise().done(function () {

				    // Layout spesific cleaning
				    if ($.inArray($noty.data('noty_options').layout, $.noty.growls) > -1) {
				        $noty.parent().remove();
				    } else {
				        $noty.remove();

				        // queue render
				        $.noty.available = true;
				        base.render(false);
				    }

				});
                    } catch (e) { }
                }

                // Modal Cleaning
                if (options.modal) $('.noty_modal').fadeOut('fast', function () { $(this).remove(); });
            });

                // Start the show
                if (base.options.enableanimate) {
                    $noty.animate(base.options.animateOpen, base.options.speed, base.options.easing, base.options.onShow);
                } else {
                    if (base.options.onShow) { base.options.onShow(); }
                    $noty.show();
                }

            // If noty is have a timeout option
            try {
                if (base.options.timeout) $noty.delay(base.options.timeout).promise().done(function () { $noty.trigger('noty.close'); });
            } catch (e) { };
            return base.options.id;
        };

        // Run initializer
        return base.init(options);
    };

    // API
    $.noty.get = function (id) { return $('#' + id); };
    $.noty.close = function (id) {
        //remove from queue if not already visible
        for (var i = 0; i < $.noty.queue.length; ) {
            if ($.noty.queue[i].options.id == id)
                $.noty.queue.splice(id, 1);
            else
                i++;
        }
        //close if already visible
        $.noty.get(id).trigger('noty.close');
    };
    $.noty.setText = function (id, text) {
        $.noty.get(id).trigger('noty.setText', text);
    };
    $.noty.setType = function (id, type) {
        $.noty.get(id).trigger('noty.setType', type);
    };
    $.noty.closeAll = function () {
        $.noty.clearQueue();
        $('.noty_bar').trigger('noty.close');
    };
    $.noty.reCenter = function (noty) {
        noty.css({ 'left': ($(window).width() - noty.outerWidth()) / 2 + 'px' });
    };
    $.noty.clearQueue = function () {
        $.noty.queue = [];
    };

    var windowAlert = window.alert;
    $.noty.consumeAlert = function (options) {
        window.alert = function (text) {
            if (options) { options.text = text; }
            else { options = { text: text }; }
            $.noty(options);
        };
    }
    $.noty.stopConsumeAlert = function () {
        window.alert = windowAlert;
    }

    $.noty.queue = [];
    $.noty.growls = ['noty_layout_topLeft', 'noty_layout_topRight', 'noty_layout_bottomLeft', 'noty_layout_bottomRight'];
    $.noty.available = true;
    $.noty.defaultOptions = {
        layout: 'top',
        theme: 'noty_theme_default',
        enableanimate: false,
        animateOpen: { height: 'toggle' },
        animateClose: { height: 'toggle' },
        easing: 'swing',
        text: '',
        texttitle: '',
        icons: '',
        type: 'alert',
        speed: 500,
        timeout: 5000,
        closeButton: false,
        closeOnSelfClick: true,
        closeOnSelfOver: false,
        force: false,
        onShow: false,
        onShown: false,
        onClose: true,
        onClosed: true,
        buttons: false,
        modal: false,
        template: '<div class="noty_message"><span class="noty_title right_left"></span><div class="noty_Icons right_left"></div><span class="noty_text"></span><div class="noty_close"></div></div>',
        cssPrefix: 'noty_',
        custom: {
            container: null
        }
    };

    $.fn.noty = function (options) {
        return this.each(function () {
            (new $.noty(options, $(this)));
        });
    };

})(jQuery);

//Helper
function noty(options) {
	return jQuery.noty(options); // returns an id
}
