$(window).resize(function () { rcrmSetHeight() });
$(document).resize(function () { rcrmSetHeight() });
var rcrmBrowser = 'chrome';
try { if(navigator.userAgent.match(/firefox/i)) rcrmBrowser = 'firefox' } catch (e) { }

$(document).ready(function () {

    if ($('#rcrm_document_main .rcrmZoom').length == 0) {
        $('#rcrm_document_main').append('<i class="icon-zoomout rcrmZoom">100%</i> <i class="icon-zoomin rcrmZoom">80%</i>').hover(function () { rcrmSetZoom($('#rcrm_document_main')); }, function () { $('#rcrm_document_main .rcrmZoom').hide() });
        $('#rcrm_document_main .rcrmZoom').click(function () { rcrmSetZoom($('#rcrm_document_main'), $(this)) });
    }

    $('.rcrmTextElement > .rcrmContentContainerHelper > .rcrmDocElementContentText').each(function () {
        var hContent = $(this).parents('.rcrmTextElement').first();
        var hContainer = hContent.find('> .rcrmContentContainerHelper');
        $(this).css('min-height', $(this).height());
        if ($(this)[0].style.wordBreak == "unset") {
            var font = $(this)[0].style.fontFamily;
            $(this).css('font-family', 'tahoma');
            hContainer.width('');
            $(this).width('100%');
            if ($('#rcrm_document_main').hasClass('rcrm_fa')) { hContainer.css('right', '-1px').css('left', 'unset'); hContent.css('direction', 'rtl') }
            $(this).css('font-family', font);
        }
        if ($(this)[0].style.fontFamily == "BKoodakBold" || $(this)[0].style.fontFamily == "BTitrBold") $(this).css('font-weight', 'bold');

        if ($(this).find('.rcrmRotate').length > 0) {
            $(this).html($(this).html().replace('style="transform:', 'style="-webkit-transform:'));
            $(this).css('min-height', 'unset');
            hContainer.width('auto').height('auto');
            var rect = $(this).find('.rcrmRotate')[0].getBoundingClientRect();
            if (hContent.attr('widthType') == 'auto') $(this).width(rect.width).attr('Cwidth', hContainer.width());
            if (hContent.attr('heightType') == 'auto') $(this).height(rect.height).attr('Cheight', hContainer.height());
        }
    });

    $('#rcrm_document_main').css('min-height', $('#rcrm_document_main').height());

    $('.rcrmFrameElement').each(function () {
        $(this).css('min-height', $(this).height());
        var frameElem = $(this).find('> .rcrmContentContainerHelper').find('> .rcrmDocElementContentFrame');
        frameElem.css('min-height', frameElem.height());
    });

    $('.rcrmTableElement').each(function () {
        $(this).height('');
        if ($(this).attr('odd-color') != undefined) {
            if ($(this).attr('tabletype') == 'repeating') {
                if ($(this).find('tbody tr:first').css('display') == 'none') $(this).find('tbody tr:first').remove();
                $(this).find('tbody:not(.rcrmChangedHead) tr:nth-child(odd)').css('background-color', $(this).attr('odd-color'));
                $(this).find('tbody:not(.rcrmChangedHead) tr:nth-child(even)').css('background-color', $(this).attr('even-color'));
            }
        }
    });

    $('#rcrm_document_main[fitpage=true] .rcrmTableElement > table').css('table-layout', 'unset');
    if (rcrmBrowser == 'chrome') $('#rcrm_document_main').css('zoom', '125%'); else $('#rcrm_document_main').css('-moz-transform-origin', 'top center').css('-moz-transform', 'scale(1.25)')
    $('#rcrm_document_main[fitpage=false] .rcrmTableTextElement').css('word-break', 'break-word');
    $('.rcrmTableTextElement > .rcrmContentContainerHelper > .rcrmDocElementContentText').each(function () {
        var hContent = $(this).parents('.rcrmTableTextElement').first();
        var hContainer = hContent.find('> .rcrmContentContainerHelper');
        if ($(this).width() == 0 || $(this).attr('pxwidth') == 0) hContent.remove();
        if ($(this)[0].style.fontFamily == "BKoodakBold" || $(this)[0].style.fontFamily == "BTitrBold") $(this).css('font-weight', 'bold');
        if ($(this).find('.rcrmRotate').length > 0) {
            $(this).html($(this).html().replace('style="transform:', 'style="-webkit-transform:'));
            var rect = $(this).find('.rcrmRotate')[0].getBoundingClientRect();
            $(this).height(rect.height);
            hContent.css('min-height', hContent.height());
            hContent.height(hContainer.height());
        }
        if ($(this).css('background-color') != '' && $(this).css('background-color') != 'rgba(0, 0, 0, 0)') { hContainer.css('width', '100%'); $(this).css('width', '100%') };
    });

    if ($('#rcrm_document_content').hasClass('rcrmGetFile')) setTimeout(function () { rcrmSetHeight(); $('#rcrm_document_main .rcrmZoom').hide() }, 500);
    else rcrmSetHeight();
});

