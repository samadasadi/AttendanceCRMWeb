
$(function () {

    var commentResources = {
        fa: {
            viewPreviousMessage: "مشاهده پیام های قبلی",
            of: "از",
            search: "جستجو",
            attachs: "ضمایم",
            massageText: "متن پیام",
            file: "فایل",
            createLink: "ایجاد لینک",
            actions: "عملیات",
            save: "ذخیره",
            lang: "fa",
            linkText: "متن لینک",
            create: "ایجاد",
            nameCustomer: "نام مشتری",
            typeForFindCustomer: "برای پیدا کردن نام مشتری , تایپ کنید",
            userName: "نام کاربری",
            typeForFindUser: "برای پیدا کردن نام کاربر , تایپ کنید",
            enterLinkAddress: "آدرس لینک وارد شود",
            enterLinkText: "متن لینک وارد شود",
            edited: "ویرایش شده",
            deleted: "حذف شده",
            collaps: "جمع کردن",
            expand: "باز کردن",
            question_delete: "ایا از حذف مطمئن هستید؟",
            ReportGenerator_remove: "حذف",
            ReportGenerator_modify: "ویرایش",
            startTyping: "تایپ کنید",
            new_message: "نظر جدید",
            cap_by2: "توسط"
        },
        en: {
            viewPreviousMessage: "View Previouse Notes",
            of: "of",
            search: "Search",
            attachs: "Attachments",
            massageText: "Message",
            file: "File",
            createLink: "Create Link",
            actions: "Activities",
            save: "Save",
            lang: "en",
            linkText: "Link Text",
            create: "Creation",
            nameCustomer: "Customer Name",
            typeForFindCustomer: "For Find Customer Name Start Typing",
            userName: "User Name",
            typeForFindUser: "For Find User Name Start Typing",
            enterLinkAddress: "please Enter Link URL",
            enterLinkText: "please Enter Link Text",
            edited: "Edited",
            deleted: "Deleted",
            collaps: "Collaps",
            expand: "Expand",
            question_delete: "Are you sure you remove?",
            ReportGenerator_remove: "Delete",
            ReportGenerator_modify: "Edit",
            startTyping: "Start Typing",
            new_message: "New Comment",
            cap_by2: "By"
        }
    }
    
    $.fn.commentComponent = function (options, id, title) {
        if (typeof options === 'string') {
            var container = $(this);

            if (options == "setCode") {
                if (container != null && container != undefined && id != null && id != undefined) {
                    if (container.data().iconSelector == '') {
                        cCompRefresh(id, title);
                        container.find('.cCompCallGet').trigger('click');
                    }
                    else {
                        var cCompIconElem = $(container.data().iconSelector);
                        cCompIconElem.addClass('icon-spinner').css('color', '#2196f3').css('font-size', '17px').css('cursor', 'pointer').attr('CommentIconId', id);
                        cCompCheckEmpty(id, null);
                        if (container.data().unbind == true) {
                            cCompIconElem.unbind('click');
                        }
                        cCompIconElem.bind('click', function () {
                            $(this).addClass('icon-spinner');
                            cCompRefresh(id, title);
                            container.find('.cCompCallGet').trigger('click');
                        });
                    }
                }
            };

            if (options == "setCodeAttribute") {
                if (container != null && container != undefined && id != null && id != undefined) {
                    if (container.data().iconSelector == '') container.empty();
                    else {
                        var codeList = new Array();
                        var cCompIconElem = $(container.data().iconSelector);
                        cCompIconElem.each(function () {
                            var attr_id = $(this).attr(id);
                            var attr_title = null;
                            try { attr_title = $(this).attr(title); } catch (e) { };
                            codeList.push(attr_id);
                            $(this).addClass('icon-spinner').css('color', '#2196f3').css('font-size', '17px').css('cursor', 'pointer').attr('CommentIconId', attr_id);
                            $(this).bind('click', function () {
                                var ret = container.data().beforIconClick(attr_id);
                                if (ret == true || ret == undefined) {
                                    $(this).addClass('icon-spinner');
                                    cCompRefresh(attr_id, attr_title);
                                    container.find('.cCompCallGet').trigger('click');
                                };
                              
                            })
                        })
                        cCompCheckEmpty(codeList.join(';'), id);
                    }
                }
            };

            function cCompRefresh(elemId, elemTitle) {
                container.find(".cCompCommentTitle").attr("cCompCommentCode", elemId);
                container.find(".cCompCommentTitle").attr("cCompScrollIndex", 1);
                container.find(".cCompCurrentRow").text('0');
                container.find(".cCompTotalRow").text('0');
                container.find('.cCompViewComment').empty();
                try { $('.cCompUiDialog_' + container.data().mode).attr('cCompCode', elemId) } catch (e) { }
                if (elemTitle != null && elemTitle != '' && elemTitle != undefined) {
                    var link = '';
                    switch (container.data().mode) {
                        case 1:
                            link = ' <a href="#" onclick="showSaleInfo(' + elemId + ');return false;" class="cCompDialogTitle" style="color:#2d7bd1" >' + elemId + '</a>';
                            break;
                        case 2:
                            link = ' <a href="#" onclick="customer_Show_Info(' + elemId + ',\'\');return false;" class="cCompDialogTitle" style="color:#2d7bd1" >' + elemId + '</a>';
                            break;
                        case 4:
                            link = ' <a href="#" onclick="showFormInfo(' + elemId + ',\'\');return false;" class="cCompDialogTitle" style="color:#2d7bd1" >' + elemId + '</a>';
                            break;
                        case 5:
                            link = ' <a href="#" onclick="show_ticket(' + elemId + ',\'' + elemTitle + '\');return false;" class="cCompDialogTitle" style="color:#2d7bd1" >' + elemId + '</a>';
                            break;
                        default:
                            break;
                    };
                    var finalTitle =  elemTitle + link;
                    container.data().dialogTitle = finalTitle
                    var cCompTitleElem = $('#ui-dialog-title-' + container.attr('id'));
                    if (cCompTitleElem.find('.cCompDialogTitle').length != 0)
                        cCompTitleElem.find('.cCompDialogTitle').remove();
                    cCompTitleElem.html(finalTitle).addClass('cCompTitle').css('width', (container.data().width - 50)).attr('title', elemTitle);
                };
            };

            function cCompCheckEmpty(codesForCheck, codeAttr) {
                var elems = $(container.data().iconSelector);
                var e = {};
                var Send_ = {};
                e.d = $('#HFdomain').val();
                e.c = $('#HFcodeDU').val();
                e.u = $('#HFUserCode').val();
                e.CommentType = container.data().mode;
                e.CodeList = codesForCheck;

                Send_.searchobj = e;

                $.ajax({
                    url: "../WebServices/CommentServices.asmx/CheckEmptyOrFull_",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(Send_),
                    success: function (c) {
                        $(container.data().iconSelector).removeClass('icon-spinner');
                        if (c.d[0] == 1 && c.d[1] != null) {
                            try {
                                if (codeAttr == null) {
                                    if (c.d[1].length > 0)
                                        $(container.data().iconSelector).addClass(container.data().icon).removeClass(container.data().iconEmpty);
                                    else
                                        $(container.data().iconSelector).addClass(container.data().iconEmpty).removeClass(container.data().icon)
                                }
                                else {
                                    $(container.data().iconSelector).each(function () {
                                        var data = c.d[1];
                                        var code = $(this).attr(codeAttr);
                                        if (data.includes(code))
                                            $(this).addClass(container.data().icon).removeClass(container.data().iconEmpty);
                                        else
                                            $(this).addClass(container.data().iconEmpty).removeClass(container.data().icon);
                                    })
                                }
                            } catch (e) { }
                        }
                    }
                })
            };

        }
        else {
            var result;
            this.each(function () {
                result = (new $.commentComponent(options, $(this)));
            })
            return result;
        }
    };

    //-----------------------------------------------------------------------------

    $.commentComponent = function (options, Container) {

        Container.hide();
        var firstOption = options;
        options = $.extend({}, cCompDefaultOptionsComment, options);
        Container.data(options);
        
        try { if (options.lang == '') options.lang = resources.lang } catch (e) { }
        

        var cCompCommentInnerHtm = '<div class="cCompCommentTitle" cCompCommentCode="0" cCompScrollIndex="1" > ' +
                                   '<div class="cCompbox" ><div class="cCompMsgPlace" style="position: fixed; top: 60px; opacity: 0.9;"></div></div>' +
                                   '<div class="cCompMoreComment" >' + commentResources[options.lang].viewPreviousMessage + '</div>' +
                                   '<div class="cCompRecordCount" ><span class="cCompCurrentRow">0</span><span> ' + commentResources[options.lang].of + ' </span><span class="cCompTotalRow">0</span></div></div>' +
                                   '<i style="display:' + (options.search == true ? '' : 'none') + '"  class="cCompShowSearchMenu icon-search" title="' + commentResources[options.lang].search + '"></i>' +
                                   '<div class="cCompSearchMenu cCompHidden">' +
                                   '<input type="text" class="cCompTxtSearch" /> <input type="checkbox" class="cCompChkSearchAttach" /> <lable>' + commentResources[options.lang].attachs + '</lable>' +
                                   '</div>' +
                                   '<div class="cCompViewComment" style="max-height:' + options.height + options.widthHeightType + '" > </div>' +
                                   '<div class="cCompActionComment" >' +
                                   '<div class="cCompTxtContainer" >' +
                                   '<div class="cCompTxtComment" contenteditable="true" cCompCommentId="0" placeholder="' + commentResources[options.lang].massageText + ' ..."></div>' +
                                   '<div class="cCompToolsComment">' +
                                   '<div class="cCompDialogArea"></div>' +
                                   '<a style="display:' + (options.bold == true ? '' : 'none') + '"  class="cCompBtnBold cCompTools" data-command="bold" href="" title="Bold" > <i class="icon-bold"></i></a>' +
                                   '<a style="display:' + (options.italic == true ? '' : 'none') + '"   class="cCompBtnItalic cCompTools" data-command="italic" href="" title="Italic" > <i class="icon-italic"></i></a>' +
                                   '<a style="display:' + (options.underline == true ? '' : 'none') + '"  class="cCompBtnUnderline cCompTools" data-command="underline" href="" title="UnderLine" > <i class="icon-underline"></i></a>' +
                                   '<div class="cCompTools cCompBtnAttach" title="' + commentResources[options.lang].file + '" > <i class="icon-paperclip"></i></div>' +
                                   '<div class="cCompTools cCompBtnCreateLink" title="' + commentResources[options.lang].createLink + '" > <i class="icon-link"></i></div>' +
                                   '<div class="cCompTools cCompBtnHelp" title="Help" > <i class="icon-info"></i></div>' +
                                   '<div class="cCompTools cCompBtnEmojy" title="Emojy" > <i class="icon-smile-o"></i></div>' +
                                   '</div>' +
                                   '<div class="cCompButtonArea">' +
                                   '<div class="cCompShowMenu" title="' + commentResources[options.lang].actions + '"> <i class="icon-list"></i></div>' +
                                   '<div class="cCompBtnSaveComment">' + commentResources[options.lang].save + '</div>' +
                                   '<input type="button" class="cCompCallGet" style="display:none" >' +
                                   '</div></div><div class="cCompAttachmentArea"></div></div>';

        Container.html(cCompCommentInnerHtm);

        var cCompGetComments = function (cCompCallFromScroll) {

            var cCompScrollIndex = Number(Container.find(".cCompCommentTitle").attr("cCompScrollIndex"));

            if (cCompCallFromScroll == false || ((Container.find('.cCompBoxMessage').length >= options.maxDataLoad * cCompScrollIndex) && cCompCallFromScroll == true)) {

                if (cCompCallFromScroll == true)
                    Container.find(".cCompCommentTitle").attr("cCompScrollIndex", cCompScrollIndex + 1);
                else { //akhir
                    Container.find(".cCompCommentTitle").attr("cCompScrollIndex", 1); 
                    Container.find('.cCompViewComment').empty();
                }

                Container.find('.cCompViewComment').prepend('<div class="wait"></div>');

                var e = {};
                var Send_ = {};
                e.d = $('#HFdomain').val();
                e.c = $('#HFcodeDU').val();
                e.u = $('#HFUserCode').val();
                e.CommentType = options.mode;
                e.Code = Container.find(".cCompCommentTitle").attr("cCompCommentCode");
                e.Text = Container.find(".cCompTxtSearch").val() == '' ? null : Container.find(".cCompTxtSearch").val();
                e.viewAttachment = Container.find(".cCompChkSearchAttach").attr('checked');
                e.PageSize = options.maxDataLoad;
                e.PageNum = Container.find(".cCompCommentTitle").attr("cCompScrollIndex");
                Send_.searchobj = e;

                $.ajax({
                    url: "../WebServices/CommentServices.asmx/getComments_",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(Send_),
                    success: function (c) {
                        try {
                            if (options.iconSelector != '')
                                $(options.iconSelector).removeClass('icon-spinner');
                        } catch (e) { }
                        Container.find('.cCompViewComment').find('.wait').remove();
                        Container.find('.cCompCommentTitle').hide();
                        Container.find('.cCompCommentTitle').css('height', '0px');

                        if (c.d[0] == 1) {
                            if (c.d[1].length > 0) {
                                var meScrollIndex = Number(Container.find(".cCompCommentTitle").attr("cCompScrollIndex"));
                                Container.find('.cCompTotalRow').text(Number(c.d[1][0].TotalRow) - c.d[1].length);

                                for (var i = 0; i < c.d[1].length; i++) {
                                    cCompData = c.d[1][i];
                                    cCompAppendComments(cCompData.Id, cCompCallFromScroll, cCompData.UserCode, cCompData.Text, cCompData.UserName, cCompData.attachment_picture, cCompData.dateString, cCompData.time, cCompData.TimeAgo, c.d[1].length, 'prepend', null, true, cCompData.Attachment);
                                };

                                //تا مادامی که صفحه اسکرول نخورده عبارت مشاهده موارد بیشتر دیده خواهد شد 
                                if ((c.d[1][0].TotalRow > options.maxDataLoad)) {
                                    if (c.d[1][0].TotalRow != Container.find('.cCompBoxMessageContent').length) {
                                        Container.find('.cCompCommentTitle').css('height', '35px');
                                        Container.find('.cCompCommentTitle').show();
                                        Container.find('.cCompCommentTitle').click(function (e) {
                                            cCompGetComments(true);
                                            ///-----------------------------------
                                            Container.find('.cCompViewComment').scroll(function () {
                                                if (Container.find('.cCompViewComment').scrollTop() == 0)
                                                    cCompGetComments(true);
                                            });
                                        });
                                    }
                                }
                            }
                        };

                        if (options.openDialog == true)
                            Container.dialog("open");

                        //if (options.openDialog != false)
                        //    if (options.openDialog == 'onCreate') {
                        //        if (!CallFromSetCode)
                        //            Container.dialog("open");
                        //    }
                        //    else {
                        //        if (CallFromSetCode)
                        //            Container.dialog("open");
                        //    }

                    }
                });
            };
        };

        Container.find('.cCompTxtComment').focus(function () {
            ManageActionDiv('expand');
            var data = $(this).html();
            if ($(this).html() != '')
                $(this).html('').html(data + ' ');
        });
      
        //cCompGetComments(false, false);

        Container.addClass('cCompComment');

        if (commentResources[options.lang].lang == "en") {
            Container.addClass('cCompCommentEn');
            Container.find('.cCompTxtComment').css('direction', 'ltr');
            Container.find('.cCompToolsComment').css('text-align', 'left');
            Container.find('.cCompToolsComment').css('direction', 'ltr');
            Container.find('.cCompRecordCount').css('float', 'right');
            Container.find('.cCompButtonArea').css('float', 'right');
            Container.find('.cCompViewComment').css('padding', '7px 7px 0 7px'); 
            Container.find('.cCompTxtSearch').css('width', '170px');
        };

        Container.css('width', options.width + options.widthHeightType);

        Container.find('.cCompBtnSaveComment').click(function () {
            cCompSaveComments();
        });

        Container.find('.cCompCallGet').click(function () {
            Container.show();
            Container.find('.cCompViewComment').unbind("scroll");
            cCompGetComments(false);
        });

        Container.find('.cCompTools').live('click', function (e) {
            if ($(this).data('command') != undefined) {
                e.preventDefault();
                placeCaretAtEnd(document.getElementById(Container.attr('id')).getElementsByClassName('cCompTxtComment').item(0));
                document.execCommand($(this).data('command'));
                //Container.find('.cCompTxtComment').focus();
            }
        });

        Container.find('.cCompBtnCreateLink').click(function (e) {

            //مشخص کردن مکان دیالوگ لینک-------------------------------------------------------------------

            var cCompOffsetLeft = e.target.offsetLeft - 206;
            var cCompOffsetTop = e.target.offsetTop - 140;
            if (commentResources[options.lang].lang == 'en')
                cCompOffsetLeft = e.target.offsetLeft - 24;
            var cCompStyle = 'transform : translateX(' + cCompOffsetLeft  + 'px) translateY(' + cCompOffsetTop  + 'px) translateZ(0px)';

            //----------------------------------------------------------------------------------------------------

            var cCompLinkDiv = '<div class="cCompCommentLinkDiv" style="' + cCompStyle + '" class=""> ' +
                             '<span>' +
                                 '<div class="cCompPrivatePopoverDefault cCompPrivatePopover cCompuiPopover" style="position: relative;">' +
                                     '<div class="cCompuiPopoverArrow cCompPrivatePopover__arrow" style="border-top-color: transparent; border-left-color: transparent; width: 20px; height: 20px; transform: rotate(45deg); top: calc(100% - 10px); left:' + (commentResources[options.lang].lang == 'fa' ? '202px' : '19px') + '"></div>' +
                                     '<div>' +
                                         '<ul class="cCompPrivateListInline cCompDraftExtendPopoverControls cCompPx2 cCompPTop2">' +
                                            '<div class="cCompLinkRow" >' +
                                                '<div class="cCompLinkLbl" >URL</div>' +
                                                '<div><input class="cCompUrl" placeholder="http://" maxlength="70" /></div>' +
                                            '</div>' +
                                            '<div class="cCompLinkRow" >' +
                                                '<div class="cCompLinkLbl" >' + commentResources[options.lang].linkText + '</div>' +
                                                '<div><input class="cCompLinkTxt" placeholder="..." maxlength="100" /></div>' +
                                            '</div>' +
                                            '<div class="cCompLinkRow" ><input class="cCompLinkButton" type="button" value="' + commentResources[options.lang].create + '" /></div>' +
                                         '</ul>' +
                                     '</div>' +
                                 '</div>' +
                             '</span>' +
                             '</div>';

            Container.find('.cCompDialogArea').html(cCompLinkDiv);

            if (commentResources[options.lang].lang == "en") {
                Container.find('.cCompCommentLinkDiv').css('direction', 'ltr');
                Container.find('.cCompLinkButton').css('float', 'right');
                Container.find('.cCompLinkTxt').css('direction', 'ltr');
                Container.find('.cCompLinkTxt').css('text-align', 'left');
            }

            Container.find(".cCompCommentLinkDiv").show();

            Container.find('.cCompUrl').focus();
        });

        Container.find('.cCompBtnHelp').click(function (e) {

            //مشخص کردن مکان دیالوگ لینک-------------------------------------------------------------------

            var cCompOffsetLeft = e.target.offsetLeft - 124;
            var cCompOffsetTop = e.target.offsetTop - 171;
            var cCompStyle = 'transform : translateX(' + cCompOffsetLeft + 'px) translateY(' + cCompOffsetTop  + 'px) translateZ(0px)';

            //----------------------------------------------------------------------------------------------------

            var cCompInfoDiv = '<div class="cCompInfoDiv ltrrtl" style="' + cCompStyle + '" class=""> ' +
                             '<span>' +
                                 '<div class="cCompPrivatePopoverDefault cCompPrivatePopover cCompuiPopover" style="position: relative;">' +
                                     '<div class="cCompuiPopoverArrow cCompPrivatePopover__arrow" style="border-top-color: transparent; border-left-color: transparent; width: 20px; height: 20px; transform: rotate(45deg); top: calc(100% - 10px); left: 115px;"></div>' +
                                     '<div>' +
                                         '<ul class="cCompPrivateListInline cCompDraftExtendPopoverControls cCompPx2 cCompPTop2">' +
                                            '<div class="cCompLinkRow" style="margin-top:12px">' +
                                                '<div class="cCompLinkLbl cCompInsertSharp" >' + '# { ' + commentResources[options.lang].nameCustomer + ' }' + '</div>' +
                                            '</div>' +
                                             '<div class="cCompLinkRow" style="border-bottom:1px solid #ccc" >' +
                                                 '<div class="cCompLinkLbl" >' + commentResources[options.lang].typeForFindCustomer + '</div>' +
                                            '</div>' +
                                            '<div class="cCompLinkRow" style="margin-top:15px">' +
                                                 '<div class="cCompLinkLbl cCompInsertAtsign" >' + '@ { ' + commentResources[options.lang].userName + ' }' + '</div>' +
                                            '</div>' +
                                            '<div class="cCompLinkRow" >' +
                                                '<div class="cCompLinkLbl" >' + commentResources[options.lang].typeForFindUser + '</div>' +
                                            '</div>' +
                                         '</ul>' +
                                     '</div>' +
                                 '</div>' +
                             '</span>' +
                             '</div>';

            Container.find('.cCompDialogArea').html(cCompInfoDiv);

            Container.find('.cCompInsertSharp').click(function () {
                Container.find('.cCompTxtComment').append('#');
                Container.find(".cCompInfoDiv").hide();
                placeCaretAtEnd(document.getElementById(Container.attr('id')).getElementsByClassName('cCompTxtComment').item(0));
                Container.find('.cCompTxtComment').autocomplete('search');
            });

            Container.find('.cCompInsertAtsign').click(function () {
                Container.find('.cCompTxtComment').append('@')
                Container.find(".cCompInfoDiv").hide();
                placeCaretAtEnd(document.getElementById(Container.attr('id')).getElementsByClassName('cCompTxtComment').item(0));
                Container.find('.cCompTxtComment').autocomplete('search');
            });

            if (commentResources[options.lang].lang == "en") {
                Container.find('.cCompInfoDiv').css('direction', 'ltr');
            }

            Container.find(".cCompInfoDiv").show();
        });

        Container.find('.cCompLinkButton').live('click', function () {

            if (Container.find('.cCompUrl').val() == "") {
                alert(commentResources[options.lang].enterLinkAddress);
                return false;
            }

            if (Container.find('.cCompLinkTxt').val() == "") {
                alert(commentResources[options.lang].enterLinkText);
                return false;
            }

            Container.find(".cCompCommentLinkDiv").hide();
            Container.find('.cCompTxtComment').focus();
            document.execCommand("insertHTML", false, '<a contenteditable="false" target="_blank" href="http://' + Container.find('.cCompUrl').val() + '">' + Container.find('.cCompLinkTxt').val() + '</a>');
        });

        Container.find('.cCompBtnEmojy').click(function (e) {

            var cCompOffsetLeft = e.target.offsetLeft -205;
            var cCompOffsetTop = e.target.offsetTop -104;
            if (commentResources[options.lang].lang == 'en')
                cCompOffsetLeft = e.target.offsetLeft -24;

            var cCompStyle = 'transform : translateX(' + cCompOffsetLeft + 'px) translateY(' + cCompOffsetTop + 'px) translateZ(0px)';

            //----------------------------------------------------------------------------------------------------
           
            var cCompEmojyDiv = '<div class="cCompEmojyDiv" style="' + cCompStyle + '" class=""> ' +
                             '<span>' +
                                 '<div class="cCompPrivatePopoverDefault cCompPrivatePopover cCompuiPopover" style="position: relative;">' +
                                     '<div class="cCompuiPopoverArrow cCompPrivatePopover__arrow" style="border-top-color: transparent; border-left-color: transparent; width: 20px; height: 20px; transform: rotate(45deg); top: calc(100% - 10px); left:' + (commentResources[options.lang].lang == 'fa' ? '200px' : '17px') + '"></div>' +
                                     '<div>' +
                                         '<ul class="cCompPrivateListInline cCompDraftExtendPopoverControls cCompPx2 cCompPTop2">' +
                                            '<div class="cCompLinkRow" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-smiley.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-confuse.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-cool.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-cry.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-eek.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-kiss.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-lol.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-money.png" >' +
                                            '</div>' +
                                            '<div class="cCompLinkRow" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-neutral.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-razz.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-red.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-roll.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-sad.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-sleep.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-wink.png" >' +
                                                 '<img class="cCompImg" src="../Themes/resources/images/emoticon/smiley-yell.png" >' +
                                            '</div>' +
                                         '</ul>' +
                                     '</div>' +
                                 '</div>' +
                             '</span>' +
                             '</div>';

            Container.find('.cCompDialogArea').html(cCompEmojyDiv);
            Container.find(".cCompEmojyDiv").show();

        });

        Container.find('.cCompImg').live('click', function () {
            var emoticon = this.outerHTML.replaceAll('class="cCompImg"', '');
            Container.find('.cCompTxtComment').append(emoticon);
            placeCaretAtEnd(document.getElementById(Container.attr('id')).getElementsByClassName('cCompTxtComment').item(0));

        });

        Container.find('.cCompBtnAttach').live('click', function () {
            show_fileManager(3, function (item, urlmode) {

                $(item.dialogID).dialog("close");

                //---------------------------------------------------

                Container.find('.cCompAttachmentArea').append('<div class="cCompAttachmentRow" fileid="' + item.id + '">' +
                                                                '<div class="cCompAttachmentTitle" title="' + item.title + '">' + item.title + '</div>' +
                                                                '<i class="cCompAttachmentRemove icon-remove" ></i>' +
                                                              '</div>');
            });
        });

        Container.find('.cCompAttachmentRemove').live('click', function () {
            $(this).parent().remove();
            return false;
        });

        document.getElementById(Container.attr('id')).getElementsByClassName('cCompTxtComment').item(0).addEventListener("paste", function (e) {
            e.preventDefault();
            var cComptext = e.clipboardData.getData("text/plain");
            document.execCommand("insertHTML", false, cComptext);
        });

        Container.find('.cCompShowMenu').click(function (e) {
            var cCompOffsetLeft = e.target.offsetLeft - 9;
            var cCompOffsetTop = e.target.offsetTop -12 ;
            if (commentResources[options.lang].lang == 'en')
                cCompOffsetLeft = e.target.offsetLeft - 160;
            var width = '';
            if (options.width < 270) {
                width = '110px';
                cCompOffsetTop = cCompOffsetTop - 3;
                if (commentResources[options.lang].lang == 'fa') {
                    Container.find('.cCompToolsComment').css('text-align', 'left');
                    Container.find('.cCompDialogArea').css('text-align', 'right');
                }
                else cCompOffsetLeft = e.target.offsetLeft - 110;
            }

            Container.find('.cCompToolsComment').css('width', width).css('top', cCompOffsetTop + 'px').css('left', cCompOffsetLeft + 'px').stop().toggle('slide', { direction: (commentResources[options.lang].lang == 'fa' ? 'left' : 'right') }, 600);
        });
        
        Container.find('.cCompShowSearchMenu').click(function (e) {

            if (Container.find('.cCompSearchMenu').hasClass('cCompHidden')) {
                var cCompOffsetLeft = e.target.offsetLeft + 30;
                var cCompOffsetTop = e.target.offsetTop + 5 ;
                //if (commentResources[options.lang].lang == 'en')
                //    cCompOffsetLeft = e.target.offsetLeft - 160;

                Container.find('.cCompSearchMenu').css('top', cCompOffsetTop + 'px').css('left', cCompOffsetLeft + 'px').stop().removeClass('cCompHidden').addClass('cCompVisible').show('slide', 200); //, { direction: (commentResources[options.lang].lang == 'fa' ? 'left' : 'right') }
                Container.find('.cCompTxtSearch').focus();
            } else 
                Container.find('.cCompSearchMenu').removeClass('cCompVisible').addClass('cCompHidden').hide('slide', 200);
            
        });

        Container.find('.cCompTxtSearch').keyup(function () {
            cCompGetComments(false)
        });

        Container.find('.cCompChkSearchAttach').change(function () {
            cCompGetComments(false)
        });

        Container.find(".cCompTxtComment").keypress(function (e) {
            if (options.sendByEnter) {
                if (e.keyCode == 13 && !e.shiftKey) {
                    $(this).blur();
                    e.preventDefault();
                    cCompSaveComments();
                }
            }
        });

        $(document).click(function (event) {

            var cComptarget = $(event.target);
            var cCompmyclass = "defualtcomment"
            if (cComptarget.attr('class') != "")
                cCompmyclass = cComptarget.attr('class').split(' ')[0];

            if (!cComptarget.attr('class').match(/^icon-link/) && !cComptarget.attr('class').match(/^cCompBtnCreateLink/) && Container.find('.cCompCommentLinkDiv').find('.' + cCompmyclass).length == 0)
                Container.find(".cCompCommentLinkDiv").hide();

            if (!cComptarget.attr('class').match(/^icon-info/) && !cComptarget.attr('class').match(/^cCompBtnHelp/) && Container.find('.cCompInfoDiv').find('.' + cCompmyclass).length == 0)
                Container.find(".cCompInfoDiv").hide();

            if (!cComptarget.attr('class').match(/^icon-smile-o/) && !cComptarget.attr('class').match(/^cCompBtnEmojy/) && !cComptarget.is('img') && Container.find('.cCompEmojyDiv').find('.' + cCompmyclass).length == 0)
                Container.find(".cCompEmojyDiv").hide();
          
            if (!cComptarget.attr('class').match(/^icon-edit/) && !cComptarget.attr('class').match(/^cCompActionComment/) &&
                $('.cCompActionComment').find('.' + cCompmyclass).length == 0 && $('#UCdialog_FileManager').find('.' + cCompmyclass).length == 0 &&
                $('.ui-autocomplete').find('.' + cCompmyclass).length == 0 && cComptarget.parents('.cCompTxtComment').length == 0)
                ManageActionDiv('collaps');

            if (!cComptarget.attr('class').match(/^cCompShowMenu/) && !cComptarget.attr('class').match(/^icon-list/) && $('.cCompToolsComment').find('.' + cCompmyclass).length == 0 && $('.ui-autocomplete').find('.' + cCompmyclass).length == 0) 
                Container.find('.cCompToolsComment').hide();

            if (!cComptarget.attr('class').match(/^cCompShowSearchMenu/) && !cComptarget.attr('class').match(/^cCompSearchMenu/) && $('.cCompSearchMenu').find('.' + cCompmyclass).length == 0 && Container.find('.cCompSearchMenu').hasClass('cCompVisible'))
                Container.find('.cCompSearchMenu').removeClass('cCompVisible').addClass('cCompHidden').hide('slide', 200);

            if ((cComptarget.attr('class').match(/^ui-dialog-titlebar/)) || (cComptarget.attr('class').match(/^ui-dialog-title/))) 
                Container.find('.cCompTxtComment').blur();

        });

        //functions ===============================================================================================

        var cCompAppendComments = function (Id, cCompCallFromScroll, userCode, text, userName, attachmentPicture, dateString, time, timeAgo, dataCount, appendType, place, increaseNumber, attachments) {

            if (Container.find('.cCompBoxMessage[cCompMessageId="' + Id + '"]').length == 0) {

                var cCompEdited = text.includes('[crmedited]') ? '<span class="cCompStatusEdit" title=""> ' + commentResources[options.lang].edited + '</span>' : '';
                var cCompDeleted = text.includes('[crmdeleted]') ? '<span class="cCompStatusDelete" title=""> ' + commentResources[options.lang].deleted + '</span>' : '';
                text = text.replaceAll('[crmedited]', '');
                text = text.replaceAll('[crmdeleted]', '');
                var cCompScrollIndex = Number(Container.find(".cCompCommentTitle").attr("cCompScrollIndex"));

                var cComphtm = '<div class="cCompBoxMessage" cCompMessageId="' + Id + '" from="' + userCode + '">' +
                                 '<div class="cCompBoxUserPic rtl-right_left">' +
                                 '<img src="' + (attachmentPicture == null || attachmentPicture == "" ? "../themes/resources/images/noimage.jpg" : attachmentPicture) +
                                 '" title="' + (userName == null ? "" : userName) + '" class="cCompUserPic"></div>' +
                                 '<div class="cCompMessageTools" ></div>' +
                                 '<div class="cCompBoxMessageContent rtl-right_left" >' +
                                 '<div class="cCompItemMessage ' + (options.expand == false ? 'cCompMinus' : 'cCompExpand') + '" ></div>' +
                                 '<div class="cCompAttachmentView" ></div>' +
                                 '<div class="cCompDate2">' +
                                   '<div class="cCompEdited">' + cCompEdited + '</div>' +
                                   '<div class="cCompDeleted">' + cCompDeleted + '</div>' +
                                   '<div class="cCompUserName">' + userName + '</div>' +
                                   '<div class="cCompShowType"></div>' +
                                   '<div class="cCompTime">' +
                                      '<div class="icon-time" style="display:inline-block" title="' + time + '"></div>' +
                                      '<div class="cCompDateTime" style="display:inline-block" title="' + dateString.day_name + ' ' + dateString.day + ' ' + dateString.month_name + '">' + timeAgo + '</div>' +
                                   '</div>' +
                                '</div>' +
                              '</div></div>';

                switch (appendType) {
                    case 'prepend': Container.find('.cCompViewComment').prepend(cComphtm); break;
                    case 'append': Container.find('.cCompViewComment').append(cComphtm); break;
                    case 'after': place.after(cComphtm); break;
                    default: break;
                };

                
                if (options.width < 280)
                    $('.cCompEdited ,.cCompDeleted ,.cCompUserName ,.cCompShowType ,.cCompTime ').css('display', 'block');
                else
                    $('.cCompEdited ,.cCompDeleted ,.cCompUserName ,.cCompShowType ,.cCompTime ').css('padding', '0 3px')

                if (increaseNumber) {
                    Container.find('.cCompCurrentRow').text((Number(Container.find('.cCompCurrentRow').text()) + 1).toString());
                    Container.find('.cCompTotalRow').text((Number(Container.find('.cCompTotalRow').text()) + 1).toString());
                }

                var myElem = Container.find('.cCompBoxMessage[cCompMessageId="' + Id + '"]');

                myElem.find('.cCompItemMessage').html(text.replace(/\n/ig, '<br />'));

                setTimeout(function () {
                    myElem.find('.cCompBoxMessageContent').css('width', myElem.width() - 122 + 'px');
                    if (myElem.find('.cCompItemMessage')[0].offsetHeight > 47) {
                        if (options.expand == true)
                            myElem.find('.cCompShowType').html(commentResources[options.lang].collaps).addClass('cCompCollapsTxt').removeClass('cCompExpandTxt');
                        if (options.expand == false)
                            myElem.find('.cCompShowType').html(commentResources[options.lang].expand).addClass('cCompExpandTxt').removeClass('cCompCollapsTxt');
                    }
                }, 5);

                if (!($('#HFUserCode').val() == userCode))
                    myElem.find('.cCompBoxMessageContent').css('background-color', '#fff');

                if (commentResources[options.lang].lang == 'en') {
                    myElem.find('.cCompBoxUserPic').removeClass('rtl-right_left').addClass('ltr-left_right');
                    myElem.find('.cCompBoxMessageContent').removeClass('rtl-right_left').addClass('ltr-left_right');
                    myElem.find('.cCompCi').css('right', '0').css('left', '35px');
                    myElem.find('.cCompMessageTools').css('float', 'right').css('margin-right', '10px').css('margin-left', '0px').css('text-align', 'right');
                    myElem.find('.cCompItemMessage').css('text-align', 'left').css('direction', 'ltr');
                    myElem.find('.cCompDate2').css('text-align', 'left').css('direction', 'rtl');
                    myElem.find('.cCompDate2').find('div').css('text-align', 'left').css('direction', 'ltr');
                    myElem.find('.cCompDate2').find('.icon-time').css('margin', '0 6px 0 0'); 
                    myElem.find('.cCompAttachmentView').css('float', 'right');
                }

                if (cCompDeleted != "") {
                    myElem.find('.cCompItemMessage').hide();
                    myElem.find('.cCompDate2').find('div').css('margin', '0');
                };

                if (cCompCallFromScroll)
                    if ((dataCount % options.maxDataLoad) == 0)
                        Container.find('.cCompViewComment').scrollTop((Container.find('.cCompViewComment')[0].scrollHeight / (cCompScrollIndex)) - 40);

                if (!cCompCallFromScroll)
                    Container.find('.cCompViewComment').scrollTop(Container.find('.cCompViewComment')[0].scrollHeight - Container.find('.cCompViewComment')[0].clientHeight);

                myElem.mouseenter(function () {
                    if (cCompDeleted == "") {
                        if (options.changeOnlyMaster) {
                            if ($('#HFUserCode').val() == 'master')
                                cCompMangeEditRemoveShow(this);
                        }
                        else if ($('#HFUserCode').val() == $(this).attr('from') || $('#HFUserCode').val() == 'master') cCompMangeEditRemoveShow(this);
                    };
                });

                myElem.mouseleave(function () {
                    $(this).find('.cCompMessageTools .icon-edit').remove();
                    $(this).find('.cCompMessageTools .icon-trash').remove();
                });

                Container.find('.cCompExpandTxt').live('click', function () {
                    var myElem = this
                    $(this).hide().addClass('cCompCollapsTxt').removeClass('cCompExpandTxt');
                    $(this).parents('.cCompBoxMessage').find('.cCompItemMessage').removeClass('cCompMinus').addClass('cCompExpand');
                    setTimeout(function () { $(myElem).html(commentResources[options.lang].collaps).show() }, 800);
                });

                Container.find('.cCompCollapsTxt').live('click', function () {
                    var myElem = this
                    $(this).hide().addClass('cCompExpandTxt').removeClass('cCompCollapsTxt');
                    $(this).parents('.cCompBoxMessage').find('.cCompItemMessage').removeClass('cCompExpand').addClass('cCompMinus');
                    setTimeout(function () { $(myElem).html(commentResources[options.lang].expand).show() }, 800);
                });

                if (attachments != null && attachments != '') {
                    $.each(attachments, function (i, item) {
                        console.info(item);
                        if (item.type != 0) {
                            var cCompFileTxt = "";
                            if(item.type == 1)  
                                cCompFileTxt = '<a fileId="' + item.id + '" fileName="' + item.filename + '" target="_blank" href="' + item.relative_url + '" class="cCompAttachElem" ><img class="cCompMediaBeforeLoad" src="../Themes/resources/images/movewait2.gif"><img class="cCompChatMessageMedia" style="display:none" onLoad="$(this).parent().find(\'.cCompMediaBeforeLoad\').hide();$(this).show();" title="' + item.filename + '" src="' + item.thumb + '"></a>'
                            else
                                cCompFileTxt = '<a fileId="' + item.id + '" fileName="' + item.filename + '" target="_blank" href="' + item.relative_url + '" class="cCompAttachElem" ><span class="cCompChatMessageMedia" title="' + item.filename + '">' + item.filename + '</span></a>';

                            myElem.find('.cCompAttachmentView').append(cCompFileTxt).css('width', '20%');
                            myElem.find('.cCompItemMessage').css('width', '72%');
                        }
                    });
                };

            };
        };

        

        var cCompSaveComments = function () {

            Container.find('.cCompBtnSaveComment').html('<div class="wait"></div>').css('pointer-events', 'none').css('padding', '7px 15px');
            var cCompCreateSaveTextResult = cCompCreateSaveText();
            var e = {};
            var Send_ = {};
            e.d = $('#HFdomain').val();
            e.c = $('#HFcodeDU').val();
            e.u = $('#HFUserCode').val();
            e.Id = Container.find('.cCompTxtComment').attr('cCompCommentId');
            e.CommentType = options.mode;
            e.Code = Container.find(".cCompCommentTitle").attr("cCompCommentCode");
            e.Text = cCompCreateSaveTextResult.Text;
            e.UserList = cCompCreateSaveTextResult.UserList;
            e.Attachment = cCompCreateSaveTextResult.Attachment == '' ? null : cCompCreateSaveTextResult.Attachment;
            options.dialogTitle = Container.data().dialogTitle;
            e.Settings = JSON.stringify(options)
            Send_.SaveObj = e;

            $.ajax({
                url: "../WebServices/CommentServices.asmx/SaveComment_",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(Send_),
                success: function (c) {
                    Container.find('.cCompBtnSaveComment').html(commentResources[options.lang].save).css('pointer-events', 'auto').css('padding', '9px 15px');
                    cCompRefreshComments();
                    ManageActionDiv('collaps');
                    if (c.d[0] != 0) {
                        if (e.Id == 0)  // اگر اینزرت باشد
                            cCompAfterSave(c.d[0]);
                        else 
                            cCompAfterEdit(c.d[0]);
                    }
                    else cCompShowMessage(c.d[1]);
                }
            });
        };

        var cCompCreateSaveText = function () {
            var cCompUserListArr = new Array();
            var cCompAttachmentArr = new Array();
            Container.find('.cCompCrmCallUser').each(function () {
                cCompUserListArr.push($(this).attr('usercode'));
                $(this).remove();
            });
            Container.find('.cCompAttachmentArea').find('.cCompAttachmentRow').each(function () {
                cCompAttachmentArr.push($(this).attr('fileid'));
            });
            if (Container.attr('caller') != undefined && Container.attr('caller') != '' && Container.attr('caller') != $('#HFUserCode').val()) {
                cCompUserListArr.push(Container.attr('caller'));
                Container.removeAttr('caller');
            }
            return { Text: Container.find('.cCompTxtComment').html(), UserList: cCompUserListArr, Attachment: cCompAttachmentArr.join(',') };
        };

        var cCompDeleteComments = function (Id) {

            if (!confirm(commentResources[options.lang].question_delete)) return false;

            var e = {};
            var Send_ = {};
            e.d = $('#HFdomain').val();
            e.c = $('#HFcodeDU').val();
            e.u = $('#HFUserCode').val();
            e.Id = Id;
            e.CommentType = options.mode;
            e.Code = Container.find(".cCompCommentTitle").attr("cCompCommentCode");
            Send_.DelObj = e;

            $.ajax({
                url: "../WebServices/CommentServices.asmx/TempDeleteComment_",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(Send_),
                success: function (c) {
                    if (c.d[0] != 0) 
                        cCompAfterEdit(c.d[0]);
                }
            });
        };

        var cCompRefreshComments = function () {
            Container.find('.cCompAttachmentArea').html("");
            Container.find('.cCompTxtComment').html("");
            Container.find('.cCompTxtComment').attr('cCompCommentId', '0');
        };

        var cCompShowMessage =function (message) {
            Container.find('.cCompMsgPlace').html(message).fadeIn();
            setTimeout(function () { Container.find('.cCompMsgPlace').fadeOut(function () { $(this).empty(); }); }, 3000);
        };
    
        addSocketEventListener("Comment", function (data) {
            if (data.UserCode != $('#HFUserCode').val()) {
                if (options.mode == data.CommentType && Container.find(".cCompCommentTitle").attr("cCompCommentCode") == data.Code) {
                    if (data.Action == "Save") {
                        cCompAfterSave(data);
                        try { $('[CommentIconId=' + data.Code + ']').addClass(options.icon).removeClass(options.iconEmpty); } catch (e) { }
                    } else if (data.Action == "Edit") {
                        cCompAfterEdit(data);
                        try {
                            if (data.Empty == true)
                                $('[CommentIconId=' + data.Code + ']').addClass(options.iconEmpty).removeClass(options.icon);
                            else
                                $('[CommentIconId=' + data.Code + ']').addClass(options.icon).removeClass(options.iconEmpty);
                        } catch (e) { }
                    }
                };
            }
        });

        var cCompAfterSave = function (cCompData) {
            if (Container.find('.cCompBoxMessage[cCompMessageId="' + cCompData.Id + '"]').length == 0) {
                Container.find('.cCompTxtComment').attr('cCompCommentId', '0');
                cCompAppendComments(cCompData.Id, false, cCompData.UserCode, cCompData.Text, cCompData.UserName, cCompData.attachment_picture, cCompData.dateString, cCompData.time, cCompData.TimeAgo, 0, 'append', null, true, cCompData.Attachment);
                cCompShowMassage(cCompData.Id);
            };
        }

        var cCompAfterEdit = function (cCompData) {
            var type = 'after';
            var myElem = Container.find('.cCompBoxMessage[cCompMessageId="' + cCompData.Id + '"]');
            var place = myElem.prev();
            if (place.length == 0) {
                type = 'prepend';
                place = null;
            }
            myElem.remove();
            cCompAppendComments(cCompData.Id, false, cCompData.UserCode, cCompData.Text, cCompData.UserName, cCompData.attachment_picture, cCompData.dateString, cCompData.time, cCompData.TimeAgo, 0, type, place, false, cCompData.Attachment);
            cCompShowMassage(cCompData.Id);
        };

        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.split(search).join(replacement);
        };

        var cCompMangeEditRemoveShow  = function (elem) {

            if (options.removeable)
                $(elem).find('.cCompMessageTools').prepend('<i class="icon-trash" title="' + commentResources[options.lang].ReportGenerator_remove + '"></i>').show();
            if (options.editable)
                $(elem).find('.cCompMessageTools').prepend('<i class="icon-edit" title="' + commentResources[options.lang].ReportGenerator_modify + '"></i>').show();

            $(elem).find('.cCompMessageTools').find('.icon-edit').click(function () {
                Container.find('.cCompTxtComment').html($(this).parents('.cCompBoxMessage').find('.cCompItemMessage').html());
                Container.find('.cCompTxtComment').attr('cCompCommentId', $(this).parents('.cCompBoxMessage').attr('cCompMessageId'));
                Container.find('.cCompAttachmentArea').empty();
                $(this).parents('.cCompBoxMessage').find('.cCompAttachmentView').find('a').each(function () {
                    Container.find('.cCompAttachmentArea').append('<div class="cCompAttachmentRow" fileid="' + $(this).attr('fileid') + '">' + 
                                                                    '<div class="cCompAttachmentTitle" title="' + $(this).attr('fileName') + '">' + $(this).attr('fileName') + '</div>' +
                                                                    '<i class="cCompAttachmentRemove icon-remove" ></i>' +
                                                                  '</div>');
                });
                ManageActionDiv('expand');
            });

            $(elem).find('.cCompMessageTools').find('.icon-trash').click(function () {
                cCompDeleteComments($(this).parents('.cCompBoxMessage').attr('cCompMessageId'));
            });

        };

        var cCompShowMassage = function (Id) {
            var newElem = Container.find('.cCompBoxMessage[cCompMessageId="' + Id + '"]');
            newElem.animate({ 'background-color': '#f5f5f5' }, 200, function () { newElem.delay(500).animate({ 'background-color': '#fff' }, 800); });
        };

        var ManageActionDiv = function (type) {
            if (type == 'collaps') {
                //cCompRefreshComments();
                Container.find('.cCompTxtComment').removeClass('cCompTxtExpand').addClass('cCompTxtCollaps').animate({ 'min-height': "20px" }, 300);
                Container.find('.cCompActionComment').addClass('cCompActCollaps').removeClass('cCompActExpand');
                Container.find('.cCompTxtContainer').animate({ 'min-height': "40px" }, 300);
                Container.find('.cCompShowMenu').hide();
                Container.find('.cCompButtonArea').hide();
                Container.find('.cCompAttachmentArea').hide();
            }
            else {
                if (options.textHeightGrowDuble)
                    Container.find('.cCompTxtComment').css('max-height', '84px');
                else
                    Container.find('.cCompTxtComment').css('max-height', '42px');

                Container.find('.cCompTxtComment').addClass('cCompTxtExpand').removeClass('cCompTxtCollaps').animate({ 'min-height': "34px" }, 300);
                Container.find('.cCompActionComment').addClass('cCompActExpand').removeClass('cCompActCollaps').animate({ 'min-height': "50px" }, 300);
                Container.find('.cCompTxtContainer').animate({ 'min-height': "40px" }, 300);
                Container.find('.cCompShowMenu').css('display', 'inline-block');
                Container.find('.cCompButtonArea').show();
                Container.find('.cCompAttachmentArea').show();
            }
        };

        //autocomplete -------------------------------------------------------------------------

        var cCompStartTyping = commentResources[options.lang].startTyping + ' . . . ';

        Container.find('.cCompTxtComment').autocomplete({
            minLength: 0,
            html: true,
            source: function (request, response) {
                var term = request.term
                var results = [];

                if (term.indexOf("@") >= 0 || term.indexOf("#") >= 0) {
                    if (term.lastIndexOf("#") > term.lastIndexOf("@")) {
                        //بخش # ====================================================================
                        term = cCompExtractLast(request.term, "#");
                        if (term.length > 0 && term.trim() != '') {

                            var e = {};
                            e.q = term.replace(/\n/ig, '').trim();
                            e.domain = $('#HFdomain').val();
                            e.user_code = $('#HFUserCode').val();
                            e.r = $("#HFRnd").val();
                            e.a = "";
                            e.g = "";

                            jQuery.ajax({
                                type: "POST",
                                url: "../pages/SearchHandler.ashx",
                                data: e,
                                dataType: "json",
                                success: function (e, xhr) {
                                    for (var i = 0; i < e.length; i++) {
                                        e[i].type = "#";
                                    }
                                    response(e);
                                    Container.find('.cCompTxtComment').removeClass('ui-autocomplete-loading');
                                }
                            });

                        } else {
                            response([cCompStartTyping]);
                            Container.find('.cCompTxtComment').removeClass('ui-autocomplete-loading');
                        }
                    } else {
                        // بخش @ =========================================================================
                        term = cCompExtractLast(request.term, "@");

                        if (term.length > 0 && term.trim() != '') {
                            //if (term.indexOf('،') == -1) {
                                var e = {};
                                var Send_ = {};
                                e.q = term.replace(/\n/ig, '').trim();
                                e.domain = $('#HFdomain').val();
                                e.user_code = $('#HFUserCode').val();
                                e.codeing = $('#HFcodeDU').val();
                                Send_.items = e;

                                $.ajax({
                                    url: "../WebServices/get_info.asmx/SearchUserForAutoComplte_",
                                    type: "POST",
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    data: JSON.stringify(Send_),
                                    success: function (c) {
                                        for (var i = 0; i < c.d.length; i++) {
                                            c.d[i].type = "@";
                                        }
                                        response(c.d);
                                        Container.find('.cCompTxtComment').removeClass('ui-autocomplete-loading');
                                    }
                                });
                            //} else Container.find('.cCompTxtComment').removeClass('ui-autocomplete-loading');
                        }
                        else {
                            response([cCompStartTyping]);
                            Container.find('.cCompTxtComment').removeClass('ui-autocomplete-loading');
                        }
                    }
                    //===========================================================================================
                }
                else response(results);
            },
            focus: function () {
                return false;
            },
            select: function (event, ui) {
                if (ui.item.value !== cCompStartTyping) {
                    var cCompvalue = $(this).html();
                    var cComptype = ui.item.type;
                    var terms = cCompSplit(cCompvalue, cComptype);
                    terms.pop();
                    if (cComptype == '#')
                        terms.push('<a href="#" onclick="customer_Show_Info(' + ui.item[1].replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') + ',\'' + ui.item[0].replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') + '\');return false;">' + ui.item[0].replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') + '</a>');
                    else {
                        terms.push(ui.item.name.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ''));
                        terms.push(' <span class="cCompCrmCallUser" UserCode="' + ui.item.code + '" ></span> ');
                    }

                    $(this).html(terms.join(' '));
                    placeCaretAtEnd(this);
                }
                return false;
            },
            position: { my: (commentResources[options.lang].lang == 'fa' ? "right top" : "left top"), at: (commentResources[options.lang].lang == 'fa' ? "right bottom" : "left bottom") }
        }).data("autocomplete")._renderItem = function (ul, item) {
            ul.addClass('CommentAuto');
            var classname
            if (commentResources[options.lang].lang == 'en') {
                Container.find('.cCompAutoCompleteSearch').css('float', 'left');
                Container.find('.cCompAutoCompleteSearchCode').css('float', 'right');
            };

            if (item.label != cCompStartTyping) {
                if (item.type == '#') {
                    return $('<li class="cCompli"></li>')
                   .data("item.autocomplete", item)
                   .append("<a class='cCompAutoCompleteSearchCurent'><div class='" + (commentResources[options.lang].lang == 'fa' ? 'cCompAutoCompleteSearch' : 'cCompAutoCompleteSearchEn') +
                           "'>" + item[0].replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') + "</div><div class='" +
                           (commentResources[options.lang].lang == 'fa' ? 'cCompAutoCompleteSearchCode' : 'cCompAutoCompleteSearchCodeEn') + "'>" +
                           item[1].replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') + "</div></a>").appendTo(ul);
                } else if (item.type == '@') {
                    return $('<li class="cCompli"></li>')
                  .data("item.autocomplete", item)
                  .append("<a class='cCompAutoCompleteSearchCurent'><div class='" + (commentResources[options.lang].lang == 'fa' ? 'cCompAutoCompleteSearch' : 'cCompAutoCompleteSearchEn') +
                           "'>" + item.name.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') + "</div><div class='" +
                           (commentResources[options.lang].lang == 'fa' ? 'cCompAutoCompleteSearchCode' : 'cCompAutoCompleteSearchCodeEn') + "'>" +
                           item.code.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') + "</div></a>").appendTo(ul);
                }
            } else {
                return $('<li class="cCompli"></li>')
                    .data("item.autocomplete", item)
                    .append('<a>' + item.label + '</a>')
                    .appendTo(ul);
            }
        };

        var placeCaretAtEnd = function (el) {
            el.focus();
            if (typeof window.getSelection != "undefined"
                    && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        };

        var cCompSplit = function (val, type) {
            if (type == "#")
                return val.split(/#/);
            else if (type == "@")
                return val.split(/@/);
        };

        var cCompExtractLast = function (term, type) {
            return cCompSplit(term, type).pop();
        };

        if (options.openDialog != false) {
            Container.dialog({
                autoOpen: false,
                modal: true,
                width: options.widthHeightType == "px" ? options.width + 50 : '500px',
                resizable: false,
                title: options.dialogTitle,
                open: options.openDialogCallBack,
                beforeClose: options.closeDialogCallBack,
                dialogClass: 'cCompUiDialog_' + options.mode,
            });
        };

    };

    //جهت کار کردن اتوکامپلت در جیکوری 1.4 برای کانتنت ادیت ایبل دایو ---------------------------------------------------------------------

    (function ($) {
        var original = $.fn.val;
        $.fn.val = function () {
            if ($(this).hasClass('cCompTxtComment')) {
                return $.fn.text.apply(this, arguments);
            };
            return original.apply(this, arguments);
        };
    })(jQuery); 

    //options -----------------------------------------------------------------------------

    var cCompModeEnum = { nothing: 0, sale: 1, customer: 2, events: 3, form : 4 ,support : 5 }
    var cCompDefaultOptionsComment = {
        mode: cCompModeEnum.nothing,
        width: 500,
        dialogWidth: 0,
        height: 350,
        widthHeightType: 'px',
        textHeightGrowDuble: false,
        maxDataLoad: 20,
        expand: true,
        editable: true,
        removeable: true,
        changeOnlyMaster: false,
        openDialog: false,
        dialogTitle: '',
        sendByEnter: false,
        icon: 'icon-comment-alt-lines',
        iconEmpty: 'icon-comment-alt',
        iconSelector: '',
        openDialogCallBack: function () { },
        closeDialogCallBack: function () { },
        beforIconClick: function () { },
        search: true,
        bold: true,
        italic: true,
        underline: true,
        lang: '',
        unbind:false
    };

});