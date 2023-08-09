
$(function () {
    $.RaveshTabScroll = function (options, Container) {
        var FirstOption = options;
        options = $.extend({}, defaultOptions, options);

        Container.data('options', options);

        /*create ui*/
        var wrapper = $('<div>').addClass('ravesh-tabscroll-wrapper');
        var wrapperContent = $('<div>').addClass('ravesh-tabscroll-wrapper-content');
        Container.children().appendTo(wrapperContent);
        wrapper.append(wrapperContent);

        var nextBtn = $('<div>').addClass('ravesh-tabscroll-button ravesh-tabscroll-button-next').addClass(options.buttonClass);
        var prevBtn = $('<div>').addClass('ravesh-tabscroll-button ravesh-tabscroll-button-prev').addClass(options.buttonClass);
        nextBtn.append(options.nextBtn);
        prevBtn.append(options.prevBtn);
        Container.append(prevBtn);
        Container.append(wrapper);
        Container.append(nextBtn);

        Container.find(options.tabItem).addClass('ravesh-tabscroll-item');

        /*initial size*/
        var tabContentWidth = 0;
        Container.find(options.tabItem).each(function () {
            tabContentWidth += $(this).outerWidth(true) + 5;
        });
        wrapperContent.css('width', tabContentWidth);

        /*check overflow*/
        var checkTabOver = function () {
            wrapper.removeClass(options.overflowClass);
            nextBtn.hide();
            prevBtn.hide();

            if (wrapper.width() < wrapperContent.width()) {
                wrapper.addClass(options.overflowClass);
                nextBtn.show();
                prevBtn.show();
                return true;
            } else {
                return false;
            }
        }

        var oldPos = 0;
        checkTabOver();
        var timerResize;
        $(window).resize(function () {
            clearTimeout(timerResize);
            timerResize = setTimeout(function () {
                var over = checkTabOver();
                oldPos = selectTab(wrapper, wrapperContent, options, wrapperContent.find('.' + options.selectClass).attr('id'), over);
            }, 100);
        });


        /*scroll button*/
        nextBtn.click(function () {
            var tabid = '';
            var checkWidth = 0;
            Container.find(options.tabItem).each(function () {
                var tabWidth = $(this).outerWidth(true);
                checkWidth += tabWidth;
                if (checkWidth > wrapper.width() + oldPos) {
                    tabid = $(this).attr('id');
                    return false;
                }
            });
            if (tabid != '') {
                oldPos = selectTab(wrapper, wrapperContent, options, tabid, true);
            }
        });
        prevBtn.click(function () {
            var tabid = '';
            var checkWidth = 0;
            var items = Container.find(options.tabItem);
            for (var i = items.length - 1; i > 0; i--) {
                var item = $(items[i]);
                if (thisLast) {
                    tabid = item.attr('id');
                    break;
                }
                var thisLast = item.hasClass('viewed');
            }
            if (tabid != '' && oldPos != 0) {
                oldPos = selectTab(wrapper, wrapperContent, options, tabid, true);
            }
        });

    }

    $.fn.RaveshTabScroll = function (firstoptions, values) {
        if (typeof firstoptions === 'string') {
            var Container = $(this);
            var options = Container.data('options');
            var wrapper = Container.find('.ravesh-tabscroll-wrapper');
            var wrapperContent = Container.find('.ravesh-tabscroll-wrapper-content');
            if (firstoptions == "click") {

                Container.find(options.tabItem).removeClass('select');
                Container.find('#' + values).addClass('select');
                selectTab(wrapper, wrapperContent, options, values, true);

            }
        } else {
            return this.each(function () {
                (new $.RaveshTabScroll(firstoptions, $(this)));
            })
        }
    }

    function selectTab(wrapper, wrapperContent, options, id, over) {
        var tranform = 0;
        if (over && id) {
            var checkWidth = 0;
            wrapperContent.find('.ravesh-tabscroll-item').removeClass('viewed')
            wrapperContent.find('.ravesh-tabscroll-item').each(function () {
                checkWidth += $(this).outerWidth(true);
                if ($(this).attr('id') == id) {
                    $(this).addClass('viewed')
                    return false;
                }
            });
            if (checkWidth > wrapper.width()) {
                tranform = Math.abs(checkWidth - wrapper.width());
                if (tranform < 10) tranform = 0;
            } else {
                tranform = 0;
            }
        }
        if (options.direction == 'ltr') tranform *= -1;
        wrapperContent.css({ 'transform': 'translateX(' + tranform + 'px)' });
        return tranform;
    }

    var defaultOptions = {
        tabItem: '.ravesh-tabscroll-item',
        buttonClass: 'ravesh-tabscroll-button-1',
        overflowClass: 'over',
        selectClass: 'select',
        nextBtn: '<span class="icon-chevron-left"></span>',
        prevBtn: '<span class="icon-chevron-right"></span>',
        direction: 'ltr'
    };

});