function rcrmSetHeight() {

    $('.rcrmTableTextElement').each(function () {
        if ($(this).find('.rcrmRotate').length == 0) {
            $(this).find('> .rcrmContentContainerHelper').css('height', '100%');
            $(this).find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').css('height', '100%');
        }
    });

    $('.rcrmTextElement').each(function () {
        $(this).css('min-height', $(this).find('> .rcrmContentContainerHelper').height());
        $(this).height($(this).find('> .rcrmContentContainerHelper').outerHeight());
        if ($(this).find('.rcrmRotate').length > 0 && $('#rcrm_document_content').hasClass('rcrmGetFile')) {
            var CWidth = $(this).find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').attr('Cwidth');
            var CHeight = $(this).find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').attr('Cheight');
            var trans = $(this).find('.rcrmRotate').attr('trans');
            var align = 'rcrmDocElementVAlignCenter';
            if (trans == 270) align = 'rcrmDocElementVAlignTop'; else if (trans == 90) align = 'rcrmDocElementVAlignBottom';
            $(this).find('> .rcrmContentContainerHelper').removeAttr('class').attr('class', 'rcrmContentContainerHelper ' + align).width(CWidth).height(CHeight);
        }
    });

    $('.rcrmHtmlElement').each(function () {
        $(this).css('min-height', $(this).find('> .rcrmContentContainerHelper').height());
        $(this).height($(this).find('> .rcrmContentContainerHelper').outerHeight());
    });

    $(".rcrmTableElement tfoot .rcrmDocElementContentText").each(function () {
        if ($(this).find('span.currency').length > 1) $(this).css('display', 'block');
    });

    if ($('#rcrm_document_main').length > 0) {

        if ($('#rcrm_document_main').find('[tabletype=repeating][rcrmshow_eachpage=true]').length > 0 && !$('#rcrm_document_main').hasClass('rcrmRepeatCalced') && $('#rcrm_document_main').attr('fitpage') == 'false') setTimeout(function () { rcrmRepeatHeader($('#rcrm_document_main'), 0) }, 300)
        else rcrmCalcPageHeight($('#rcrm_document_main'));

        function rcrmSetFrames(Page) {
            $(Page).find('.rcrmFrameElement').each(function () {
                var frame = $(this);
                if (frame.attr('pos') != 'footer') {
                    if (frame.find('> .rcrmContentContainerHelper > .rcrmDocElementContentFrame > .rcrmFrameElement').length == 0) {
                        rcrmCalcFrameHeight(frame);
                        frame.parents('.rcrmFrameElement').each(function () {
                            rcrmCalcFrameHeight($(this));
                        });
                    }
                }
            });
        };

        function rcrmCalcFrameHeight(frame) {
            var rcrmElemBottom = 0;
            frame.find('> .rcrmContentContainerHelper > .rcrmDocElementContentFrame > .rcrmDocElement').each(function () {
                var elemBottom = $(this).position().top + $(this).height() + 2;
                if (elemBottom > rcrmElemBottom) rcrmElemBottom = elemBottom;
            });
            if (rcrmElemBottom != 0) {
                frame.height(rcrmElemBottom);
                frame.find('> .rcrmContentContainerHelper').find('> .rcrmDocElementContentFrame').height(rcrmElemBottom);
            }
        };

        function rcrmRepeatHeader(mainPage, pageCount) {
            var lastTrIndex = 0;
            var rcrmMarginBottom = mainPage.find('#rcrm_divider_margin_bottom').css('bottom') == 'auto' ? 0 : Number(mainPage.find('#rcrm_divider_margin_bottom').css('bottom').replace('px', '').replace('%', ''));

            mainPage.find('[tabletype=repeating] tr').each(function (index) { //[tabletype=repeating] tbody
                if ($(this).css('display') != 'none') {
                    var trBottom = $(this).position().top + $(this).height() + $(this).parents('[tabletype=repeating]').first().position().top + (mainPage.find('#rcrm_document_content').position().top + 1) + rcrmMarginBottom + 12;
                    $(this).parents('.rcrmFrameElement').each(function () { trBottom = trBottom + $(this).position().top });
                    if (trBottom > mainPage.height()) { lastTrIndex = index - 1; return false }
                }
            });

            if (lastTrIndex > 0) {
                if (!mainPage.hasClass('rcrmRepeatCalced')) {
                    var pageCopy = mainPage.clone();
                    var tblIndex = mainPage.find('[tabletype=repeating]').first().index();
                    mainPage.find('[tabletype=repeating]').parent().find('> .rcrmDocElement:gt(' + (tblIndex) + ')').remove();
                    mainPage.find('[tabletype=repeating] tr:gt(' + lastTrIndex + ')').remove(); //[tabletype=repeating] tbody
                    mainPage.find('[tabletype=repeating] tfoot').remove();
                    rcrmSetFrames(mainPage);
                    mainPage.find('.rcrmFrameElement[pos=footer]').remove();
                    mainPage.addClass('rcrmRepeatCalced');
                    $(pageCopy).find('[tabletype=repeating] tr:lt(' + (lastTrIndex + 1) + ')').remove(); //[tabletype=repeating] tbody
                    $(pageCopy).hover(function () { rcrmSetZoom($(pageCopy)); }, function () { $(pageCopy).find('.rcrmZoom').hide() });
                    $(pageCopy).find('.rcrmZoom').click(function () { rcrmSetZoom($(pageCopy), $(this)) });
                    mainPage.parent().append(pageCopy);
                    pageCount = pageCount + 1;
                    rcrmRepeatHeader(pageCopy, pageCount);
                } rcrmSetFrames(mainPage);
            }
            else {
                var lastPageCount = 0;
                mainPage.addClass('rcrmRepeatCalced');
                rcrmCalcPageHeight(mainPage, 0);
                var lastPageCount = Math.floor((mainPage.height() - 1) / Number(mainPage.attr('main_height')));
                pageCount = pageCount + lastPageCount;
                rcrmCalcPageHeight(mainPage, pageCount);
            }
        }

        function rcrmCalcPageHeight(rcrmPage, pageCount) {
            rcrmSetFrames(rcrmPage);
            var rcrmElemBottom = 0;
            var rcrmMarginTop = $('#rcrm_divider_margin_top').position().top + 1;
            var rcrmMarginBottom = $('#rcrm_divider_margin_bottom').css('bottom') == 'auto' ? 0 : Number($('#rcrm_divider_margin_bottom').css('bottom').replace('px', '').replace('%', ''));

            $(rcrmPage).find('#rcrm_content > .rcrmDocElement').each(function () {
                if ($(this).attr('pos') != 'footer' && !$(this).hasClass('rcrmFullHeight')) {
                    var elemBottom = $(this).position().top + $(this).height() + rcrmMarginTop + rcrmMarginBottom + 2;
                    if (elemBottom > rcrmElemBottom) rcrmElemBottom = elemBottom;
                }
            });

            if ($(rcrmPage).find('.rcrmFrameElement[pos=footer]').length > 0) {
                var footer = $(rcrmPage).find('.rcrmFrameElement[pos=footer]');
                footer.css('top', 'unset').css('bottom', '0px');
                if (rcrmElemBottom + 2 >= footer.position().top) rcrmElemBottom = rcrmElemBottom + footer.height();
            }
            
            if (rcrmPage.attr('main_height') == undefined || rcrmPage.attr('main_height') == '') rcrmPage.attr('main_height', rcrmPage.height()); rcrmPage.height(rcrmElemBottom);
            $(rcrmPage).find('.rcrmFullHeight').each(function () {
                var top = $(this).position().top;
                var height = $(this).parent().height() + 2;
                $(this).height(height - top);
                if ($(this).hasClass('rcrmFrameElement')) { $(this).find('> .rcrmContentContainerHelper').find('> .rcrmDocElementContentFrame').height(height - top - 3) }
                if ($(this).hasClass('rcrmImageElement')) { $(this).find('img').height(height - top - 3) }
            });

            if (pageCount == undefined) pageCount = Math.floor((rcrmPage.height() - 1) / $(rcrmPage).attr('main_height'));
            if (pageCount > 0 && $(rcrmPage).find('#rcrmPrintStyle').length == 0 && $(rcrmPage).find('.rcrmFrameElement[pos=footer]').length > 0) {
                if ($(rcrmPage).find('.rcrmFrameElement[pos=footer]').attr('rcrmshow_endpage') == 'true') {
                    $(rcrmPage).prepend('<style type="text/css" media="print" id="rcrmPrintStyle"></style>');
                    style = '.rcrmFrameElement[pos=footer] { bottom: ' + (-pageCount * Number($(rcrmPage).attr('main_height'))) + 'px !important; position: fixed !important };'
                    $(rcrmPage).find('#rcrmPrintStyle').text(style);
                }
            }
        }
    }
};

function rcrmSetZoom(page, zoomElem) {
    if ($('#rcrm_document_main').find('[tabletype=repeating][rcrmshow_eachpage=true]').length == 0) {
        if (zoomElem != undefined) {
            if (rcrmBrowser == 'chrome') { if (zoomElem.hasClass('icon-zoomout')) page.css('zoom', '1'); else page.css('zoom', '1.25'); }
            if (rcrmBrowser == 'firefox') { if (zoomElem.hasClass('icon-zoomout')) page.css('-moz-transform', 'scale(1)'); else page.css('-moz-transform', 'scale(1.25)'); }
            rcrmSetHeight();
        }
        if ((page.css('zoom') == '1.25' && rcrmBrowser == 'chrome') || (page[0].style.transform == 'scale(1.25)' && rcrmBrowser == 'firefox')) {
            page.find('.icon-zoomout').show();
            page.find('.icon-zoomin').hide();
        }
        else {
            page.find('.icon-zoomout').hide();
            page.find('.icon-zoomin').show();
        }
    }
}

function rcrmPrintSetting_(c) {
    c.find('#rcrm_document_main').css('box-shadow', 'unset').css('margin', 'unset').removeClass('printZoom').addClass('printZoom');
    c.find('.rcrmTableElement thead').each(function () { $(this).replaceWith("<tbody class='rcrmChangedHead'>" + $(this).html() + "</tbody>") });
    c.find('.rcrmTableElement tfoot').each(function () { $(this).replaceWith("<tbody>" + $(this).html() + "</tbody>") });
    //-----------------------------------------------------------------------
    var pageCount = Math.floor(c.find('#rcrm_document_main').height() / c.find('#rcrm_document_main').attr('main_height'));
    if (pageCount > 0 && (c.find('[tabletype=repeating][rcrmshow_eachpage=true]').length == 0 || c.find('#rcrm_document_main').attr('fitpage') == 'true')) {
        c.find('.rcrmTableElement tr').css('page-break-inside', 'avoid');
        var mainTbl = c.find('[tabletype=repeating]').first();
        mainTbl.parent().find('> .rcrmDocElement:not([pos=footer]):gt(' + (mainTbl.index()) + ')').each(function () { $(this).css('top', (Number($(this).css('top').replace('px', '')) - Number(mainTbl.css('top').replace('px', ''))) + 'px') });
        mainTbl.css('margin-top', mainTbl.css('top')).css('top', '0px');
        try { mainTbl.parents('.rcrmFrameElement').first().css('margin-top', mainTbl.parents('.rcrmFrameElement').first().css('top')).css('top', '0px') } catch (e) { }
        
        c.find('#rcrm_document_main:not(.rcrmIncreased)').height(c.find('#rcrm_document_main:not(.rcrmIncreased)').height() + (pageCount * 20)).addClass('rcrmIncreased');
        if (mainTbl.parent().hasClass('rcrmDocElementContentFrame') && !mainTbl.parent().hasClass('rcrmIncreased')) mainTbl.parent().height(mainTbl.parent().height() + (pageCount * 20)).addClass('rcrmIncreased');
    }
    //-----------------------------------------------------------------------
};