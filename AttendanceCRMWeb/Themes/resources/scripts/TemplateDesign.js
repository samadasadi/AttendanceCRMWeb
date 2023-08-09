

$(function () {

    $.fn.rcrmTemplateDesign = function (options, html, templateId ,templateName, templateType , emailTextParent, custGroupId, userGroupId, custGroupName, userGroupName) { //templateStatus
        if (typeof options === 'string') {
            var container = $(this);
            if (options == "LoadHtml") if (html != null && html != undefined) rcrmMethods.LoadHtml(html, templateId, templateName, templateType, emailTextParent, custGroupId, userGroupId, custGroupName, userGroupName); //, templateStatus
            if (options == "RefreshTemplateDesign") rcrmMethods.RefreshTemplateDesign(html);
            if (options == "GetHtml") return rcrmMethods.GetHtml();
            if (options == "ImportFile") return rcrmMethods.ImportFile();
            if (options == "FormFieldChange") rcrmMethods.FormFieldChange(html);
        }
        else { var result = new $.rcrmTemplateDesign(options, $(this)); return result; }
    };

    $.rcrmTemplateDesign = function (options, Container) {
        var rcrmOptions = $.extend({}, rcrmDefaultOptions, options);
        var rcrmUndoStack = [];
        var rcrmRedoStack = [];
        var rcrmStackLength = 10;
        var rcrmPointSpace = 10;
        var rcrmBeforeHtml = "";
        var rcrmInstanceList = new Array();
        var rcrmIdpointer = 0;
        var rcrmAllSetting = {};
        var rcrmMenuBreakWidth = 930; //884 
        var rcrmSelectedElement = "";
        var rcrmEmailTextEditor = null;
        rcrmMethods.LoadHtml = rcrmLoadHtml;
        rcrmMethods.RefreshTemplateDesign = rcrmRefreshTemplateDesign;
        rcrmMethods.GetHtml = rcrmGetHtml;
        rcrmMethods.ImportFile = rcrmImportFile;
        rcrmMethods.FormFieldChange = rcrmFormFieldChange;
        var rcrmIsEmail = rcrmOptions.templateType != 'factor' && rcrmOptions.templateType != 'sms_show' && rcrmOptions.templateType != 'fax' && rcrmOptions.templateType != 'Customer';
        var rcrmIsFactor = rcrmOptions.templateType == 'factor' || rcrmOptions.templateType == 'sms_show' || rcrmOptions.templateType == 'fax' || rcrmOptions.templateType == 'Customer';
        var rcrmRes = {
            lang: resources.calander,
            cancel: resources.cancel,
            select: resources.select,
            color: resources.color,
            image_align : resources.image_align,
            source : resources.source,
            enterName : resources.msg_error_enter_name,
            stamp_add_before : resources.stamp_add_before,
            enter_name : resources.msg_error_enter_name,
            column : resources.column,
            row : resources.row,
            and : resources.and,
            merge : resources.merge,
            didnt_done : resources.didnt_done,
            ok : resources.ok,
            add_parameter : resources.add_parameter,
            start_typing  : resources.start_typing ,
            select_links : resources.select_links,
            all_groups : resources.all_groups,
            button : resources.button,
            linkText : resources.linkText
        };
       
        rcrmLoadUserControl(); //if (Container.find('#reportcrm').length == 0) rcrmLoadUserControl(); else rcrmRefreshTemplateDesign(); 

        function rcrmDocumentReady() {

            Container.find('#rcrm_document_main,#reportcrm').addClass('rcrm_' + rcrmRes.lang);
            if(rcrmRes.lang == 'en'){ 
                $('.rcrmPopupItemHeader[value=F_cost]').parents('li').hide();
                $('.rcrmPopupItemHeader[value=F_tax]').parents('li').hide();
                $('.rcrmPopupItemHeader[value=F_tax_percent]').parents('li').hide();
                $('.rcrmPopupItemHeader[value=F_taxAlfa]').parents('li').hide();
                $('.rcrmPopupItemHeader[value=F_costAlfa]').parents('li').hide();
            }

            rcrmBeforeHtml = Container.find('#rcrm_document_panel').html();

            rcrmBindContinerEvents();

            Container.find('#rcrm_menu_toggle_grid').bind('click', function () {
                $(this).toggleClass('rcrmButtonActive');
                $(this).blur();
                Container.find('#rcrm_content').toggleClass('rcrmDocumentGrid');
                if($(this).hasClass('rcrmButtonActive')) Container.find('#rcrm_detail_panel .rcrm_page_pointspace_row').show();
                else Container.find('#rcrm_detail_panel .rcrm_page_pointspace_row').hide();
                rcrmChangePointSpace();
            });
            
            Container.find('#rcrm_menu_toggle_border').bind('click', function () {
                $(this).toggleClass('rcrmButtonActive');
                $(this).blur();
                rcrmSetAllElementBorder();
            });

            Container.find('#rcrm_menu_page_setting').bind('click' , function () {
                var elemObj = rcrmFindElementInstance('#rcrm_document_main', true);
                if (elemObj != null){
                    rcrmRemoveSelected();
                    elemObj.appendSetting(Container.find('#rcrm_document_main'));
                    elemObj.updateSetting(Container.find('#rcrm_document_main'));
                    Container.find('#rcrm_document_main').addClass('rcrmDocumentSetting');
                    Container.find('.rcrmPopupWindow').addClass('rcrmHidden');
                }
            });
            
            Container.find('#rcrm_menu_page_setting').trigger('click');

            Container.find('#rcrm_menu_save').bind('click' , function() {
                rcrmSave();
            }); 

            Container.find('#rcrm_menu_copy').click(function () {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(elem.length > 0 && !elem.hasClass('rcrmTableTextElement')){
                    rcrmCopyElement(elem);
                    rcrmChangeHtml();
                }
                return false;
            });

            Container.find('#rcrm_menu_delete').click(function () {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(elem.length > 0 && !elem.hasClass('rcrmTableTextElement')) rcrmDeleteElement(elem);
                return false;
            });

            Container.find('#rcrm_menu_undo').click(function () {
                var lastHtml = rcrmUndoStack.pop();
                rcrmRedoStack.push(Container.find("#rcrm_document_panel").html());
                Container.find('#rcrm_document_panel').html(lastHtml);
                rcrmBeforeHtml = lastHtml;
                rcrmSetUndoRedoIcons();
                rcrmRefreshSettingElements();
                rcrmBindContinerEvents();
                return false;
            });

            Container.find('#rcrm_menu_redo').click(function () {
                var lastHtml = rcrmRedoStack.pop();
                rcrmUndoStack.push(Container.find("#rcrm_document_panel").html());
                if (rcrmUndoStack.length > rcrmStackLength) rcrmUndoStack.shift();
                Container.find('#rcrm_document_panel').html(lastHtml);
                rcrmBeforeHtml = lastHtml;
                rcrmSetUndoRedoIcons();
                rcrmRefreshSettingElements();
                rcrmBindContinerEvents();
                return false;
            });

            Container.find('#rcrm_menu_import').bind('click' , function () {
                rcrmRemoveSelected();
                var fupload = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_import_row').clone().show();
                Container.find('#rcrm_detail_panel').append(fupload);
                fupload.find('#rcrm_fileUpload').ajaxForm({
                    beforeSend: function () {},
                    complete: function (c) {
                        var result = eval("(" + c.responseText + ")");
                        if(result[0] == 'success'){
                            if(result[1][0][0] == 'success') {
                                var html = result[1][0][1];
                                var tempType = null;
                                try {tempType = $(html).attr('temptype')} catch (e) {}
                                rcrmLoadHtml(html, null, null, tempType);
                            }
                        }
                        else RaveshUI.errorToast(rcrmRes.didnt_done, $(result[1][0][1]).find('span').text()); //rcrmShowMessage(result[1][0][1]);
                    },
                    error: function (c) { }
                });
            });

            Container.find('#rcrm_menu_export').bind('click' , function () {
                RaveshUI.confirmModal(Container.find('.rcrmYes').text(), Container.find('.rcrmNo').text(), "", Container.find('.rcrmQuestionExportFile').text(), function (value) {
                    if (value == true) {
                        rcrmRemoveSelected();
                        var mimeType ='text/html';
                        var filename = 'ExportedHtml'
                        var htm = rcrmGetHtml();
                        var elHtml = $(htm);
                        var xhttp = new XMLHttpRequest();
                        xhttp.open('GET', '../Themes/resources/css/reportcrm.css');
                        xhttp.onreadystatechange = function() {
                            if (xhttp.readyState === 4) {
                                if (xhttp.status === 200) {
                                    var style = document.createElement('style');
                                    style.type = 'text/css';
                                    if (style.styleSheet) style.styleSheet.cssText = xhttp.responseText;
                                    else style.appendChild(document.createTextNode(xhttp.responseText));
                                    elHtml.prepend(style);
                                    var link = document.createElement('a');
                                    mimeType = mimeType || 'text/plain';
                                    link.setAttribute('download', filename);
                                    link.setAttribute('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(elHtml[0].outerHTML));
                                    link.click(); 
                                    if(rcrmIsFactor) rcrmNewLoadHtml(htm);
                                    else Container.find('#rcrm_menu_page_setting').trigger('click');
                                } else console.log("Error", xhttp.statusText);
                            }
                        }
                        xhttp.send();
                    }
                });
            });

            Container.find('#rcrm_menu_preview').bind('click' , function () {
                try { rcrmSelectedElement = Container.find('#rcrm_content').find('.rcrmSelected').attr('id'); } catch (e) {}
                var htm = rcrmGetHtml();
                if(rcrmIsFactor) rcrmNewLoadHtml(htm);
                else Container.find('#rcrm_menu_page_setting').trigger('click');
                htm = rcrmReplacePreview(htm);
                Container.find('#reportcrm').hide();
                Container.find('#rcrmCreateTemplate').hide();
                Container.find('#rcrmLblPreview').show();
                var head = Container.find('#rcrmPreviewContainer').contents().find('head');
                var body = Container.find('#rcrmPreviewContainer').contents().find('body');
                body.html(htm);
                if(rcrmIsFactor){
                    head.append('<link href="/Themes/resources/css/reportcrm.css" type="text/css" rel="stylesheet" /> <link href="/Themes/resources/css/icon.css" type="text/css" rel="stylesheet" />'); //href="' + resources.host_name + '/Themes
                    var script1 = document.createElement("script");
                    script1.src = '/Themes/resources/scripts/jquery-1.4.4.min.js'; //resources.host_name + 
                    head[0].appendChild(script1);
                    setTimeout(function () {
                        var script2 = document.createElement("script");
                        script2.src = resources.host_name + '/Themes/resources/scripts/TemplateDesignPreview.js';
                        head[0].appendChild(script2);
                    }, 100);
                }
                var iframe = document.getElementById('rcrmPreviewContainer');
                Container.find('#rcrmPreview').show();
                if(Container[0].style.height != "") Container.find('#rcrmPreviewContainer').height(Container.height());
                setTimeout(function () {
                    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if($(innerDoc).find('body').length > 0) {
                        if(Container[0].style.height == "") Container.find('#rcrmPreviewContainer').height($(innerDoc).find('html')[0].offsetHeight);
                        else Container.find('#rcrmPreviewContainer').height(Container.height());
                        Container.find('#rcrmPreview').width(Container.width());
                        $(innerDoc).find('body').addClass('rcrmPreviewContainer') ;
                    }
                }, 800);
            });

            Container.find('#rcrm_menu_stop_preview').bind('click' , function () {
                Container.find('#reportcrm').show();
                Container.find('#rcrmPreview').hide();
                Container.find('#rcrmPreviewContainer').contents().find('head').empty();
                Container.find('#rcrmPreviewContainer').contents().find('body').empty();
                Container.find('#rcrmCreateTemplate').show();
                Container.find('#rcrmLblPreview').hide();
                Container.find('#rcrm_menu_page_setting').trigger('click');
                try {if(rcrmSelectedElement != undefined) { rcrmAddSelected(Container.find('#' + rcrmSelectedElement)) }} catch (e) {}
                rcrmSetContainerHeight();
                $(window).trigger('scroll');
                $('.content-scroll').trigger('scroll');
            });

            Container.find("#rcrmfupFile").live('change', function () {
                Container.find('#rcrm_detail_panel .rcrm_element_import_row .file').val(this.files[0].name);
            });

            Container.find('#rcrmParametrs li').bind('click',function () {
                var value = $(this).find('.rcrmPopupItemHeader').attr('value');
                var type = $(this).parents('ul').attr('type');
                if(value != '' && value != undefined){
                    if((rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText') && rcrmEmailTextEditor != null) rcrmEmailTextEditor.insertHtml('#' + value + '#');
                    else if((rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS') && Container.find('#rcrmSmsEditor').length > 0) Container.find('#rcrmSmsEditor').val(Container.find('#rcrmSmsEditor').val() + ' #' + value + '#');
                    else {
                        var input = Container.find('#rcrm_detail_panel').find('.rcrm_element_content');
                        var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                        var elemObj = rcrmFindElementInstance(elem, false);
                        //------------------------------------------------------------------
                        if(type == 'factor_table') input.val('$' + value + '$');
                        else if(type == 'factor_image'){
                            input.val(value);
                            elem.css('z-index' , '11');
                            elem.find('img').attr('src', resources.host_name + '/Themes/resources/images/paid-' + rcrmRes.lang + '.png');
                            elem.find('img').attr('FileName', 'paid-' + rcrmRes.lang + '.png');
                            elemObj.src.update('paid-' + rcrmRes.lang + '.png');
                            Container.find('#rcrm_detail_panel').find('.rcrm_element_img_repeat').trigger('change');
                        }
                        else if(type == 'factor_barcode' || (type == 'EMail_text' && elem.hasClass('rcrmBarcodeElement'))){
                            input.val((input.val() + '#' + value + '#').trim());
                            elem.attr('barcode_data', input.val());
                            elem.find('img').attr('src' , resources.host_name + '/pages/getFile.aspx?mode=' + (elem.attr('barcode_type') == undefined ? 'qrcode' : elem.attr('barcode_type')) + '&width='+ elem.width() +'&height='+ elem.height() +'&data=' + input.val());
                            Container.find('#rcrm_detail_panel').find('.rcrm_element_img_repeat').trigger('change');
                        }
                        else if(type == 'EMail_table'){
                            var text = $(this).find('.rcrmPopupItemHeader').text();
                            if(value == 'empty') { text = ''; value = '' }
                            input.val(text);
                            elem.attr('section', value);
                            elem.attr('sectiontitle', text);
                        }
                        else if($(this).parents('.rcrmPopupWindow').first().hasClass('EMail_Link')) {
                            var addressElem = Container.find('#rcrm_detail_panel').find('.rcrm_element_link_address');
                            addressElem.val(elem.find('a').attr('href') + '#' + value + '#');
                            elem.find('a').attr('href', addressElem.val())
                        }
                        else if(type == 'EMail_text' && elem.attr('display_way') == 'colmun') {
                            if(input.val() == '') input.val(input.val() + '#' + value + '_br#');
                            else input.val(input.val() + '&nbsp;' + '#' + value + '_br#');
                        }
                        else { if(input.val() == '') input.val(input.val() + '#' + value + '#'); else input.val(input.val() + '&nbsp;' + '#' + value + '#'); }
                        //------------------------------------------------------------------
                        elemObj.content.inputText(elem ,input.val());
                        if(type != 'factor_image' && type != 'EMail_table') elemObj.updateSetting(elem); //input.val(elem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').text()); input.trigger('keydown');
                    }
                    Container.find('.rcrmPopupWindow').addClass('rcrmHidden');
                }
            });

            Container.find('.rcrmPopupSearch').keyup(function (e) {
                var value = $(this).val();
                var searchElem = $(this).parents('.rcrmPopupWindowContent').find('ul:not(.rcrmHidden)');
                if(searchElem.length > 0){
                    searchElem.find('.rcrmPopupItemHeader').each(function () {
                        var li = $(this).parents('li').first();
                        var ul = li.parents('ul').first();
                        if($(this).html().indexOf(value) >= 0 || value == '') {
                            if($(this).attr('group') != 'SMS' || ($(this).attr('group') == 'SMS' && rcrmOptions.templateType == 'sms_show')){
                                li.removeClass('rcrmHidden'); $(this).removeClass('rcrmHidden');
                                ul.find('.rcrmPopupItemSeparator[group='+ $(this).attr('group') +']').show();
                            }
                        } 
                        else {
                            li.addClass('rcrmHidden'); $(this).addClass('rcrmHidden');
                            if(ul.find('.rcrmPopupItemHeader[group='+ $(this).attr('group') +']:not(.rcrmHidden)').length == 0)
                                ul.find('.rcrmPopupItemSeparator[group='+ $(this).attr('group') +']').hide();
                        }
                    });
                }
            });

            Container.find('#reportcrm .rcrmTableTextElement').live('mouseenter', function () {
                if($(this).find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').is(':empty') && $(this).parents('.rcrmTableElement').attr('tabletype') == 'repeating' && !$(this).hasClass('rcrmSelected')){
                    if($(this).parents('thead').length != 0) $(this).find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').html(Container.find('#rcrmSettingCloneArea .rcrmHeaderHold').clone());
                    if($(this).parents('tbody').length != 0) $(this).find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').html(Container.find('#rcrmSettingCloneArea .rcrmBodyHold').clone());
                    if($(this).parents('tfoot').length != 0) $(this).find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').html(Container.find('#rcrmSettingCloneArea .rcrmFooterHold').clone());
                }
            });

            Container.find('#reportcrm .rcrmTableTextElement').live('mouseleave', function () {
                $(this).find('.rcrmHolder').remove();
            });

            Container.find('#rcrm_menu_element_structure').bind('mousedown' , function () {
                if (Container.find('.rcrmStructureMenu').is(":visible")) Container.find('.rcrmStructureMenu').hide();
                else {
                    var left = Container.find('#reportcrm').position().left;
                    if (rcrmRes.lang == 'en') left = Container.find('#reportcrm').position().left + Container.find('#reportcrm').width() - Container.find('.rcrmStructureMenu').width() - 15;
                    var top = $(this).offset().top;
                    if(rcrmOptions.openDialog == true) top = $(this).position().top;
                    Container.find('.rcrmStructureMenu').show().css('top', top + 48).css('left', left);
                }
            });

            if (rcrmOptions.openDialog == false) {
                Container.find('#rcrmSettingCloneArea .rcrm_document_cust_group_row #rcrmTxtGroupCustomer').MultiGroupSelector({
                    mode: 'customer',
                    callback : function (id , name) { rcrmCustomerGroupCallback(id, name) },
                    content: 'Sample_content_Customer',
                    multiSelect: false,
                    minimumNumberOfSelected: 0,
                    allowNull : true,
                    appendTagBeforeCallback: true,
                    callback_str: 'func1',
                });

                Container.find('#rcrmSettingCloneArea .rcrm_document_user_group_row #rcrmTxtGroupUser').MultiGroupSelector({
                    mode: 'user',
                    callback : function (id , name) { rcrmUserGroupCallback(id, name) },
                    content: 'Sample_content_User',
                    multiSelect: false,
                    minimumNumberOfSelected: 0,
                    allowNull : true,
                    appendTagBeforeCallback: true,
                    callback_str: 'func2',
                });
            }

            $(document).mousedown(function (event) {
                try { Container.find('.rcrmClicked').removeClass('rcrmClicked') } catch (e) { }
                try {
                    if($(event.target).attr('id') == 'rcrm_content' && !$(event.target).hasClass('rcrmSizer') && !Container.find('#rcrm_document_main').hasClass('rcrmDocumentSetting')){
                        rcrmRemoveSelected();
                        if($(event.target).hasClass('rcrmDocumentBand')) Container.find('#rcrm_menu_page_setting').trigger('click');
                    };
                    if($(event.target).parents('.rcrmPopupWindow').length == 0){
                        Container.find('.rcrmPopupWindow').addClass('rcrmHidden');
                    }
                } catch (e) { }
                if (!$(event.target).hasClass('rcrm_menu_structure') && !$(event.target).hasClass('icon-panel') && !$(event.target).hasClass('rcrmStructureMenu') && $(event.target).parents('.rcrmStructureMenu').length == 0) {
                    Container.find('.rcrmStructureMenu').hide();
                }
            });

            $(document).keydown(function (e) {
                if($(e.target).parents('#reportcrm').length != 0 || e.target == document.body){

                    try { if(e.keyCode == 90 && e.ctrlKey && !Container.find('#rcrm_menu_undo').hasClass('ui-button-disabled') && $(e.target).parents('.ravesh-editor').length == 0 && $(e.target).attr('id') != 'rcrmSmsEditor') Container.find('#rcrm_menu_undo').trigger('click'); } catch (e) {}
                    
                    if(e.keyCode == 13){
                        if($(e.target).parents('#rcrm_detail_panel').length != 0 && !($(e.target).hasClass('rcrm_element_content')) && !($(e.target).hasClass('rcrm_element_select_image_input')) && !($(e.target).hasClass('rcrmActionButton')) && !$(e.target).hasClass('ravesh-editor-content')) return false; //&& $(e.target).parents('.rcrm_element_column').length == 0
                    }

                    if(e.target == document.body || $(e.target).parents('#rcrm_detail_panel').length == 0 || $(e.target).hasClass('rcrm_element_content')){
                        var elem = Container.find('#rcrm_content').find('.rcrmSelected:not(.rcrmTableTextElement)');
                        var distance = 1
                        elemObj = rcrmFindElementInstance(elem, false);

                        if (Container.find('#rcrm_menu_toggle_grid').hasClass('rcrmButtonActive') || e.shiftKey) {
                            if(Container.find('#rcrm_menu_toggle_grid').hasClass('rcrmButtonActive')){
                                distance = rcrmPointSpace;
                                if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
                                    elem.css('left', Math.round(elem.position().left / rcrmPointSpace) * rcrmPointSpace);
                                    elem.css('top', Math.round(elem.position().top / rcrmPointSpace) * rcrmPointSpace);
                                }
                            }
                            else if(e.shiftKey) distance = 10;
                        };

                        if (e.keyCode == 46 && $(e.target).parents('.ravesh-editor').length == 0 && $(e.target).attr('id') != 'rcrmSmsEditor' && !$(e.target).hasClass('rcrm_element_content')) {
                            rcrmDeleteElement(elem);
                            e.preventDefault();
                        };

                        if (elem.length > 0 && !$(e.target).hasClass('rcrmClicked')) {
                            if (e.keyCode == 37) {
                                if (elem.position().left - distance < 0) return false;
                                var left = elem.position().left - distance
                                elem.css('left', left);
                                elemObj.position.update(left, null);
                                rcrmChangeHtml();
                                e.preventDefault()
                            };
                            
                            if (e.keyCode == 38 && !$(e.target).hasClass('rcrmClicked')) {
                                if (elem.position().top - distance < 0) return false;
                                var top = elem.position().top - distance
                                elem.css('top', top);
                                elemObj.position.update(null, top);
                                rcrmSortParentChilds(elem.parent(), elem);
                                rcrmChangeHtml();
                                e.preventDefault()
                            };

                            if (e.keyCode == 39 && !$(e.target).hasClass('rcrmClicked')) {
                                var right = Container.find('#rcrm_content').width() - elem.width() - elem.position().left - distance;
                                if (right < 0) return false;
                                var left = elem.position().left + distance;
                                elem.css('left', left);
                                elemObj.position.update(left, null);
                                rcrmChangeHtml();
                                e.preventDefault()
                            };

                            if (e.keyCode == 40 && !$(e.target).hasClass('rcrmClicked')) {
                                var bottom = Container.find('#rcrm_content').height() - elem.height() - elem.position().top - distance;
                                if (bottom < 0) return false;
                                var top = elem.position().top + distance
                                elem.css('top', top);
                                elemObj.position.update(null, top);
                                rcrmSortParentChilds(elem.parent(), elem);
                                rcrmChangeHtml();
                                e.preventDefault()
                            };
                        }
                    }
                }
            });

            $(window).scroll(function(e){ 
                Container.find('.rcrmPopupWindow').addClass('rcrmHidden');
                if (rcrmOptions.openDialog == false) {
                    var minScroll = Container.find('#reportcrm').offset().top - $('#header').height() // + Container.find('#rcrm_menu_panel').height()
                    var $topPanel = Container.find('.rcrmMenuPanel');
                    var $rightPanel = Container.find('.rcrmDetailPanel'); 
                    var parent = $(Container).find('#reportcrm');
                    var isPositionFixed = ($topPanel.css('position') == 'fixed');
                    if ($(this).scrollTop() < minScroll && isPositionFixed){
                        $topPanel.css({'position':'absolute' , 'width':'100%' , 'top':'0px' , 'left': '0px' , 'z-index':'' });
                        $rightPanel.css({'position':'absolute' , 'margin-top':'18px' , 'top':'0px'});
                        if(rcrmRes.lang == 'en') $rightPanel.css('left' , '0')
                        else $rightPanel.css('right' , '5px')
                    } 
                    if ($(this).scrollTop() > minScroll){ 
                        if(!isPositionFixed){
                            var left = Container.find('#reportcrm').position().left;
                            $topPanel.css({'position':'fixed' , 'width':'inherit' , 'top': $('#header').height() , 'left':left , 'z-index':'100' });
                            $rightPanel.css({'position':'fixed', 'margin-top':'15px' , 'top': $('#header').height() + Container.find('.rcrmMenuPanel').height() });
                            var right = $(window).width() - (parent.outerWidth() + parent.position().left);
                            if(rcrmRes.lang == 'en') $rightPanel.css('left' , left)
                            else $rightPanel.css('right' , right + 5)
                        }
                    }
                    rcrmSetDetailPanelSize();
                }
            });

            $('.content-scroll').scroll(function(e){ 
                if (rcrmOptions.openDialog == true) {
                    Container.find('.rcrmPopupWindow').addClass('rcrmHidden');
                    var $topPanel = Container.find('.rcrmMenuPanel');
                    var $rightPanel = Container.find('.rcrmDetailPanel'); 
                    var parent = $(Container).find('#reportcrm');
                    var left = Container.find('#reportcrm').offset().left;
                    var telorance = 0
                    if($('.ravesh-dialog > .head > .icon-collapse').css('display') == 'none') telorance = ($(window).height() - $('.ravesh-dialog').height()) / 2;
                    $topPanel.css({'position':'fixed' , 'width':Container.find('#reportcrm').width() , 'top': $('.ravesh-dialog > .head').position().top + $('.ravesh-dialog > .head').height() + telorance ,'left':left , 'z-index':'100' });
                    $rightPanel.css({'position':'fixed', 'margin-top':'30px' , 'top': $('.ravesh-dialog > .head').position().top + $('.ravesh-dialog > .head').height() + Container.find('.rcrmMenuPanel').height() + telorance });
                    var right = $(window).width() - (parent.outerWidth() + parent.offset().left);
                    if(rcrmRes.lang == 'en') $rightPanel.css('left' , left)
                    else $rightPanel.css('right' , right + 5)
                    rcrmSetDetailPanelSize();
                }
            });

            Container.find('#rcrm_detail_panel').scroll(function(e){
                Container.find('.rcrmPopupWindow').addClass('rcrmHidden');
            });
            
            Container.find('#reportcrm').width(Container.width());
            Container.find('#rcrmPreview').width(Container.width());
            $(window).resize(function(e){
                Container.find('#reportcrm').width(Container.width());
                Container.find('#rcrmPreview').width(Container.width());
                rcrmSetContainerHeight();
                if (rcrmOptions.openDialog == true) setTimeout(function () { $('.content-scroll').trigger('scroll') }, 800);
            });

            rcrmTemplateChangeHandel()
            rcrmrenderSaveIcon();
            rcrmSetContainerHeight();
            rcrmFillFontSelect();
        }

        function rcrmLoadUserControl() {
            var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), r: $('#HFRnd').val(), p: '', m: '', n: 'TemplateDesign' };
            if (rcrmOptions.openDialog == true) {
                var dialog = RaveshUI.showDialog({
                    title: rcrmOptions.dialogTitle,
                    allowMaximum: true,
                    width: '85%',
                    closeMethods: [''],
                    onMaximum: function () {
                        setTimeout(function () {
                            Container.find('#reportcrm').width(Container.width());
                            Container.find('#rcrmPreview').width(Container.width());
                            rcrmSetContainerHeight();
                            $('.content-scroll').trigger('scroll');
                        }, 450)
                    },
                    onClose:function () { $('.sp-container').remove() },
                    icon:'icon-paint-brush'
                });
                dialog.setContent($('<div>').css({ overflow: 'hidden', padding: '15px', minHeight: 400 }));
                dialog.showLoading();
                Container = $('<div class="rcrmDialog">').css({ overflow: 'hidden', padding: '15px' });
            }
            Container.empty();
            Container.append('<div id="UCdialog_TemplateDesign"><div style="text-align:center;height: 30px;"></div></div>'); //<div class="wait" style="display: inline-block;margin: 10px;"></div>
            $.ajax({
                type: "POST",
                url: "../pages/Load_UserControl.aspx/Load_Control",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(e), 
                success: function (c) {
                    Container.find('#UCdialog_TemplateDesign').html(c.d[1]);
                    if (rcrmOptions.openDialog == true) {
                        dialog.setContent(Container);
                        rcrmTemplateChangeHandel();
                        Container.find('#reportcrm').css('position' , 'relative');
                        Container.find('#rcrmPreview').css('position' , 'relative');
                        Container.find('#rcrm_menu_save').html(Container.find('.rcrmApprove').text());
                        rcrmOptions.templateName = rcrmOptions.dialogTitle;
                        rcrmAddDialogParametrs();
                        dialog.hideLoading();
                        setTimeout(function () {
                            rcrmSetContainerHeight();
                            rcrmDocumentReady();
                            rcrmAllSetting = eval('(' + Container.find('#rcrmHFAllSetting').val() + ')');
                            if(rcrmOptions.dialogHtml != '' && rcrmOptions.dialogHtml != undefined) rcrmLoadHtml(rcrmOptions.dialogHtml, null, null, rcrmOptions.templateType); 
                        }, 500)
                    }
                    else {
                        rcrmDocumentReady();
                        rcrmAllSetting = eval('(' + Container.find('#rcrmHFAllSetting').val() + ')');
                        setTimeout(function () { rcrmSetContainerHeight() }, 100)
                    }
                }
            });
        }

        function rcrmDropfunction(event, ui, droparea) {

            var Elem = null;
            var elemObj = null;
            try {
                var id = 'rcrm_el' + (rcrmIdpointer + 1);
                var type = ui.draggable.attr('id').replace('rcrm_menu_element_', '');
                elemObj = new rcrmMenuItems[type].Elem(id, type);
                Elem = elemObj.clone();
                rcrmInstanceList.push(elemObj);
                Elem.attr('id', id);
                rcrmIdpointer++;
            } catch (e) { }
            
            //if ($(droparea).hasClass('rcrmDocElementContentFrame') && ($(Elem).hasClass('rcrmFrameElement'))) return false;
            var draggableOffset = ui.helper.offset();
            var droppableOffset = $(droparea).offset();
            var left = Math.round(draggableOffset.left - droppableOffset.left);
            var thisTop = Math.round(draggableOffset.top - droppableOffset.top);

            if (Container.find('#rcrm_menu_toggle_grid').hasClass('rcrmButtonActive')) {
                left = Math.round(left / rcrmPointSpace) * rcrmPointSpace;
                thisTop = Math.round(thisTop / rcrmPointSpace) * rcrmPointSpace;
            }

            if (Elem != null) {
                var rcrContainment = '', rcrDragContainment = '', rcrmHelper = 'original', rcrDragAxis = '', rcrmBorderDif = 2;
                if(rcrmIsEmail) { rcrmHelper = 'clone'; rcrDragAxis = 'y'; try { if(Elem.hasClass('rcrmTableElement')) rcrmBorderDif = 0 } catch (e) {} } //-1
                else { rcrContainment = 'parent'; rcrDragContainment = '#rcrm_content' }; 

                rcrmRemoveSelected();
                Elem.resizable({
                    handles: {
                        'nw': '> .rcrmSizerNW',
                        'ne': '> .rcrmSizerNE',
                        'sw': '> .rcrmSizerSW',
                        'se': '> .rcrmSizerSE',
                        'n': '> .rcrmSizerN',
                        'e': '> .rcrmSizerE',
                        's': '> .rcrmSizerS',
                        'w': '> .rcrmSizerW'
                    },
                    containment: rcrContainment,
                    start: function (e) {
                        try {
                            var dir = e.toElement ? e.toElement : e.originalEvent.target;
                            if(!$(dir).hasClass('rcrmSizerS') && !$(dir).hasClass('rcrmSizerN')){
                                Elem.attr('widthType' , '');
                                Elem.find('.rcrmDocElementContentText').css('word-break' , '') //.css('white-space' , 'pre-line');
                                if(!Elem.hasClass('rcrmHtmlElement')){
                                    if(rcrmIsEmail) Elem.find('.rcrmDocElementContentText').css('white-space' , 'normal');
                                    else Elem.find('.rcrmDocElementContentText').css('white-space' , 'pre-line');
                                }
                            }
                            if(!$(dir).hasClass('rcrmSizerE') && !$(dir).hasClass('rcrmSizerW')) Elem.attr('heightType' , '').css('min-height' , '');
                        } catch (e) {}

                        try { 
                            if(Elem.hasClass('rcrmTableElement')){ 
                                Elem.find('> table > * > tr > .rcrmTableTextElement > .rcrmContentContainerHelper > .rcrmDocElementContentText').width(''); //.height('');
                                Elem.find('> table > * > tr > .rcrmTableTextElement').each(function () {
                                    var width = ($(this)[0].clientWidth / Elem[0].clientWidth) * 100;
                                    $(this).width(width + '%');
                                });
                            }
                        } catch (e) {}
                        Elem.css('max-width' ,'');
                    },
                    resize:function (e, rui) {
                        try {
                            if(rcrmIsEmail){
                                rcrmSetContainerHeight();
                                if(rui.position.left < 0) { Elem.css('left' , '0px'); Elem.css('max-width' , Elem.parent().width() - (Number(Elem.css('margin-left').replace('px' ,'')) + Number(Elem.css('margin-right').replace('px' ,'')) + rcrmBorderDif)) };
                                var elemRight = rui.position.left + rui.size.width;
                                if(elemRight >= Elem.parent().width()) { Elem.css('right' , '0px').css('left' , ''); Elem.css('max-width' , Elem.parent().width() - (Number(Elem.css('margin-left').replace('px' ,'')) + Number(Elem.css('margin-right').replace('px' ,'')) + rcrmBorderDif)) }
                            }
                        } catch (e) { }
                       
                        try { if(Elem.hasClass('rcrmTextElement') || Elem.hasClass('rcrmHtmlElement') || Elem.hasClass('rcrmTableTextElement') || Elem.hasClass('rcrmFrameElement')) elemObj.updateInternalSize(Elem) } catch (e) {}
                        try { if(Elem.hasClass('rcrmTableElement')){ Elem.find('> table').width(Elem[0].clientWidth) } } catch (e) {}  //rui.size.width
                        try { if(Elem.hasClass('rcrmImageElement')) elemObj.updateDisplayInternal(Elem, Elem.find('img')) } catch (e) {}
                        try { Elem.find('.rcrmHolder').hide() } catch (e) {}
                        rcrmRemovePosition(Elem);
                    },
                    stop: function (e, sui) {
                        if(Elem.hasClass('rcrmTableElement')) {
                            var tbl = Elem.find('> table');
                            if(tbl.find('> * > tr > .rcrmTableTextElement').filter(function() { return $(this).attr("colspan") > 1 }).length > 0 || rcrmIsFactor) {
                                var tblWidth = 0;
                                tbl.find('> thead > tr > td').each(function () {
                                    $(this).width($(this)[0].clientWidth);
                                    tblWidth += $(this)[0].clientWidth 
                                }); 
                                tbl.width(tblWidth);
                            }
                            elemObj.updateInternalSize(Elem);
                        }
                        if(Elem.hasClass('rcrmBarcodeElement')) Elem.find('img').attr('src' , resources.host_name + '/pages/getFile.aspx?mode=' + (Elem.attr('barcode_type') == undefined ? 'qrcode' : Elem.attr('barcode_type')) + '&width='+ Elem.width() +'&height='+ Elem.height() +'&data=' + (Elem.attr('barcode_data') == undefined ? '' : Elem.attr('barcode_data')));
                        try { if(rcrmIsEmail) { Elem.css('left' , Elem.position().left).css('right' , '') }} catch (e) {}
                        rcrmSetFullHeight(Elem);
                        elemObj.updateSetting(Elem);
                        rcrmChangeHtml();
                    },
                    grid: (Container.find('#rcrm_menu_toggle_grid').hasClass('rcrmButtonActive')) ? [rcrmPointSpace, rcrmPointSpace] : null
                }).mousedown(function (e) {
                    var target = $(e.target);
                    if(!target.hasClass('rcrmSizer')){
                        if (!target.hasClass('rcrmDocElement')) target = $(e.target).parents('.rcrmDocElement').first();
                        rcrmAddSelected(target);
                    }
                }).css({"position": "absolute", "left": left + 20 , "top": thisTop + 20 });

                if(!Elem.hasClass('rcrmStructElement') || Elem.hasClass('rcrmstructure1Element')){
                    Elem.draggable({
                        containment: rcrDragContainment,
                        axis : rcrDragAxis,
                        helper : rcrmHelper,
                        start: function (e, sui) {
                            if (!$(this).hasClass('rcrmSelected')) return false;
                            Container.find('.rcrmEmail_m').css('min-height' , Container.find('.rcrmEmail_m').height());
                            Container.find('.rcrmEmail_p,.rcrmEmail_c').css('min-height' , Container.find('.rcrmEmail_m #rcrm_content').height());
                            $(this).css({"position": "absolute" });
                            if(rcrmIsEmail) { 
                                $(this).css('position', 'unset').css('visibility' , 'hidden');
                                $(this).find('.rcrmDocElement').css('visibility' , 'hidden');
                                $(sui.helper).css('left', Elem.position().left);
                            }
                        },
                        drag: function (e, eui) {
                            eui.position.left = Math.round(eui.position.left);
                            eui.position.top = Math.round(eui.position.top);
                            if (Container.find('#rcrm_menu_toggle_grid').hasClass('rcrmButtonActive')) {
                                eui.position.left = Math.round(eui.position.left / rcrmPointSpace) * rcrmPointSpace;
                                eui.position.top = Math.round(eui.position.top / rcrmPointSpace) * rcrmPointSpace;
                            }
                            if(rcrmIsEmail){
                                $(eui.helper).css('left', (e.clientX - (Elem.parent().offset().left) - (Elem.width() / 2)) + 'px'); //Elem.position().left
                                if (eui.position.top + 10 > Container.find('#rcrm_content').height() - Elem.height()) {
                                    Container.find('#rcrm_content').height(Container.find('#rcrm_content').height() + 5).removeClass('rcrmEmail_c');
                                    Container.find('#rcrm_document_content').height(Container.find('#rcrm_document_content').height() + 5).removeClass('rcrmEmail_p');
                                    Container.find('#rcrm_document_main').height(Container.find('#rcrm_document_main').height() + 5).removeClass('rcrmEmail_m');
                                    Container.find('#rcrm_document_panel').scrollTop(Container.find('#rcrm_content').height() - Container.find('#rcrm_document_panel').height())
                                    return true;
                                }
                            }
                        },
                        stop: function (e, oui) {
                            if(rcrmIsEmail){
                                $(this).css('visibility' , 'visible');
                                $(this).find('.rcrmDocElement').css('visibility' , 'visible');
                                Container.find('#rcrm_document_main').addClass('rcrmEmail_m').height('auto');
                                Container.find('#rcrm_document_content').addClass('rcrmEmail_p').height('auto');
                                Container.find('#rcrm_content').addClass('rcrmEmail_c').height('auto');
                                if($(oui.helper).parents('.rcrmTableTextElement[heighttype=auto]').length > 0) {
                                    var tblDiv = $(oui.helper).parents('.rcrmTableElement').first();
                                    var tblObj = rcrmFindElementInstance(tblDiv, false);
                                    tblObj.updateInternalSize(tblDiv);
                                }
                            }
                            Container.find('.rcrmEmail_m').css('min-height' , '470px');
                            Container.find('.rcrmEmail_p,.rcrmEmail_c').css('min-height' , '464px');
                            rcrmSetAllElementBorder();
                            rcrmSetFullHeight(Elem);
                            //rcrmChangeHtml();
                        },
                        grid: (Container.find('#rcrm_menu_toggle_grid').hasClass('rcrmButtonActive')) ? [rcrmPointSpace, rcrmPointSpace] : null
                    });
                }

                try {
                    Elem.find('.rcrmDocElementContentFrame').droppable({
                        accept: function (d) { if((d.hasClass("rcrmMenuButton") || d.hasClass("rcrmDocElement")) && d.attr("pos") != 'footer') return true; },
                        greedy: true,
                        hoverClass: "rcrmElementDragOver",
                        drop: function (e, u) { rcrmDropfunction(e, u, this); }
                    });
                } catch (e) { }

                if(Elem.hasClass('rcrmTableElement')) rcrmEmailTableDroppable(Elem.find('> table > * > tr > .rcrmTableTextElement'));
                $(droparea).append(Elem);
                rcrmSetElementsPosition(Elem);
                rcrmSortParentChilds(droparea, Elem);
                rcrmRemovePosition(Elem);
                if(rcrmIsEmail) {
                    rcrmSetContainerHeight();
                    rcrmEmailElementsFitWidth(droparea ,Elem, elemObj);
                    if(Container.find('#rcrm_document_main').hasClass('rcrmAutoPage')) Elem.removeClass('rcrmAutoSize').addClass('rcrmAutoSize');
                    if(Elem.hasClass('rcrmStructElement')) setTimeout(function () { rcrmGenerateStructure(droparea ,Elem, elemObj) }, 30, droparea ,Elem, elemObj);
                    else rcrmGenerateStructure(droparea ,Elem, elemObj);
                }
                rcrmAddSelected(Elem);
                rcrmChangeHtml();
            }
            else {
                $(ui.draggable).css({ "position": "absolute", "left": left, "top": thisTop });
                var helper = undefined;
                if(rcrmIsEmail) { helper = ui.helper ; $(ui.draggable).css({ "position": 'unset', "left": 'unset', "top": 'unset' });}
                elemObj = rcrmFindElementInstance($(ui.draggable), false);
                try { elemObj.position.update(left, thisTop) } catch (e) {}
                try { if($(droparea).parents('.rcrmTableTextElement').length > 0 && $(ui.draggable).parents('.rcrmTableTextElement').length == 0) rcrmEmailElementsFitWidth(droparea ,ui.draggable, elemObj) } catch (e) {}
                rcrmSortParentChilds(droparea, ui.draggable, helper);
                rcrmRemovePosition(ui.draggable);
                setTimeout(function () { rcrmChangeHtml() }, 30); 
            }
        }

        function rcrmBindContinerEvents() {

            Container.find('.rcrmMenuButton:not(#rcrm_menu_element_structure),.rcrmStructOption').draggable({
                cursor: "move",
                revert: "invalid",
                helper: 'clone',
                revertDuration: 0,
                drag:function (e, ui) {
                    if($(this).hasClass('rcrmStructOption')){
                        Container.find('.rcrmStructureMenu').addClass('rcrmVisualHide');
                        Container.find('.rcrmStructureMenu .rcrmStructOption').addClass('rcrmVisualHide');
                        Container.find('.rcrmStructureMenu .rcrmStructOption div').addClass('rcrmVisualHide');
                        $(ui.helper).removeClass('rcrmVisualHide');
                        $(ui.helper).find('div').removeClass('rcrmVisualHide');
                    }
                    var lastElem = Container.find('#rcrm_document_panel .rcrmEmail_c > .rcrmDocElement:last-child');
                    if(rcrmIsEmail && lastElem.length > 0) {
                        if(lastElem.offset().top + lastElem.height() + 105 > Container.find('#rcrm_document_panel').height() + Container.find('#rcrm_document_panel').offset().top){
                            if($(this).attr('id') == 'rcrm_menu_element_html') lastElem.removeClass('rcrmBottom200').addClass('rcrmBottom200');
                            else lastElem.removeClass('rcrmBottom').addClass('rcrmBottom');
                            Container.find('#rcrm_document_panel').scrollTop(Container.find('#rcrm_content').height() - Container.find('#rcrm_document_panel').height())
                            return true;
                        }
                    }
                } ,
                stop: function (e) {
                    if(rcrmIsEmail) {
                        Container.find('.rcrmBottom').removeClass('rcrmBottom');
                        Container.find('.rcrmBottom200').removeClass('rcrmBottom200');
                        rcrmSetContainerHeight();
                    }
                    rcrmSetAllElementBorder() ;
                    if($(this).hasClass('rcrmStructOption')){
                        Container.find('.rcrmVisualHide').removeClass('rcrmVisualHide');
                        Container.find('.rcrmStructureMenu').hide();
                    }
                }
            });

            Container.find('#rcrm_content').droppable({
                accept: function (d) { if (d.hasClass("rcrmMenuButton") || d.hasClass("rcrmDocElement") || d.hasClass("rcrmStructOption")) return true; },
                hoverClass: "rcrmElementDragOver",
                activeClass: "rcrmElementDragOver",
                drop: function (event, ui) { rcrmDropfunction(event, ui, this) }
            });

            Container.find('#rcrm_content .rcrmDocElement').each(function () {
                rcrmBindElementEvents(this);
            });

            Container.find('#rcrm_content .rcrmTableTextElement').each(function () {
                rcrmBindTableCellEvents(this);
            });

        }

        function rcrmBindElementEvents(elem) {

            if($(elem).find('.rcrmSizer').length == 0){
                if($(elem).hasClass('rcrmTextElement')) $(elem).append('<div class="rcrmSizer rcrmSizerN ui-resizable-handle ui-resizable-n"></div> <div class="rcrmSizer rcrmSizerNE ui-resizable-handle ui-resizable-ne"></div> <div class="rcrmSizer rcrmSizerE ui-resizable-handle ui-resizable-e"></div> <div class="rcrmSizer rcrmSizerSE ui-resizable-handle ui-resizable-se"></div> <div class="rcrmSizer rcrmSizerS ui-resizable-handle ui-resizable-s"></div> <div class="rcrmSizer rcrmSizerSW ui-resizable-handle ui-resizable-sw"></div> <div class="rcrmSizer rcrmSizerW ui-resizable-handle ui-resizable-w"></div> <div class="rcrmSizer rcrmSizerNW ui-resizable-handle ui-resizable-nw"></div>');
                if($(elem).hasClass('rcrmLineElement')) $(elem).append('<div class="rcrmSizer rcrmSizerE ui-resizable-handle ui-resizable-e"></div><div class="rcrmSizer rcrmSizerW ui-resizable-handle ui-resizable-w"></div>');
                if($(elem).hasClass('rcrmImageElement')) $(elem).append('<div class="rcrmSizer rcrmSizerN ui-resizable-handle ui-resizable-n"></div> <div class="rcrmSizer rcrmSizerNE ui-resizable-handle ui-resizable-ne"></div> <div class="rcrmSizer rcrmSizerE ui-resizable-handle ui-resizable-e"></div> <div class="rcrmSizer rcrmSizerSE ui-resizable-handle ui-resizable-se"></div> <div class="rcrmSizer rcrmSizerS ui-resizable-handle ui-resizable-s"></div> <div class="rcrmSizer rcrmSizerSW ui-resizable-handle ui-resizable-sw"></div> <div class="rcrmSizer rcrmSizerW ui-resizable-handle ui-resizable-w"></div> <div class="rcrmSizer rcrmSizerNW ui-resizable-handle ui-resizable-nw"></div>');
                if($(elem).hasClass('rcrmTableElement')) $(elem).append('<div class="rcrmSizer rcrmSizerW ui-resizable-handle ui-resizable-w"></div> <div class="rcrmSizer rcrmSizerE ui-resizable-handle ui-resizable-e"></div>');
                if($(elem).hasClass('rcrmFrameElement')) $(elem).append('<div class="rcrmSizer rcrmSizerN ui-resizable-handle ui-resizable-n"></div> <div class="rcrmSizer rcrmSizerNE ui-resizable-handle ui-resizable-ne"></div> <div class="rcrmSizer rcrmSizerE ui-resizable-handle ui-resizable-e"></div> <div class="rcrmSizer rcrmSizerSE ui-resizable-handle ui-resizable-se"></div> <div class="rcrmSizer rcrmSizerS ui-resizable-handle ui-resizable-s"></div> <div class="rcrmSizer rcrmSizerSW ui-resizable-handle ui-resizable-sw"></div> <div class="rcrmSizer rcrmSizerW ui-resizable-handle ui-resizable-w"></div> <div class="rcrmSizer rcrmSizerNW ui-resizable-handle ui-resizable-nw"></div>');
                if($(elem).hasClass('rcrmHtmlElement')) $(elem).append('<div class="rcrmSizer rcrmSizerN ui-resizable-handle ui-resizable-n"></div> <div class="rcrmSizer rcrmSizerNE ui-resizable-handle ui-resizable-ne"></div> <div class="rcrmSizer rcrmSizerE ui-resizable-handle ui-resizable-e"></div> <div class="rcrmSizer rcrmSizerSE ui-resizable-handle ui-resizable-se"></div> <div class="rcrmSizer rcrmSizerS ui-resizable-handle ui-resizable-s"></div> <div class="rcrmSizer rcrmSizerSW ui-resizable-handle ui-resizable-sw"></div> <div class="rcrmSizer rcrmSizerW ui-resizable-handle ui-resizable-w"></div> <div class="rcrmSizer rcrmSizerNW ui-resizable-handle ui-resizable-nw"></div>');
            }

            var elemObj = rcrmFindElementInstance(elem, true);
            var rcrContainment = '', rcrDragContainment = '', rcrmHelper = 'original', rcrDragAxis = '', rcrmBorderDif = 2;

            if(rcrmIsEmail)  { rcrmHelper = 'clone'; rcrDragAxis = 'y'; try { if($(elem).hasClass('rcrmTableElement')) rcrmBorderDif = 0 } catch (e) {} } //-1
            else { rcrContainment = 'parent'; rcrDragContainment = '#rcrm_content' }; 

            $(elem).resizable({
                handles: {
                    'nw': '> .rcrmSizerNW',
                    'ne': '> .rcrmSizerNE',
                    'sw': '> .rcrmSizerSW',
                    'se': '> .rcrmSizerSE',
                    'n': '> .rcrmSizerN',
                    'e': '> .rcrmSizerE',
                    's': '> .rcrmSizerS',
                    'w': '> .rcrmSizerW'
                },
                containment: rcrContainment,
                start: function (e) {
                    try {
                        var dir = e.toElement ? e.toElement : e.originalEvent.target;
                        if(!$(dir).hasClass('rcrmSizerS') && !$(dir).hasClass('rcrmSizerN')){
                            $(elem).attr('widthType' , '');
                            $(elem).find('.rcrmDocElementContentText').css('word-break' , '') //.css('white-space' , 'pre-line');
                            if(!$(elem).hasClass('rcrmHtmlElement')){
                                if(rcrmIsEmail) $(elem).find('.rcrmDocElementContentText').css('white-space' , 'normal');
                                else $(elem).find('.rcrmDocElementContentText').css('white-space' , 'pre-line');
                            }
                        } if(!$(dir).hasClass('rcrmSizerE') && !$(dir).hasClass('rcrmSizerW')) $(elem).attr('heighttype' , '').css('min-height' , '');
                    } catch (e) {}

                    try { 
                        if($(elem).hasClass('rcrmTableElement')){ 
                            $(elem).find('> table > * > tr > .rcrmTableTextElement > .rcrmContentContainerHelper > .rcrmDocElementContentText').width(''); //.height('');
                            $(elem).find('> table > * > tr > .rcrmTableTextElement').each(function () {
                                var width = ($(this)[0].clientWidth / $(elem)[0].clientWidth) * 100;
                                $(this).width(width + '%');
                            });
                        }
                    } catch (e) {}
                    $(elem).css('max-width' ,'');
                },
                resize:function (e, rui) {
                    try {
                        if(rcrmIsEmail){
                            rcrmSetContainerHeight();
                            if(rui.position.left < 0) { $(elem).css('left' , '0px'); $(elem).css('max-width' , $(elem).parent().width() - (Number($(elem).css('margin-left').replace('px' ,'')) + Number($(elem).css('margin-right').replace('px' ,'')) + rcrmBorderDif)) };
                            var elemRight = rui.position.left + rui.size.width;
                            if(elemRight >= $(elem).parent().width()) { $(elem).css('right' , '0px').css('left' , ''); $(elem).css('max-width' , $(elem).parent().width() - (Number($(elem).css('margin-left').replace('px' ,'')) + Number($(elem).css('margin-right').replace('px' ,'')) + rcrmBorderDif)) }
                        }
                    } catch (e) { }
                    try { if($(elem).hasClass('rcrmTextElement') || $(elem).hasClass('rcrmHtmlElement') || $(elem).hasClass('rcrmTableTextElement') || $(elem).hasClass('rcrmFrameElement')) elemObj.updateInternalSize($(elem)) } catch (e) {}
                    try { if($(elem).hasClass('rcrmTableElement')) $(elem).find('> table').width($(elem)[0].clientWidth)} catch (e) {} //.height($(elem)[0].clientHeight)
                    try { if($(elem).hasClass('rcrmImageElement')) elemObj.updateDisplayInternal($(elem), $(elem).find('img')) } catch (e) {}
                    try { $(elem).find('.rcrmHolder').hide() } catch (e) {}
                    try { $(elem).css('left' , $(elem).position().left).css('right' , '') } catch (e) {}
                    rcrmRemovePosition($(elem));
                },
                stop: function () {
                    if($(elem).hasClass('rcrmTableElement')){
                        var tbl = $(elem).find('> table');
                        if(tbl.find('> * > tr > .rcrmTableTextElement').filter(function() { return $(this).attr("colspan") > 1 }).length > 0 || rcrmIsFactor) {
                            var tblWidth = 0;
                            tbl.find('> thead > tr > td').each(function () {
                                $(this).width($(this)[0].clientWidth);
                                tblWidth += $(this)[0].clientWidth 
                            }); 
                            tbl.width(tblWidth);
                        }
                        elemObj.updateInternalSize($(elem));
                    }
                    if($(elem).hasClass('rcrmBarcodeElement')) $(elem).find('img').attr('src' , resources.host_name + '/pages/getFile.aspx?mode=' + ($(elem).attr('barcode_type') == undefined ? 'qrcode' : $(elem).attr('barcode_type')) + '&width='+ $(elem).width() +'&height='+ $(elem).height() +'&data=' + ($(elem).attr('barcode_data') == undefined ? '' : $(elem).attr('barcode_data')));
                    try {if(rcrmIsEmail) $(elem).css('left' , $(elem).position().left).css('right' , '') } catch (e) {}
                    elemObj.updateSetting($(elem));
                    rcrmSetFullHeight($(elem));
                    rcrmChangeHtml();
                },
                grid: (Container.find('#rcrm_menu_toggle_grid').hasClass('rcrmButtonActive')) ? [rcrmPointSpace, rcrmPointSpace] : null
            }).mousedown(function (e) {
                var target = $(e.target);
                if(!target.hasClass('rcrmSizer')){
                    if (!target.hasClass('rcrmDocElement')) target = $(e.target).parents('.rcrmDocElement').first();
                    rcrmAddSelected(target);
                }
            });

            if(!$(elem).hasClass('rcrmStructElement') || $(elem).hasClass('rcrmstructure1Element')){
                $(elem).draggable({
                    containment: rcrDragContainment,
                    axis : rcrDragAxis,
                    helper : rcrmHelper,
                    start: function (e, sui) {
                        if (!$(elem).hasClass('rcrmSelected')) return false;
                        Container.find('.rcrmEmail_m').css('min-height' , Container.find('.rcrmEmail_m').height());
                        Container.find('.rcrmEmail_p,.rcrmEmail_c').css('min-height' , Container.find('.rcrmEmail_m #rcrm_content').height());
                        $(elem).css({"position": "absolute" });
                        if(rcrmIsEmail) { 
                            $(elem).css('position', 'unset').css('visibility' , 'hidden');
                            $(elem).find('.rcrmDocElement').css('visibility' , 'hidden');
                            $(sui.helper).css('left', $(elem).position().left);
                        }
                    },
                    drag: function (e, eui) {
                        if (Container.find('#rcrm_menu_toggle_grid').hasClass('rcrmButtonActive')) {
                            eui.position.left = Math.round(eui.position.left / rcrmPointSpace) * rcrmPointSpace;
                            eui.position.top = Math.round(eui.position.top / rcrmPointSpace) * rcrmPointSpace;
                        }
                        if(rcrmIsEmail){
                            $(eui.helper).css('left', (e.clientX - ($(elem).parent().offset().left) - ($(elem).width() / 2)) + 'px');
                            if (eui.position.top + 10 > Container.find('#rcrm_content').height() - $(elem).height()) {
                                Container.find('#rcrm_content').height(Container.find('#rcrm_content').height() + 5).removeClass('rcrmEmail_c');
                                Container.find('#rcrm_document_content').height(Container.find('#rcrm_document_content').height() + 5).removeClass('rcrmEmail_p');
                                Container.find('#rcrm_document_main').height(Container.find('#rcrm_document_main').height() + 5).removeClass('rcrmEmail_m');
                                Container.find('#rcrm_document_panel').scrollTop(Container.find('#rcrm_content').height() - Container.find('#rcrm_document_panel').height())
                                return true;
                            }
                        }
                    },
                    stop: function (e, u) {
                        if(rcrmIsEmail){
                            $(this).css('visibility' , 'visible');
                            $(this).find('.rcrmDocElement').css('visibility' , 'visible');
                            Container.find('#rcrm_document_main').addClass('rcrmEmail_m').height('auto');
                            Container.find('#rcrm_document_content').addClass('rcrmEmail_p').height('auto');
                            Container.find('#rcrm_content').addClass('rcrmEmail_c').height('auto');
                            if($(u.helper).parents('.rcrmTableTextElement[heighttype=auto]').length > 0) {
                                var tblDiv = $(u.helper).parents('.rcrmTableElement').first();
                                var tblObj = rcrmFindElementInstance(tblDiv, false);
                                tblObj.updateInternalSize(tblDiv);
                            }
                        }
                        Container.find('.rcrmEmail_m').css('min-height' , '470px');
                        Container.find('.rcrmEmail_p,.rcrmEmail_c').css('min-height' , '464px');
                        rcrmSetAllElementBorder();
                        rcrmSetFullHeight($(elem));
                        //rcrmChangeHtml(); 
                    },
                    grid: (Container.find('#rcrm_menu_toggle_grid').hasClass('rcrmButtonActive')) ? [rcrmPointSpace, rcrmPointSpace] : null
                })
            }

            try {
                $(elem).find('.rcrmDocElementContentFrame').droppable({
                    accept: function (d) { if ((d.hasClass("rcrmMenuButton") || d.hasClass("rcrmDocElement")) && d.attr("pos") != 'footer') return true; },
                    greedy: true,
                    hoverClass: "rcrmElementDragOver",
                    drop: function (e, u) { rcrmDropfunction(e, u, this) }
                });
            } catch (e) { }
           
            if($(elem).hasClass('rcrmTableElement')) rcrmEmailTableDroppable($(elem).find('> table > * > tr > .rcrmTableTextElement'));

            if($(elem).hasClass('rcrmImageElement')){
                var imgElem = $(elem);
                imgElem.find('img').load(function () {
                    elemObj.updateDisplayInternal(imgElem, $(this));
                });
            }

            rcrmRemovePosition($(elem));
        };

        function rcrmBindTableCellEvents(cell) {

            if($(cell).find('.rcrmSizer').length == 0){
                if($(cell).parents('tr').first().parent().is('thead')) $(cell).append('<div class="rcrmSizer rcrmSizerE ui-resizable-handle ui-resizable-e"></div> <div class="rcrmSizer rcrmSizerW ui-resizable-handle ui-resizable-w"></div> <div class="rcrmSizer rcrmSizerS ui-resizable-handle ui-resizable-s"></div>');
                if($(cell).parents('tr').first().parent().is('tbody') || $(cell).parents('tr').first().parent().is('tfoot')) $(cell).append('<div class="rcrmSizer rcrmSizerS ui-resizable-handle ui-resizable-s"></div>');
            }

            if($(cell).attr('id') != "")  var elemObj = rcrmFindElementInstance(cell, true);
            $(cell).dblclick(function (e) {
                var tdElem = $(e.target);
                if(!tdElem.hasClass('rcrmTableTextElement')) tdElem = tdElem.parents('.rcrmTableTextElement').first();
                cell = tdElem;
                //-------------------------------------------------------------------------------------------
                $(cell).attr('type', 'text');
                if($(cell).attr('id') == ""){
                    rcrmIdpointer++;
                    var id = 'rcrm_el' + rcrmIdpointer;
                    $(cell).attr('id', id);
                }
                rcrmAddSelected($(cell));

                var cellObj = rcrmFindElementInstance($(cell), false);
                var tblDiv = $(cell).parents('.rcrmTableElement').first();
                var tbl = tblDiv.find('> table');
                var tblObj = rcrmFindElementInstance(tblDiv, false);
                if(tblDiv.attr('rcrmFixedTable') == undefined) tblDiv.attr('rcrmFixedTable', false);
                var bw = 1;
                if(tblDiv.hasClass('rcrmStructElement')) bw = -1;
                var fix = tblDiv.attr('rcrmFixedTable') == 'true'; //rcrmIsEmail && 

                $(cell).resizable({
                    handles: {
                        'e': '> .rcrmSizerE',
                        'w': '> .rcrmSizerW',
                        's': '> .rcrmSizerS'
                    },
                    start:function (e) {
                        var dir = e.toElement ? e.toElement : e.originalEvent.target;
                        if(fix) {
                            if($(this).next('td').length > 0) tbl.find('> * > tr > td:nth-child('+ ($(this).next('td').index() + 1) +')').width('');
                            else tbl.find('> * > tr > td:nth-child('+ $(this).index() +')').width('');
                        }
                        else
                        {
                            if(!$(dir).hasClass('rcrmSizerS') || rcrmIsFactor) tbl.width(0);
                            try { $(cell).parents('tr').first().find('> .rcrmTableTextElement > .rcrmContentContainerHelper > .rcrmDocElementContentText').height(''); } catch (e) {}
                            if(rcrmRes.lang == 'fa' && tblDiv.css('display') != 'inline-block'){
                                if(rcrmIsFactor){
                                    var right = tblDiv.parent().width() - (tblDiv.position().left + tblDiv.outerWidth(true));
                                    if(right < 0) right = 0;
                                    tblDiv.css('right', right + 'px');
                                    tblDiv.css('left', '');
                                };
                                Container.find('#rcrm_content').css('direction' , 'rtl');
                            }
                        }
                        if($(cell).attr('heighttype') == 'auto'){
                            if(!$(dir).hasClass('rcrmSizerE') && !$(dir).hasClass('rcrmSizerW')) {
                                $(cell).parents('tr').first().find('> .rcrmTableTextElement').attr('heighttype', '').find('> .rcrmContentContainerHelper').css('position', '').find('> .rcrmDocElementContentText').css('min-height', '');
                                tblObj.updateInternalSize(tblDiv)
                            }
                        }
                    },
                    resize:function (e, ui) {
                        var wDif = ui.size.width - $(cell).width();
                        var hDiff = ui.size.height - $(cell)[0].offsetHeight + 1;
                        //-----------------------------------------------------------
                        //tbl.width(tbl.width() + wDif + 1);
                        $(cell).width(ui.size.width + bw);
                        //-----------------------------------------------------------
                        var rowtd = $(cell).parents('tr').first().find('> td');
                        rowtd.height(rowtd[0].offsetHeight + hDiff);
                        //-----------------------------------------------------------
                        $(cell).css({"left": '0px', "top": '0px' , "right": '0px'});
                        try { tblDiv.find('.rcrmHolder').hide() } catch (e) {}
                        if(fix) tbl.find('> * > tr > .rcrmTableTextElement').each(function () {
                            if(rcrmRes.lang == 'fa' && ($(this).offset().left + $(this).width() < tbl.find('> thead > tr > .rcrmTableTextElement:last').offset().left)  && !$(this).parent().parent().is('thead') && $(this).parent().is(':visible') && $(this).parent().parent().is(':visible')) $(this).removeClass('rcrmMergedTD').addClass('rcrmMergedTD');
                            else if(rcrmRes.lang == 'en' && ($(this).offset().left > tbl.find('> thead > tr > .rcrmTableTextElement:last').offset().left)  && !$(this).parent().parent().is('thead') && $(this).parent().is(':visible') && $(this).parent().parent().is(':visible')) $(this).removeClass('rcrmMergedTD').addClass('rcrmMergedTD');
                        });
                    },
                    stop: function (e, sui) {
                        tbl.width(tbl.outerWidth());
                        tblObj.updateInternalSize(tblDiv);
                        cellObj.updateSetting($(cell));
                        if(rcrmRes.lang == 'fa' && tblDiv.css('display') != 'inline-block'){
                            if(rcrmIsFactor){
                                tblDiv.css('left', tblDiv.position().left); tblDiv.css('right', '')
                            }
                            Container.find('#rcrm_content').css('direction' , '');
                        }
                        try { tblDiv.find('.rcrmHolder').hide() } catch (e) {}
                        if(rcrmIsEmail) rcrmSetContainerHeight();
                        rcrmChangeHtml();
                    }
                })
            });
            if($(cell).attr('heighttype') == 'auto') {
                var tblDiv = $(cell).parents('.rcrmTableElement').first();
                var tblObj = rcrmFindElementInstance(tblDiv, false);
                $(cell).resize(function() { if($(this).attr('heightType') == 'auto') tblObj.updateInternalSize(tblDiv) });
            };
        };

        function rcrmLoadHtml(html, templateId, templateName, templateType, emailTextParent, custGroupId, userGroupId, custGroupName, userGroupName) { //, templateStatus
            try { if(templateId != undefined && templateId != null) rcrmOptions.templateId = templateId; } catch (e) {}
            try { if(templateName != undefined && templateName != null) rcrmOptions.templateName = templateName; } catch (e) {}
            try { if(templateType != undefined && templateType != null) { rcrmOptions.templateType = templateType; rcrmUpdateIsEmail() } } catch (e) {}
            try { if(emailTextParent != undefined) rcrmOptions.emailTextParent = emailTextParent } catch (e) {}
            try { if(custGroupId != undefined && custGroupId != null) rcrmOptions.custGroupId = custGroupId } catch (e) {}
            try { if(userGroupId != undefined && userGroupId != null) rcrmOptions.userGroupId = userGroupId } catch (e) {}
            try { if(custGroupName != undefined && custGroupName != null) rcrmOptions.custGroupName = custGroupName } catch (e) {}
            try { if(userGroupName != undefined && userGroupName != null) rcrmOptions.userGroupName = userGroupName } catch (e) {}
            

            rcrmTemplateChangeHandel();
            if(((rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText') && rcrmEmailTextEditor == null) || ((rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS') && Container.find('#rcrmSmsEditor').length == 0)) return false;
            rcrmNewLoadHtml(html);
        }

        function rcrmNewLoadHtml(html) {
            var tempId = rcrmOptions.templateId;
            var tempName = rcrmOptions.templateName;
            var tempType = rcrmOptions.templateType;
            var emailTextParent = rcrmOptions.emailTextParent;
            var custGroupId = rcrmOptions.custGroupId;
            var userGroupId = rcrmOptions.userGroupId;
            var custGroupName = rcrmOptions.custGroupName;
            var userGroupName = rcrmOptions.userGroupName;


            rcrmRefreshTemplateDesign();
            if((tempType == 'EMail_Text' || tempType == 'support_preparedText') && rcrmEmailTextEditor != null) rcrmEmailTextEditor.val(html);
            else if((tempType == 'SMS' || tempType == 'support_CreateUserSupportVaFromSms' || tempType == 'Ticket_SMS') && Container.find('#rcrmSmsEditor').length > 0) Container.find('#rcrmSmsEditor').val(html);
            else {
                if($(html).hasClass('rcrmDocument') || $(html).find('.rcrmDocument').length > 0){
                    Container.find('#rcrm_document_panel #rcrm_document_content').css('left', '-1px').css('top', '-1px').css('right', '0px').css('bottom', '0px');
                    try { if(html.match(/<!--[\s\S]*?-->/g) != null) html = html.replace(/<!--[\s\S]*?-->/g, '') } catch (e) {}
                    Container.find('#rcrm_document_panel').html(html);
                    Container.find('#rcrm_document_panel').find('style').remove();
                    if(rcrmIsFactor) Container.find('#rcrm_document_panel').find('.rcrmDocElement[pos=relative]').rcrmMakeAbsolute();
                    //************************************************************************
                    if(Container.find('#rcrm_document_main').attr('fitpage') == 'true'){
                        Container.find('#rcrm_document_panel').find('[pxleft]').each(function() {
                            $(this).css('left', $(this).attr('pxleft') + 'px');
                        });
                        Container.find('#rcrm_document_panel').find('[pxwidth]').each(function() {
                            $(this).width($(this).attr('pxwidth'));
                            if(rcrmIsEmail) {
                                if($(this).hasClass('rcrmDocument')) $(this).removeClass('rcrmAutoPage').addClass('rcrmAutoPage').attr('fitpage', 'false');
                                else if($(this).hasClass('rcrmDocElement')) $(this).removeClass('rcrmAutoSize').addClass('rcrmAutoSize');
                            }
                        });
                    }
                    if(rcrmIsEmail) {
                        Container.find('#rcrm_document_panel .rcrmAutoPage[pxwidth]').first().width(Container.find('#rcrm_document_panel .rcrmAutoPage[pxwidth]').first().attr('pxwidth'));
                        Container.find('#rcrm_document_panel .rcrmAutoSize[pxwidth]').each(function () {
                            if($(this).attr('style').indexOf('box-sizing') >= 0) $(this).css('padding-right', '').css('padding-left', '').css('box-sizing', '');
                            $(this).width($(this).attr('pxwidth'));

                            if($(this).hasClass('rcrmTableElement')) {
                                var tbl = $(this).find('> table[pxwidth]');
                                tbl.width(tbl.attr('pxwidth'));
                                tbl.find('> * > tr > td[pxwidth]').each(function () {
                                    $(this).width($(this).attr('pxwidth'));
                                    var tdContainer = $(this).find('> .rcrmContentContainerHelper[pxwidth]');
                                    tdContainer.width(tdContainer.attr('pxwidth'));
                                    tdContainer.find('> .rcrmDocElementContentText[pxwidth]').width(tdContainer.find('> .rcrmDocElementContentText[pxwidth]').attr('pxwidth'));
                                });
                            }
                            else {
                                var hContainer = $(this).find('> .rcrmContentContainerHelper[pxwidth]');
                                hContainer.width(hContainer.attr('pxwidth'));
                                hContainer.find('> .rcrmDocElementContentText[pxwidth]').width(hContainer.find('> .rcrmDocElementContentText[pxwidth]').attr('pxwidth'));
                            }
                        })
                        Container.find('#rcrm_document_panel .rcrmAutoSize[pxheight]').each(function () {
                            $(this).height($(this).attr('pxheight'));
                            var hContainer = $(this).find('> .rcrmContentContainerHelper[pxheight]');
                            hContainer.height(hContainer.attr('pxheight'));
                            hContainer.find('> img[pxheight]').height(hContainer.find('> img[pxheight]').attr('pxheight'));
                        })
                        Container.find('#rcrm_document_panel [min-width]').css('min-width' , '');
                        Container.find('#rcrm_document_panel [max-width]').css('max-width' , '');

                        Container.find('#rcrm_document_panel [fixedwidth]').each(function () {
                            $(this).width($(this).attr('fixedwidth'));
                            $(this).removeAttr('fixedwidth');
                        })
                        Container.find('.rcrmImageElement > .rcrmContentContainerHelper').css('min-height' , '');

                        Container.find('#rcrm_document_panel').find('.rcrmAutoSize[margin-right]').each(function () {
                            $(this).css('margin-right', $(this).attr('margin-right') + 'px');
                        });
                        Container.find('#rcrm_document_panel').find('.rcrmAutoSize[margin-left]').each(function () {
                            $(this).css('margin-left', $(this).attr('margin-left') + 'px');
                        });

                        //-webkit- Replace -----------------------------------------------------
                        if(Container.find('#rcrm_document_panel #rcrm_content')[0].style.textAlign.toLowerCase().indexOf("-webkit-") >= 0){
                            try {
                                Container.find('#rcrm_document_panel #rcrm_content').attr('align', Container.find('#rcrm_document_panel #rcrm_content').css('text-align').replace('-webkit-', ''));
                                Container.find('#rcrm_document_panel #rcrm_content').css('text-align', '');
                            } catch (e) {}
                            
                            Container.find('#rcrm_document_panel #rcrm_content .rcrmTextElement').each(function () {
                                try {
                                    var innerelem = $(this).find('> .rcrmContentContainerHelper > .rcrmDocElementContentText'); 
                                    if(innerelem[0].style.textAlign.toLowerCase().indexOf("-webkit-") >= 0) innerelem.css('text-align', innerelem.css('text-align').replace('-webkit-', ''));
                                    if(innerelem.css('white-space') == 'pre-line') innerelem.css('white-space', 'normal');
                                    if($(this).hasClass('rcrmLinkElement')){
                                        if(innerelem.attr('href') == 'http://' || innerelem.attr('href') == '') innerelem.attr('href', 'about:blank');
                                        if(innerelem.find('> a').attr('href') == 'http://' || innerelem.find('> a').attr('href') == '') innerelem.find('> a').attr('href', 'about:blank');
                                    }
                                } catch (e) {}
                            });

                            Container.find('#rcrm_document_panel #rcrm_content .rcrmImageElement').each(function () {
                                try {
                                    var innerelem = $(this).find('> .rcrmContentContainerHelper'); 
                                    if(innerelem[0].style.textAlign.toLowerCase().indexOf("-webkit-") >= 0) { 
                                        innerelem.attr('align', innerelem.css('text-align').replace('-webkit-', ''));
                                        innerelem.css('text-align', '');
                                    }
                                } catch (e) { }
                            });

                            Container.find('#rcrm_document_panel #rcrm_content .rcrmTableElement').each(function () {
                                try {
                                    var innerelems = $(this).find('> table > * > tr > td > .rcrmContentContainerHelper > .rcrmDocElementContentText');
                                    innerelems.each(function (i, innerelem) {
                                        $(innerelem).attr('align', $(innerelem).css('text-align').replace('-webkit-', ''));
                                        $(innerelem).css('text-align', '').css('white-space', 'normal');
                                    })
                                } catch (e) {}
                            });
                        }
                        //End -webkit- Replace -----------------------------------------------
                    }
                    //************************************************************************
                    Container.find('#rcrm_menu_page_setting').trigger('click');
                    rcrmBeforeHtml = Container.find('#rcrm_document_panel').html();
                    rcrmBindContinerEvents();
                }
                else {
                    var hElem = Container.find('#rcrmElementCloneArea').find('.rcrmHtmlElement').attr('type', 'html').clone();
                    hElem.attr('id' , 'rcrm_el1').attr('heightType' , 'auto');
                    var droparea = Container.find('#rcrm_content'); 
                    droparea.append(hElem);
                    if(rcrmIsFactor){
                        rcrmSetElementsPosition(hElem);
                        rcrmSortParentChilds(droparea, hElem);
                        hElem.css({top: 0, left: 0 });
                    }
                    hElem.width(droparea.width() - 8);
                    rcrmIdpointer++;
                    rcrmBindElementEvents(hElem);
                    var elemObj = rcrmFindElementInstance(hElem, false);
                    setTimeout(function () { hElem.width(droparea.width() - 8); elemObj.updateInternalSize(hElem); }, 200, hElem);
                    hElem.find(' > .rcrmContentContainerHelper  > .rcrmDocElementContentText').html(html);
                    rcrmAddSelected(hElem);
                }
            }
            rcrmOptions.templateId = tempId;
            rcrmOptions.templateName = tempName;
            rcrmOptions.templateType = tempType;
            rcrmUpdateIsEmail();
            rcrmOptions.emailTextParent = emailTextParent;
            rcrmOptions.custGroupId = custGroupId;
            rcrmOptions.userGroupId = userGroupId;
            rcrmOptions.custGroupName = custGroupName;
            rcrmOptions.userGroupName = userGroupName;

            rcrmRefreshSettingElements();
            rcrmSetAllElementBorder();
            $(window).trigger('scroll');
            if(Container[0].style.height == "") $(window).scrollTop(0);
        }

        function rcrmGetHtml() {
            var ret = '';
            if ((rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText') && rcrmEmailTextEditor != null) try { ret = rcrmEmailTextEditor.val() } catch (e) {}
            else if((rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS') && Container.find('#rcrmSmsEditor').length > 0) try { ret = Container.find('#rcrmSmsEditor').val() } catch (e) {}
            else if(rcrmIsFactor){
                rcrmRemoveSelected();
                Container.find('#rcrm_content').removeClass('rcrmDocumentGrid');
                Container.find('.rcrmHide').removeClass('rcrmHide');
                Container.find('#rcrm_document_panel').find('.rcrmDocElement[pos=relative]').each(function () {
                    if($(this).css('position') == 'absolute'){
                        var offset = $(this).offset();
                        $(this).css('position', 'relative').offset(offset).attr('pxtop' , $(this).position().top);
                    }
                });
                if(Container.find('#rcrm_document_main').attr('fitpage') == 'true'){
                    var pageobj = rcrmFindElementInstance('#rcrm_document_main',true);
                    pageobj.fitpage.fit();
                }
                Container.find('#rcrm_document_panel').find('style').remove();
                Container.find('#rcrm_document_panel').find('.rcrmSizer').remove();
                return Container.find('#rcrm_document_panel').html().toString();
            }
            else {
                rcrmRemoveSelected();
                var mainWidth = Container.find('#rcrm_document_main')[0].clientWidth;
                var $clone = Container.find('#rcrm_document_main').clone();
                Container.find('#rcrmOutHtml').show().html($clone);
                Container.find('#rcrmOutHtml #rcrm_content').removeClass('rcrmDocumentGrid');
                Container.find('#rcrmOutHtml .rcrmHide').removeClass('rcrmHide');
                //------------------------------------------------------------------------------
                var pageobj = rcrmFindElementInstance('#rcrmOutHtml #rcrm_document_main',true);
                try { Container.find('#rcrmOutHtml #rcrm_document_main').width(mainWidth) } catch (e) { }          
                pageobj.fitpage.fit();
                //------------------------------------------------------------------------------
                rcrmBindPreviewSetting();
                var sheets = document.styleSheets;
                var sheet = jQuery.grep(sheets, function (n, i) { return n.href == null ? false : n.href.includes('css/reportcrm.css') }); //(n.href == resources.host_name + '/Themes/resources/css/reportcrm.css')
                Container.find('#rcrmOutHtml').makeCssInline(sheet);
                Container.find('#rcrmOutHtml').find('style').remove();
                Container.find('#rcrmOutHtml').find('.rcrmSizer').remove();
                Container.find('#rcrmOutHtml').find('.rcrmDivider').remove();
                ret = Container.find('#rcrmOutHtml').html().toString();
                Container.find('#rcrmOutHtml').html('').hide();
            }
            return ret;
        }

        function rcrmRefreshTemplateDesign(templateType) {
            Container.find('#reportcrm').width(Container.width());
            Container.find('#rcrmPreview').width(Container.width());
            Container.find('#rcrm_detail_panel').empty();
            Container.find('#rcrm_content').empty(); //.css('direction' , '');
            Container.find('#rcrm_document_main').attr('style', '').width(595).height(842).attr('type', 'page').attr('format', 'A4').attr('orientation', 'portrait').attr('unit', 'mm').attr('fitpage', 'false').removeClass('rcrmAutoPage');
            Container.find('#rcrm_document_content').attr('style', '').css('left' ,'-1px').css('top' ,'-1px').css('right' ,'0px').css('bottom' ,'0px').attr('bg_filename', '').attr('bg_position', 'right').attr('bg_repeat', 'no-repeat').attr('EmailTextParent', '').css('background-image' , 'unset').css('background-position-x', 'right').css('background-repeat', 'no-repeat').css('background-size', 'unset').css('background-color', 'rgb(255, 255, 255)');
            Container.find('#rcrm_content').attr('style', '').removeClass('rcrmDocumentGrid');
            try { Container.find('#rcrm_divider_margin_left').attr('style', '').css('left' ,'-1px') } catch (e) {}
            try { Container.find('#rcrm_divider_margin_top').attr('style', '').css('top' ,'-1px'); } catch (e) {}
            try { Container.find('#rcrm_divider_margin_right').attr('style', '').css('right' ,'0px').hide(); } catch (e) {}
            try { Container.find('#rcrm_divider_margin_bottom').attr('style', '').css('bottom' ,'0px').hide(); } catch (e) {}
           
            rcrmInstanceList = new Array();
            rcrmIdpointer = 0;
            rcrmOptions.templateId = null;
            rcrmOptions.templateName = '';
            rcrmOptions.emailTextParent = null; 
            rcrmOptions.custGroupId = '';
            rcrmOptions.userGroupId = '';
            rcrmOptions.custGroupName = '';
            rcrmOptions.userGroupName = '';
            try { if(templateType != null && templateType != undefined) rcrmOptions.templateType = templateType; else templateType = ''; } catch (e) {}
            rcrmUpdateIsEmail();
            //rcrmOptions.templateStatus = true;
            rcrmSetContainerHeight()
            rcrmrenderSaveIcon();
            Container.find('#rcrm_menu_page_setting').trigger('click');
            Container.find('#reportcrm').show();
            Container.find('#rcrmPreview').hide();
            try { Container.find('#rcrmPreviewContainer').contents().find('head').empty(); Container.find('#rcrmPreviewContainer').contents().find('body').empty(); } catch (e) {}
            rcrmTemplateChangeHandel();
            if(Container.find('#rcrm_document_panel #rcrm_document_main').find('.rcrmDivider').length == 0) Container.find('#rcrm_document_panel #rcrm_document_main').append(' <div id="rcrm_divider_margin_left" class="rcrmDivider rcrmDividerMarginLeft" style="left: -1px;"></div> <div id="rcrm_divider_margin_top" class="rcrmDivider rcrmDividerMarginTop" style="top: -1px;"></div> <div id="rcrm_divider_margin_right" class="rcrmDivider rcrmDividerMarginRight" style="display: none;"></div> <div id="rcrm_divider_margin_bottom" class="rcrmDivider rcrmDividerMarginBottom" style="display: none;"></div>');
            rcrmUndoStack = new Array();
            rcrmRedoStack = new Array();
            rcrmSetUndoRedoIcons();
            rcrmStackLength = 10;
            rcrmBeforeHtml = Container.find('#rcrm_document_panel').html(); 

            if((rcrmRes.lang == 'fa' && Container.find('#rcrm_document_main').hasClass('rcrm_en')) || (rcrmRes.lang == 'en' && Container.find('#rcrm_document_main').hasClass('rcrm_fa'))){
                Container.find('#rcrm_document_main').removeClass('rcrm_fa').removeClass('rcrm_en').addClass('rcrm_' + rcrmRes.lang);
                Container.find('#reportcrm').removeClass('rcrm_fa').removeClass('rcrm_en').addClass('rcrm_' + rcrmRes.lang);
            }

            if(rcrmRes.lang == 'en'){ 
                $('.rcrmPopupItemHeader[value=F_cost]').parents('li').hide();
                $('.rcrmPopupItemHeader[value=F_tax]').parents('li').hide();
                $('.rcrmPopupItemHeader[value=F_tax_percent]').parents('li').hide();
                $('.rcrmPopupItemHeader[value=F_taxAlfa]').parents('li').hide();
                $('.rcrmPopupItemHeader[value=F_costAlfa]').parents('li').hide();
            }
        }

        function rcrmUpdateIsEmail() {
            rcrmIsEmail = rcrmOptions.templateType != 'factor' && rcrmOptions.templateType != 'sms_show' && rcrmOptions.templateType != 'fax' && rcrmOptions.templateType != 'Customer';
            rcrmIsFactor = rcrmOptions.templateType == 'factor' || rcrmOptions.templateType == 'sms_show' || rcrmOptions.templateType == 'fax' || rcrmOptions.templateType == 'Customer';
        }

        function rcrmFindElementInstance(elem, createNew) {
            var elemObj = null;
            if ($(elem).attr('id') != "") elemObj = Enumerable.from(rcrmInstanceList).firstOrDefault("x=>x.id=='" + $(elem).attr('id') + "'");

            if (elemObj == null && createNew) {
                elemObj = new rcrmMenuItems[$(elem).attr('type')].Elem($(elem).attr('id'), $(elem).attr('type'));
                rcrmInstanceList.push(elemObj);
                try {
                    var idNumber = Number($(elem).attr('id').replace('rcrm_el', ''));
                    if(rcrmIdpointer < idNumber) rcrmIdpointer = idNumber;
                } catch (e) {}
            }
            return elemObj
        }

        function rcrmSetElementsPosition(elem) {
            if (elem.position().left < 0) elem.css('left', '0px');
            if (elem.position().top < 0) elem.css('top', '0px');
            var right = Container.find('#rcrm_content').width() - elem.width() - elem.position().left;
            if (right < 0) elem.css('left', Container.find('#rcrm_content').width() - elem.width() + 'px');
            var bottom = Container.find('#rcrm_content').height() - elem.height() - elem.position().top;
            if (bottom < 0) elem.css('top', Container.find('#rcrm_content').height() - elem.height() + 'px');
        }

        function rcrmSortParentChilds(parent,elem, helper) {
            var i=0;
            var elemTop = $(elem).offset().top;
            if(helper != undefined) elemTop = $(helper).offset().top;
            
            $(parent).children('.rcrmDocElement').each(function(){
                if(($(this).offset().top > elemTop) && ($(this).attr('id') != $(elem).attr('id'))) { $(elem).insertBefore($(this)); i=1; return false; }
            });
            if(i!=1) $(parent).append($(elem)); 
        }

        function rcrmEmailTableDroppable(td){
            try {
                if(rcrmIsEmail) {
                    td.find(' > .rcrmContentContainerHelper > .rcrmDocElementContentText').droppable({
                        accept: function (d) { if (d.hasClass("rcrmMenuButton") || d.hasClass("rcrmDocElement") || d.hasClass("rcrmStructOption")) return true; },
                        greedy: true,
                        hoverClass: "rcrmElementDragOver",
                        drop: function (e, u) {
                            rcrmDropfunction(e, u, this);
                            var tdElem = $(this).parents('.rcrmTableTextElement').first();
                            if(tdElem.attr('heighttype') == 'auto'){
                                var tblDiv = tdElem.parents('.rcrmTableElement').first();
                                var tblObj = rcrmFindElementInstance(tblDiv, false);
                                tblObj.updateInternalSize(tblDiv);
                            }
                        }
                    });
                }
            } catch (e) { }
        }

        function rcrmEmailFitPage() {
            if(Container.find('#rcrm_document_main').width() > Container.find('#rcrm_document_panel').width() - 2){
                Container.find('#rcrm_document_main').css('width' , Container.find('#rcrm_document_panel').width() - 2);
                rcrmSetContainerHeight();
                Container.find('#rcrm_menu_page_setting').trigger('click');
                Container.find('#rcrm_content .rcrmDocElement').each(function myfunction() {
                    if($(this).width() > Container.find('#rcrm_document_main').width()) rcrmEmailElementsFitWidth(Container.find('#rcrm_content'), $(this));
                });
            }
            else { rcrmSetContainerHeight(); Container.find('#rcrm_menu_page_setting').trigger('click') }
        }
       
        function rcrmEmailElementsFitWidth(droparea, Elem, elemObj) {
            if(elemObj == undefined) elemObj = rcrmFindElementInstance(Elem , false);
            if(rcrmIsEmail) {
                var border = 2;
                var margin = Number(Elem.css('margin-left').replace('px' , '')) + Number(Elem.css('margin-right').replace('px' , ''));
                if(Elem.hasClass('rcrmLineElement')) border = 0;
                if(!Elem.hasClass('rcrmLinkElement') && !Elem.hasClass('rcrmBarcodeElement')) { Elem.width($(droparea).width() - (margin + border)); }
                try { if(Elem.hasClass('rcrmTableElement')) {
                    var tbl = Elem.find('> table');
                    var dropareaWidth = $(droparea).width() - (Number($(droparea).css('padding-left').replace('px' , '')) + Number($(droparea).css('padding-right').replace('px' , '')));

                    if(Elem.hasClass('rcrmstructure2Element')) { dropareaWidth = dropareaWidth / 2; Elem.css('display' , 'inline-block') }
                    if(Elem.hasClass('rcrmstructure3Element')) { dropareaWidth = dropareaWidth / 3; Elem.css('display' , 'inline-block') }
                    if(Elem.hasClass('rcrmstructure4Element')) { dropareaWidth = dropareaWidth / 4; Elem.css('display' , 'inline-block') }
                    if(Elem.hasClass('rcrmstructure5_1Element')) { dropareaWidth = dropareaWidth / 3; Elem.css('display' , 'inline-block') }
                    if(Elem.hasClass('rcrmstructure5_2Element')) { dropareaWidth = 2 * (dropareaWidth / 3); Elem.css('display' , 'inline-block') }
                    if(Elem.hasClass('rcrmstructure6_2Element')) { dropareaWidth = dropareaWidth / 3; Elem.css('display' , 'inline-block') }
                    if(Elem.hasClass('rcrmstructure6_1Element')) { dropareaWidth = 2 * (dropareaWidth / 3); Elem.css('display' , 'inline-block') }
                    
                    setTimeout(function () {
                        Container.find('#rcrm_detail_panel .rcrm_element_size_row .rcrm_element_width').val(Math.floor(dropareaWidth - margin)).trigger('input'); 
                    }, 30, dropareaWidth , margin)
                    
                }} catch (e) {} 
                try { if(Elem.hasClass('rcrmTextElement') || Elem.hasClass('rcrmHtmlElement') || Elem.hasClass('rcrmTableElement')) elemObj.updateInternalSize(Elem);} catch (e) {}
                try { if(Elem.hasClass('rcrmImageElement') && !Elem.hasClass('rcrmBarcodeElement')) elemObj.updateDisplayInternal(Elem, Elem.find('img')) } catch (e) {}
            }
        }

        function rcrmGenerateStructure(droparea ,Elem, elemObj) {
            if(Elem.hasClass('rcrmstructure2Element')) rcrmCopyElement(Elem);
            if(Elem.hasClass('rcrmstructure3Element')) { rcrmCopyElement(Elem); rcrmCopyElement(Elem) }
            if(Elem.hasClass('rcrmstructure4Element')) { rcrmCopyElement(Elem); rcrmCopyElement(Elem); rcrmCopyElement(Elem) }
            if(Elem.hasClass('rcrmstructure5Element')) {
                Elem.addClass('rcrmstructure5_1Element');
                rcrmEmailElementsFitWidth(droparea ,Elem, elemObj);
                setTimeout(function () {
                    rcrmCopyElement(Elem);
                    var copyElem = Container.find('#rcrm_content').find('.rcrmSelected').removeClass('rcrmstructure5_1Element').addClass('rcrmstructure5_2Element');
                    rcrmEmailElementsFitWidth(droparea , copyElem, elemObj) }, 40, Elem, droparea, elemObj)
            }
            if(Elem.hasClass('rcrmstructure6Element')) {
                Elem.addClass('rcrmstructure6_1Element');
                rcrmEmailElementsFitWidth(droparea ,Elem, elemObj);
                setTimeout(function () {
                    rcrmCopyElement(Elem);
                    var copyElem = Container.find('#rcrm_content').find('.rcrmSelected').removeClass('rcrmstructure6_1Element').addClass('rcrmstructure6_2Element');
                    rcrmEmailElementsFitWidth(droparea ,copyElem , elemObj) }, 40, Elem, droparea, elemObj)
            }
        }

        function rcrmShowParametrs(elemType) {
            var input = Container.find('#rcrm_detail_panel').find('.rcrm_element_content');
            Container.find('.rcrmPopupWindow').removeClass('EMail_Link');
            Container.find('.rcrmPopupWindow').css({top: input.offset().top + input.outerHeight(), left: input.offset().left });
            if(rcrmOptions.openDialog == true) Container.find('.rcrmPopupWindow').css({top: 125 , left: Container.find('#rcrm_document_panel').width() + 50 });
            Container.find('.rcrmPopupWindow ul').addClass('rcrmHidden');
            if(elemType != 'rcrmEmail' && elemType != 'rcrmEmailLink') Container.find('.rcrmPopupWindow').find('ul[type="'+ rcrmOptions.templateType + '_' + elemType +'"]').removeClass('rcrmHidden');
            else {
                Container.find('.rcrmPopupSearch').val('');
                Container.find('.rcrmPopupItemHeader').removeClass('rcrmHidden').parent().removeClass('rcrmHidden');
                Container.find('.rcrmPopupItemSeparator').show();
                if(rcrmOptions.templateType == 'sms_show') {
                    Container.find('.rcrmPopupItemSeparator[group=SMS]').show();
                    Container.find('.rcrmPopupItemHeader[group=SMS]').removeClass('rcrmHidden').parent().removeClass('rcrmHidden');
                }
                else {
                    Container.find('.rcrmPopupItemSeparator[group=SMS]').hide();
                    Container.find('.rcrmPopupItemHeader[group=SMS]').addClass('rcrmHidden').parent().addClass('rcrmHidden') 
                } 

                if (elemType == 'rcrmEmailLink') {
                    input = Container.find('#rcrm_detail_panel').find('.rcrm_element_link_type');
                    Container.find('.rcrmPopupWindow').addClass('EMail_Link').css({ top: input.offset().top + input.outerHeight(), left: input.offset().left });
                }
                Container.find('.rcrmPopupWindow').find('ul[type="EMail_text"]').removeClass('rcrmHidden');
            }
            Container.find('.rcrmPopupWindow').removeClass('rcrmHidden');
        }

        function rcrmImportFile() {
            $("#rcrm_fileUpload").attr("action", 'upload_fileManager.ashx?d=' + $('#HFdomain').val() + '&u=' + $('#HFUserCode').val() + '&c=' + $('#HFcodeDU').val() + "&share=readHtml");
            $("#rcrm_fileUpload").submit();
            return false;
        }

        function rcrmRemoveSelected() {
            Container.find('.rcrmSelected').removeClass('rcrmSelected');
            Container.find('#rcrm_detail_panel').empty();
            Container.find('#rcrm_document_main').removeClass('rcrmDocumentSetting');
        }

        function rcrmAddSelected(target) {
            Container.find('.rcrmSelected').removeClass('rcrmSelected');
            Container.find('#rcrm_detail_panel').empty();
            Container.find('#rcrm_document_main').removeClass('rcrmDocumentSetting');
            $(target).addClass('rcrmSelected');
            var createNew = false;
            if($(target).hasClass('rcrmTableTextElement')) { createNew = true }
            var elemObj = rcrmFindElementInstance(target, createNew);
            if (elemObj != null){
                elemObj.appendSetting(target);
                if($(target).hasClass('rcrmTextElement')) Container.find('#rcrm_detail_panel').find('.rcrm_element_content').focus();
                if($(target).hasClass('rcrmHtmlElement')) Container.find('#rcrm_detail_panel').find('.ravesh-editor-content').focus();
                elemObj.updateSetting(target);
            }
        }

        function rcrmSetAllElementBorder() {
            Container.find('#rcrm_document_content').find('.rcrmTextElement').each(function () {
                rcrmSetElementBorder($(this));
            })
            Container.find('#rcrm_document_content').find('.rcrmFrameElement').each(function () {
                rcrmSetElementBorder($(this));
            })
        }

        function rcrmSetElementBorder(elem) {
            try {
                if(Container.find('#rcrm_menu_toggle_border').hasClass('rcrmButtonActive')) $(elem).removeClass('rcrmHide');
                else{ if($(elem).find('> .rcrmContentContainerHelper > div').is(':empty')) $(elem).removeClass('rcrmHide'); else $(elem).addClass('rcrmHide'); }
            } catch (e) {}
        }

        function rcrmSetContainerHeight() {
            var margin = 0;
            if(Container.width() < rcrmMenuBreakWidth) margin = 42; else margin = 0;
            if(Container[0].style.height == "" || Container[0].style.height == 'auto'){
                var scrollHeight = 0;
                try { scrollHeight =  Container.find('#rcrm_document_panel')[0].offsetHeight - Container.find('#rcrm_document_panel')[0].clientHeight } catch (e) {}
                var docHeight = (Container.find('#rcrm_document_main').outerHeight() + 5 + scrollHeight); // + 40;
                if(docHeight < 465) docHeight = 465; //490
                Container.find('#rcrm_document_panel').height(docHeight);
                Container.find('#reportcrm').height(docHeight + 80 + margin);
                Container.find('#UCdialog_TemplateDesign').height(docHeight + 80 + margin);
            }
            else{
                var docHeight = Number(Container[0].style.height.replace('px', '')); //Container.height();
                //Container.find('#rcrm_document_panel').height(docHeight - 80 - margin);
                Container.find('#reportcrm').height(docHeight);
                Container.find('#UCdialog_TemplateDesign').height(docHeight);
            }
            //----------------------------------------------------------------------------------
            if(Container.width() < rcrmMenuBreakWidth){
                Container.find('#reportcrm > .rcrmContainer').css('top' , '90px');
                Container.find('.rcrm_fa .rcrmElementButtonContainer').css('float' , 'right');
                Container.find('.rcrm_en .rcrmElementButtonContainer').css('float' , 'left');
            }
            else{
                Container.find('#reportcrm > .rcrmContainer').css('top' , '45px');
                Container.find('.rcrm_fa .rcrmElementButtonContainer').css('float' , 'left');
                Container.find('.rcrm_en .rcrmElementButtonContainer').css('float' , 'right');
            }
            //----------------------------------------------------------------------------------
            setTimeout(function () { rcrmSetDetailPanelSize() }, 300);
        }

        function rcrmSetDetailPanelSize() {
            if(rcrmOptions.openDialog == false){
                var $el =  Container.find('#reportcrm > .rcrmContainer'),
                    topHeight =   $('#header').height() + Container.find('.rcrmMenuPanel').height(),
                    scrollTop = $(this).scrollTop(),
                    scrollBot = scrollTop + $(this).height(),
                    elTop = $el.offset().top,
                    elBottom = elTop + $el.outerHeight(),
                    visibleTop = elTop - topHeight < scrollTop ? scrollTop + topHeight : elTop,
                    visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
                Container.find('#rcrm_detail_panel').height(visibleBottom - visibleTop - 32);
                Container.find('#rcrm_detail_panel').width(Container.find('#reportcrm').width() - Container.find('#rcrm_document_panel').width() - 48);
            }
            else {
                var showHeight = $('.ravesh-dialog').height() - $('.ravesh-dialog > .head').height() - Container.find('.rcrmMenuPanel').height() - 48;
                if(Container.find('#rcrm_document_panel').height() < showHeight) showHeight = Container.find('#rcrm_document_panel').height();
                Container.find('#rcrm_detail_panel').height(showHeight);
                Container.find('#rcrm_detail_panel').width(Container.find('#reportcrm').width() - Container.find('#rcrm_document_panel').width() - 48);
            }
        }

        function rcrmSetFullHeight(elem) {
            try {
                if(elem.hasClass('rcrmFrameElement') || elem.hasClass('rcrmImageElement')){
                    if (elem.position().top + elem.outerHeight() > elem.parent().height()) elem.addClass('rcrmFullHeight');
                    else elem.removeClass('rcrmFullHeight');
                }
            } catch (e) {}
        }

        function rcrmrenderSaveIcon() {
            if(rcrmOptions.insertCallBack != null || rcrmOptions.updateCallBack != null){
                Container.find('#rcrm_menu_save').show();
            }
            else
            { 
                Container.find('#rcrm_menu_save').hide();
            }
        }

        function rcrmFillFontSelect() {
            if(rcrmRes.lang == "fa") {
                Container.find('.rcrm_html_content').attr('dir', 'rtl');
                Container.find('.rcrm_element_font').append('<option value="Tahoma_faNum" style="font-family:Tahoma_faNum; font-size:12px">'+ Container.find('.rcrmIranSansFaNum').text() +'</option>');
                Container.find('.rcrm_element_font').append('<option value="Tahoma" style="font-family:tahoma; font-size:12px">'+ Container.find('.rcrmIranSans').text() +'</option>');
                Container.find('.rcrm_element_font').append('<option value="BTitrBold" style="font-family:BTitrBold">'+ Container.find('.rcrmTitr').text() +'</option>');
                Container.find('.rcrm_element_font').append('<option value="BKoodakBold" style="font-family:BKoodakBold">'+ Container.find('.rcrmKoodak').text() +'</option>');
                Container.find('.rcrm_element_font').append('<option value="BHoma" style="font-family:BHoma">'+ Container.find('.rcrmHoma').text() +'</option>');
                Container.find('.rcrm_element_font').append('<option value="BYekan" style="font-family:BYekan">'+ Container.find('.rcrmYekan').text() +'</option>');
            } else {
                Container.find('.rcrm_html_content').attr('dir', 'ltr');
                Container.find('.rcrm_element_font').append('<option value="Tahoma" style="font-family:tahoma">Tahoma</option>');
                Container.find('.rcrm_element_font').append('<option value="arial" style="font-family:arial">Arial</option>');
                Container.find('.rcrm_element_font').append('<option value="georgia" style="font-family:georgia">Georgia</option>');
                Container.find('.rcrm_element_font').append('<option value="impact" style="font-family:impact">Impact</option>');
                Container.find('.rcrm_element_font').append('<option value="verdona" style="font-family:verdona">Verdona</option>');
            }
        }

        function rcrmDeleteElement(elem) {
            if(! elem.hasClass('rcrmTableTextElement')){
                try {rcrmInstanceList = rcrmInstanceList.filter(item => item.id !=  elem.attr('id')); } catch (e) {}
                var tdParent = elem.parents('.rcrmTableTextElement[heighttype=auto]');
                elem.remove();
                rcrmRemoveSelected();
                if(rcrmIsEmail) rcrmSetContainerHeight();
                rcrmSetAllElementBorder();
                rcrmChangeHtml();
                Container.find('#rcrm_menu_page_setting').trigger('click');
                try { if(tdParent.length > 0) tdParent.trigger('resize') } catch (e) {}
            }
        }

        function rcrmChangePointSpace() {
            elem = Container.find('#rcrm_menu_toggle_grid');
            Container.find('#rcrm_document_content').find('.rcrmDocElement').draggable({ grid: (elem.hasClass('rcrmButtonActive')) ? [rcrmPointSpace, rcrmPointSpace] : null })
                                                               .resizable({ grid: (elem.hasClass('rcrmButtonActive')) ? [rcrmPointSpace, rcrmPointSpace] : null });
            if(elem.hasClass('rcrmButtonActive')) Container.find('.rcrmDocumentGrid').css('background-size', rcrmPointSpace + 'px');
        }
        
        function rcrmSave() {
            var tempId = rcrmOptions.templateId;
            var tempName = rcrmOptions.templateName;
            var tempType = rcrmOptions.templateType;
            var emailTextParent = rcrmOptions.emailTextParent;
            var custGroupId = rcrmOptions.custGroupId;
            var userGroupId = rcrmOptions.userGroupId;

            if(rcrmOptions.openDialog == true) {
                if (rcrmRes.lang == 'fa') $('.ravesh-dialog').css('direction', 'rtl'); else $('.ravesh-dialog').css('direction', 'ltr');
                $('.ravesh-dialog').find('.title').css('padding' , '0 15px');
            }
           
            if(tempName == '' || tempName == null) {
                RaveshUI.promptModal(rcrmRes.enter_name, rcrmRes.ok, '', function(value){
                    tempName = value;
                    var html = rcrmGetHtml().toString();
                    if(tempId == null) rcrmOptions.insertCallBack(html, tempName, tempType, emailTextParent, custGroupId, userGroupId);
                    else rcrmOptions.updateCallBack(html, tempName, tempType, emailTextParent, custGroupId, userGroupId);
                });
            }
            else {
                var html = rcrmGetHtml().toString();
                if(tempId == null) rcrmOptions.insertCallBack(html, tempName, tempType, emailTextParent, custGroupId, userGroupId);
                else rcrmOptions.updateCallBack(html, tempName, tempType, emailTextParent, custGroupId, userGroupId);
            }
        }

        function rcrmCopyElement(elem) {
            var copyElem = elem.clone();
            copyElem.attr('id' , 'rcrm_el' + (rcrmIdpointer + 1));
            var droparea = elem.parent(); 
            droparea.append(copyElem);
            rcrmSetElementsPosition(copyElem);
            rcrmSortParentChilds(droparea, copyElem);
            copyElem.css({top: elem.position().top + 10, left: elem.position().left + 10 });
            rcrmIdpointer++;
            rcrmBindElementEvents(copyElem);
            if(copyElem.hasClass('rcrmTableElement')){
                copyElem.find('> table > * > tr > .rcrmTableTextElement').find('.rcrmDocElement').each(function () {
                    rcrmCopyElement($(this))
                    $(this).remove();
                });
                copyElem.find('.rcrmTableTextElement').each(function () {
                    rcrmBindTableCellEvents(this);
                });
            }
            if(copyElem.hasClass('rcrmFrameElement')){
                copyElem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentFrame').find('.rcrmDocElement').each(function () {
                    rcrmCopyElement($(this))
                    $(this).remove();
                });
            }
            rcrmAddSelected(copyElem);
        }

        function rcrmNund(inputStr) {
            if (inputStr != null) return inputStr;
            else return '';
        }

        function rcrmTextKeyDown(e, elem, triger) {
            if(triger == undefined) triger = 'input'
            var diff = 1;
            if(e.shiftKey) diff = 10;
            if(e.keyCode == 38){
                elem.val(isNaN(Number(elem.val())) ? 0 : Number(elem.val()) + diff);
                elem.trigger(triger);
            }
            if(e.keyCode == 40){
                elem.val(isNaN(Number(elem.val())) ? 0 : Number(elem.val()) - diff);
                elem.trigger(triger);
            }
        }

        function rcrmIsNumber(e, isFloat) {
            e = (e) ? e : window.event;
            var charCode = (e.which) ? e.which : e.keyCode;
            if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105) || (isFloat && charCode == 110) ||
                 charCode == 8 || charCode == 46|| charCode == 16 || charCode == 37 || charCode == 39 || charCode == 9) return true; 
            else return false;
        }

        function rcrmFormFieldChange(val_) {
            if((rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText') && rcrmEmailTextEditor != null) rcrmEmailTextEditor.insertHtml(val_);
            else if((rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS') && Container.find('#rcrmSmsEditor').length > 0) 
                Container.find('#rcrmSmsEditor').val(Container.find('#rcrmSmsEditor').val() + ' ' + val_);
            else {
                var input = Container.find('#rcrm_detail_panel').find('.rcrm_element_content');
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                var elemObj = rcrmFindElementInstance(elem, false);
                input.val(input.val() + '&nbsp;' + val_);
                elemObj.content.inputText(elem, input.val());
                elemObj.updateSetting(elem);
                //input.val(elem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').text());
                input.trigger('keydown');
            }
            Container.find('.rcrmPopupWindow').addClass('rcrmHidden');
        }

        function rcrmReplacePreview(htm) {
            var setting= rcrmAllSetting;
            var strF = htm;
            strF = strF.replace(/#F_currenttime#/gi, rcrmNund(setting.currenttime));
            strF = strF.replace(/#F_currentdate#/gi, rcrmNund(setting.currentdate));
            strF = strF.replace(/#F_date#/gi, rcrmNund(setting.currentdate));
            strF = strF.replace(/#F_unitprice#/gi, rcrmNund(setting.UnitPrice));
            strF = strF.replace(/#S_name#/gi, rcrmNund(setting.CompanyCommander));
            strF = strF.replace(/#S_companyname#/gi, rcrmNund(setting.CompanyName));
            strF = strF.replace(/#S_regnumber#/gi, rcrmNund(setting.RegNumber));
            strF = strF.replace(/#S_state#/gi, rcrmNund(setting.Province));
            strF = strF.replace(/#S_city#/gi, rcrmNund(setting.City));
            strF = strF.replace(/#S_address#/gi, rcrmNund(setting.CompanyAddress));
            strF = strF.replace(/#S_economicNumber#/gi, rcrmNund(setting.EconomicNumber));
            strF = strF.replace(/#S_zipcode#/gi, rcrmNund(setting.ZipCode));
            strF = strF.replace(/#S_phoneOrfax#/gi, rcrmNund(setting.CompanyTel));
            strF = strF.replace(/#S_fax#/gi, rcrmNund(setting.CompanyFax));
            strF = strF.replace(/#\w*#/gi, '').replace(/[$]\w*[$]/gi, '');
            return strF;
        }

        function rcrmBindPreviewSetting() {
            Container.find('#rcrmOutHtml .rcrmImageElement > .rcrmContentContainerHelper').each(function () {
                if($(this).css('background-image') == 'none') $(this).css('min-height', '');
                else $(this).css('min-height', $(this).parent().attr('pxheight') + 'px');
            });

            Container.find('.rcrmSizer').hide();
            Container.find('#rcrmOutHtml .rcrmTextElement > .rcrmContentContainerHelper > .rcrmDocElementContentText').each(function () {
                var content = $(this).parents('.rcrmTextElement').first();
                var contianer = content.find('> .rcrmContentContainerHelper');
                
                /*if(content.hasClass('rcrmBorderLess'))*/ content.height('');
                if ($(this)[0].style.wordBreak == "unset") {
                    content.width('');
                    contianer.width('');
                    $(this).width('100%');
                }

                if(content.hasClass('rcrmLinkElement')){
                    if($(this).attr('href') == 'http://' || $(this).attr('href') == '') $(this).attr('href', 'about:blank');
                    if($(this).find('> a').attr('href') == 'http://' || $(this).find('> a').attr('href') == '') $(this).find('> a').attr('href', 'about:blank');
                }
            });
            Container.find('#rcrmOutHtml .rcrmEmail_m').css('min-height' , '');
            Container.find('#rcrmOutHtml .rcrmEmail_p,#rcrmOutHtml .rcrmEmail_c').css('min-height' , '');
            Container.find('#rcrmOutHtml .rcrmHtmlElement').each(function () { //.rcrmBorderLess
                $(this).css('min-height', $(this).find('> .rcrmContentContainerHelper').height());
                $(this).height('auto');
            });

            Container.find('#rcrmOutHtml .rcrmDocElement:not(.rcrmAutoSize)').each(function () { 
                if($(this).hasClass('rcrmTableElement')) { var tbl = $(this).find('> table'); tbl.width(tbl.width() + 2) } //.attr('fixedwidth',tbl.width())
                else $(this).attr('fixedwidth',$(this).width()).width($(this).width() + 2);
            });

            Container.find('#rcrmOutHtml .rcrmDocElement').css('max-width' ,'');
            Container.find('#rcrmOutHtml .rcrmDocElement').css('min-width' ,'');
            Container.find('#rcrmOutHtml .rcrmDocElement[max-width]').each(function () { $(this).css('max-width' ,$(this).attr('max-width') + 'px') });
            Container.find('#rcrmOutHtml .rcrmDocElement[min-width]').each(function () { $(this).css('min-width' ,$(this).attr('min-width') + 'px') });

            try 
            {
                var categories = new Array();
                Container.find('#rcrmOutHtml [style*="inline-block"]').each(function () {
                    var parentTop = 0, parentLeft = 0;
                    if($(this).parents('.rcrmDocElement').first().length > 0){
                        parentTop = $(this).parents('.rcrmDocElement').first().position().top
                        parentLeft = $(this).parent().offset().left;
                    }
                    categories.push({'elem':this, 'key': $(this).position().top + '_' + parentTop + '_' + parentLeft + '_' + 'inline' })
                });
                Container.find('#rcrmOutHtml [style*="max-width"]').each(function () {
                    if($(this).css('display') != 'inline-block') categories.push({'elem':this, 'key':'maxWidth'})
                });
                Container.find('#rcrmOutHtml [style*="background-image"]').each(function () {
                    if($(this).css('background-image') != 'none') categories.push({'elem':this, 'key':'backgroundImage'})
                });
                Container.find('#rcrmOutHtml .rcrmDocElementContentText[style*="padding"]').each(function () {
                    categories.push({'elem':this, 'key':'padding'})
                });

                var elemGroups = rcrmGroupBy(categories, 'key');
                for (var property in elemGroups) {
                    var lineElems = elemGroups[property];

                    

                    if(property == 'backgroundImage') $(lineElems).each(function (i, Elem) {
                        Elem = Elem.elem;
                        var src = $(Elem).css('background-image').replace('url("', '').replace('")', '');
                        var parent = $(Elem).parents('.rcrmDocElement').first();
                        var inner = $(Elem).find('> .rcrmContentContainerHelper > .rcrmDocElementContentText');
                        if(parent.length > 0) if(parent.hasClass('rcrmStructElement')) Elem = inner[0];
                        var zindex= '-1';
                        var position = 'relative';
                        if($(Elem).children().length == 0) { zindex = '0'; position = '' }
                        $(Elem).prepend($('<!--[if mso | IE]>  <v:image xmlns:v="urn:schemas-microsoft-com:vml" id="theImage" style="behavior: url(#default#VML); display: inline-block; position: '+ position +'; width: '+ $(Elem).width() +'; height: '+ $(Elem).height() +'; top: 0; left: 0; border: 0; z-index: '+ zindex +'" src="'+ src +'" /> <v:shape xmlns:v="urn:schemas-microsoft-com:vml" id="theText" style="behavior: url(#default#VML); display: inline-block; position:relative; width: '+ $(Elem).width() +'; height: '+ $(Elem).height() +'; top: -5; left: -10; border: 0; z-index: '+ zindex +'"> <div> </div></v:shape> <![endif]-->'));
                    });

                    if(property == 'padding') $(lineElems).each(function (i, Elem) {
                        Elem = Elem.elem;
                        $('<!--[if mso | IE]><table style="width:' + Elem.style.width +'" cellpadding="0" cellspacing="0" border="0" valign="top"><tr><td style="'+ $(Elem).attr('style') +'" valign="top"><![endif]-->').insertBefore($(Elem));
                        $('<!--[if mso | IE]></td></tr></table><![endif]-->').insertAfter($(Elem));
                    });

                    if(property == 'maxWidth') $(lineElems).each(function (i, Elem) {
                        Elem = Elem.elem;
                        $('<!--[if mso | IE]> <table style="width:' + $(Elem).css('max-width') +'" role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td style="vertical-align:top;width:'+ $(Elem).css('max-width') +'"> <![endif]-->').insertBefore($(Elem));
                        $('<!--[if mso | IE]> </td></tr></table> <![endif]-->').insertAfter($(Elem));
                    });
                    else if(property.indexOf('inline') >= 0) {
                        var tblWidth = 0;
                        var tblWidthPost = 'px';
                        var percentCount = 0;
                        var maxWidth = false;
                        var parent = null;

                        $(lineElems).each(function (i, Elem) {
                            Elem = Elem.elem;
                            if(Elem.style.width.indexOf('%') >= 0) percentCount++ ;
                            if($(Elem).css('max-width') != 'none' &&  $(Elem).css('max-width') != 'unset') maxWidth = true;
                        });
                        if(percentCount == lineElems.length && maxWidth == false) tblWidthPost = '%';

                        $(lineElems).each(function (i, Elem) {
                            Elem = Elem.elem;
                            if(Elem.style.width.indexOf('%') >= 0 && tblWidthPost == '%') tblWidth = tblWidth + Number(Elem.style.width.replace('%', '')); 
                            else tblWidth = tblWidth + $(Elem).width();
                        });
                        tblWidth = tblWidth + tblWidthPost;

                        $(lineElems).each(function (i, Elem) {
                            Elem = Elem.elem;
                            if(lineElems.length == 1) {
                                $('<!--[if mso | IE]> <table style="vertical-align:top;width:' + tblWidth +'" role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td style="vertical-align:top;width:'+ Elem.style.width +'"> <![endif]-->').insertBefore($(Elem));
                                $('<!--[if mso | IE]> </td></tr></table> <![endif]-->').insertAfter($(Elem));
                            }
                            else {
                                if(i==0) $('<!--[if mso | IE]> <table style="vertical-align:top;width:' + tblWidth +'" role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td style="vertical-align:top;width:'+ Elem.style.width +'"> <![endif]-->').insertBefore($(Elem));
                                else if(i==(lineElems.length - 1)) { $('<!--[if mso | IE]> </td><td style="vertical-align:top;width:'+ Elem.style.width +'"> <![endif]-->').insertBefore($(Elem)); $('<!--[if mso | IE]> </td></tr></table> <![endif]-->').insertAfter($(Elem)); }
                                else $('<!--[if mso | IE]> </td><td style="vertical-align:top;width:'+ Elem.style.width +'"> <![endif]-->').insertBefore($(Elem));
                            }
                        });
                    }
                };
            } catch (e) {}

            try {
                Container.find('#rcrmOutHtml .rcrmImageElement').each(function () { 
                    $('<!--[if mso | IE]> <div style="display:none"> <![endif]-->').insertBefore($(this).find('img'));
                    $('<!--[if mso | IE]> </div> <![endif]-->').insertAfter($(this).find('img'));
                    $(this).prepend($('<!--[if mso | IE]>  <v:image xmlns:v="urn:schemas-microsoft-com:vml" style="behavior: url(#default#VML); display: inline-block;width: '+ $(this).find('img').width() +'; height: '+ $(this).height() +'" src="'+ $(this).find('img').attr('src') +'" /> <div> </div> <![endif]-->'));
                });
            } catch (e) {}

        }

        function rcrmGroupBy(xs, key) {
            return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        }

        function rcrmRemovePosition(elem) {
            if(rcrmIsEmail) {
                float = 'left';
                if (rcrmRes.lang == 'en') {float = 'right'; }
                elem.css({"position": "unset", "left": 'unset', "top": 'unset'}); //'margin' : '3px'
                elem.find('> .rcrmContentContainerHelper').css({"position": "unset", "left": 'unset', "top": 'unset' , 'margin-top' : '0px' , 'margin-left' : '0px' });
                elem.find('> .rcrmContentContainerHelper > div').css({"position": "unset", "left": 'unset', "top": 'unset' });
                if(elem.hasClass('rcrmLinkElement')) elem.find('> .rcrmContentContainerHelper > rcrmDocElementContentText').css({"position": "unset", "left": 'unset', "top": 'unset' });
                elem.find('> .rcrmSizer').css({"position": "unset", "left": 'unset', "top": 'unset', 'float' : float });
                if(elem.hasClass('rcrmTableElement')){
                    if(rcrmRes.lang == 'fa')  elem.find('> .rcrmSizerE').remove(); else elem.find('> .rcrmSizerW').remove();
                    elem.find('> .rcrmSizerW').css({ 'float': 'left', 'margin' : '-7px 0 0 -4px' });
                    elem.find('> .rcrmSizerE').css({ 'float': 'right', 'margin' : '-7px -4px 0 0' });
                }
                else if(elem.hasClass('rcrmLineElement')){
                    if(rcrmRes.lang == 'fa')  elem.find('> .rcrmSizerE').remove(); else elem.find('> .rcrmSizerW').remove();
                    elem.find('> .rcrmSizerW').css({ 'float': 'left', 'margin' : '-3px 0 0 -4px' });
                    elem.find('> .rcrmSizerE').css({ 'float': 'right', 'margin' : '-3px -4px 0 0' });
                }
                else  {
                    if(rcrmRes.lang == 'fa'){
                        elem.find('> .rcrmSizer:not(.rcrmSizerSW)').remove();
                        elem.find('> .rcrmSizerSW').css({'margin' : '-6px 0 0 -4px' });
                    }
                    else {
                        elem.find('> .rcrmSizer:not(.rcrmSizerSE)').remove();
                        elem.find('> .rcrmSizerSE').css({'float' : 'right' ,'margin' : '-6px -4px 0 0' });
                    }
                }
            }
        }

        function rcrmTemplateChangeHandel() {
            Container.find('#rcrm_document_main').removeClass('rcrmEmail_m').attr('temptype' , rcrmOptions.templateType).css('max-width' , '').removeClass('rcrmAutoPage');
            rcrmUpdateIsEmail();
            Container.find('#rcrm_document_content').removeAttr('class');
            Container.find('#rcrm_content').removeClass('rcrmEmail_c');
            Container.find('#rcrm_detail_panel').removeAttr('class');
            Container.find('.rcrmToolButtonContainer').css('display' , '');
            Container.find('.rcrmElementButtonContainer .rcrmElementButtons').css('display' , '');
            Container.find('#rcrm_menu_element_frame').css('display' , '');
            Container.find('#rcrm_menu_element_link').css('display' , '');
            Container.find('#rcrm_menu_element_page_break').css('display' , '');
            Container.find('#rcrm_menu_element_structure').css('display' , '');
            Container.find('#rcrm_document_main').show();
            Container.find('#rcrmEmailTextEditor').remove();
            Container.find('#rcrmSmsEditor').remove();
            rcrmEmailTextEditor = null;
            align = 'right';
            var dir = 'rtl';
            if (rcrmRes.lang == 'en') { align = 'left'; dir = 'ltr' }

            if(rcrmIsFactor) {
                Container.find('#rcrm_document_content').addClass('rcrmDocumentContent').addClass('rcrmFactor');
                Container.find('#rcrm_detail_panel').addClass('rcrmDetailPanel').addClass('rcrmFactor_dp');
                Container.find('#rcrm_menu_toggle_border').show();
                Container.find('#rcrm_menu_toggle_grid').show();
                Container.find('.rcrmLblfontfamily').show();
                Container.find('.rcrmLblfontsize').hide();
                Container.find('#rcrm_menu_element_link').hide();
                Container.find('#rcrm_menu_element_structure').hide();
                rcrmSetContainerHeight();
            }
            else {
                Container.find('#rcrm_document_main').addClass('rcrmEmail_m').css('height', 'auto').attr('format' , 'Own').attr('unit' , 'px').attr('fitpage', false).width(980).addClass('rcrmAutoPage'); //.css('max-width' , '100%')
                Container.find('#rcrm_document_content').addClass('rcrmDocumentContent').addClass('rcrmEmail_p');
                Container.find('#rcrm_content').addClass('rcrmEmail_c');
                Container.find('#rcrm_detail_panel').addClass('rcrmDetailPanel').addClass('rcrmEmail_dp');
                Container.find('#rcrm_content').attr('align', align).css('text-align','') //.css('text-align' ,'-webkit-' + align);
                Container.find('#rcrm_menu_element_frame').hide();
                Container.find('#rcrm_menu_element_page_break').hide();
                Container.find('#rcrm_menu_toggle_border').hide();
                Container.find('#rcrm_menu_toggle_grid').hide();
                Container.find('.rcrmLblfontfamily').hide();
                Container.find('.rcrmLblfontsize').show();
                if (rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText' || rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS'){
                    Container.find('.rcrmToolButtonContainer').hide();
                    Container.find('.rcrmElementButtonContainer .rcrmElementButtons').hide();
                    if (rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText') {
                        rcrmEmailTextEditor = new RaveshUI.Editor({ lang: rcrmRes.lang, width: '100%' ,minHeight: 420 });
                        Container.find('#rcrm_document_main').hide();
                        Container.find('#rcrm_document_panel').append('<div id="rcrmEmailTextEditor" dir="'+ dir +'" style="display: none"></div>');
                        Container.find('#rcrmEmailTextEditor').html(rcrmEmailTextEditor.getUI()).show()
                        Container.find('#rcrmEmailTextEditor .ravesh-editor-content').focus();
                    }
                    if (rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS'){
                        Container.find('#rcrm_document_main').hide();
                        Container.find('#rcrm_document_panel').append('<textarea id="rcrmSmsEditor" placeholder="'+ rcrmRes.start_typing +' ..." style="text-align: '+ align +' ; direction: '+ dir +'" />');
                        Container.find('#rcrmSmsEditor').focus();
                    }
                }
                setTimeout(function () { if(Container.find('#rcrm_document_main').hasClass('rcrmAutoPage')) { rcrmEmailFitPage() }}, 200);
            }
        }

        function rcrmAddDialogParametrs() {
            Container.find('#rcrmParametrs ul[type=EMail_text] li[group=forms], .rcrmDrdForm').remove();
            Container.find('#rcrmParametrs ul[type=EMail_text] div[group=forms]').parents('li').remove();

            $(rcrmOptions.dialogParemetrs.reverse()).each(function () {
                var group = this.group;
                var Items = this.Items.reverse();
                var textItems = $.grep(Items, function (s) { return s.type != 'section' });
                var sectionItems = $.grep(Items, function (s) { return s.type == 'section' });

                $(textItems).each(function () { Container.find('#rcrmParametrs ul[type=EMail_text]').prepend('<li> <div value="'+ this.id.replace(/#/gi, '') +'" class="rcrmPopupItemHeader" group="'+ group +'">'+ this.title +'</div> </li>'); });
                if(textItems.length > 0) Container.find('#rcrmParametrs ul[type=EMail_text]').prepend(' <li class="rcrmPopupItemSeparator rcrmParameterGroup" group="'+ group +'"><div value="" >'+ group +'</div></li>');
                
                $(sectionItems).each(function () { Container.find('#rcrmParametrs ul[type=EMail_table]').prepend('<li> <div value="'+ this.id.replace(/#/gi, '') +'" class="rcrmPopupItemHeader" group="'+ group +'">'+ this.title +'</div> </li>'); });
                if(sectionItems.length > 0) Container.find('#rcrmParametrs ul[type=EMail_table]').prepend(' <li class="rcrmPopupItemSeparator rcrmParameterGroup" group="'+ group +'"><div value="" >'+ group +'</div></li>');
            });
            Container.find('#rcrmParametrs ul[type=EMail_table]').prepend('<li> <div value="empty" class="rcrmPopupItemHeader" group="">'+ rcrmRes.cancel +'</div> </li>');
        }

        $.fn.rcrmMakeAbsolute = function() {
            return $(this.get().reverse()).each(function() {
                var el = $(this);
                var pos = el.position();
                el.css({ position: "absolute", top: pos.top, left: pos.left });
            });
        }

        $.fn.makeCssInline = function(sheet) {
            this.each(function(idx, el) {
                this.style.cssText = css($(el), sheet).toString() + ";" + this.style.cssText;
                $(this).children().makeCssInline(sheet);
            });
        }

        function css(el, sheet) {
            var o = "";
            if(sheet != null && sheet != undefined && sheet.length > 0) {
                var rules = sheet[0].rules || sheet[0].cssRules;
                var result = $.map(rules, function(rule) { if(el.is(rule.selectorText)) return rule.style.cssText });
                o = result.join('');
            }
            return o;
        }

        //undo redo ------------------------------------------------------------------------------------------

        function rcrmChangeHtml() {
            rcrmUndoStack.push(rcrmBeforeHtml);
            if (rcrmUndoStack.length > rcrmStackLength) rcrmUndoStack.shift();
            rcrmSetUndoRedoIcons();
            rcrmBeforeHtml = Container.find('#rcrm_document_panel').html();
        }

        function rcrmSetUndoRedoIcons() {
            if (rcrmUndoStack.length > 0) 
                Container.find('#rcrm_menu_undo').removeClass('ui-button-disabled').attr('disabled', false);
            else
                Container.find('#rcrm_menu_undo').addClass('ui-button-disabled').attr('disabled', true);
            if (rcrmRedoStack.length > 0)
                Container.find('#rcrm_menu_redo').removeClass('ui-button-disabled').attr('disabled', false);
            else
                Container.find('#rcrm_menu_redo').addClass('ui-button-disabled').attr('disabled', true);
        }

        function rcrmRefreshSettingElements() {
            Container.find('#rcrm_detail_panel').empty();
            var elem = Container.find('#rcrm_content').find('.rcrmSelected');
            if(elem.length > 0){
                var elemObj = rcrmFindElementInstance(elem, false);
                if(elemObj != null) {
                    elemObj.appendSetting(Container.find('#rcrm_content').find('.rcrmSelected'));
                    elemObj.updateSetting(Container.find('#rcrm_content').find('.rcrmSelected'));
                } 
            }
            Container.find('#rcrm_menu_toggle_grid').removeClass('rcrmButtonActive');
            if(Container.find('#rcrm_content').hasClass('rcrmDocumentGrid')) Container.find('#rcrm_menu_toggle_grid').addClass('rcrmButtonActive');


            if(Container.find('#rcrm_document_main').hasClass('rcrmDocumentSetting')) {
                var elemObj = rcrmFindElementInstance('#rcrm_document_main', false);
                if (elemObj != null){
                    rcrmRemoveSelected();
                    elemObj.appendSetting(Container.find('#rcrm_document_main'));
                    elemObj.updateSetting(Container.find('#rcrm_document_main'));
                    Container.find('#rcrm_document_main').addClass('rcrmDocumentSetting');
                }
            }

            rcrmSetContainerHeight();
            rcrmSetAllElementBorder()
        }

        //Elemnt Objects -------------------------------------------------------------------------------------

        var rcrmMenuItems = {
            page: { Elem: rcrmPage },
            text: { Elem: rcrmText },
            line: { Elem: rcrmLine },
            image: { Elem: rcrmImage },
            barcode: { Elem: rcrmImage },
            table: { Elem: rcrmTable },
            frame: { Elem: rcrmFrame },
            page_break: { Elem: rcrmPageBreak },
            html: { Elem: rcrmHtml },
            link: { Elem: rcrmText },
            structure1 : { Elem: rcrmTable },
            structure2 : { Elem: rcrmTable },
            structure3 : { Elem: rcrmTable },
            structure4 : { Elem: rcrmTable },
            structure5 : { Elem: rcrmTable },
            structure6 : { Elem: rcrmTable }
        }

        function rcrmPage(id) {
            this.id = id
            this.tempname = new rcrmTemplateName();
            this.temptype = new rcrmTemplateType();
            this.emailtextparent = new rcrmEmailTextParent();
            this.form = new rcrmForm();
            //this.tempstate = new rcrmTemplateStatus(); 
            this.pageformat = new rcrmPageFormat();
            this.pageorientation = new rcrmPageOrientation();
            if(rcrmIsFactor) this.pagezoom = new rcrmPageZoom();
            this.bg_image = new rcrmSelectImage();
            this.bg_repeat = new rcrmBackgroundRepeat();
            this.backgroundcolor = new rcrmBackgroundColor('');
            this.fitpage = new rcrmFitPage();
            this.pointspace = new rcrmPointDistance();
            this.align = new rcrmAlign();
            this.pagemargins = new rcrmPageMargins();
            this.content = new rcrmContent();
            this.cust_group = new rcrmCustomerGroup();
            this.user_group = new rcrmUserGroup();
            

            this.updateSetting = function (elem) {
                this.tempname.update(rcrmOptions.templateName);
                this.temptype.update(rcrmOptions.templateType);
                this.emailtextparent.update(rcrmOptions.emailTextParent);
                this.cust_group.update(rcrmOptions.custGroupId, rcrmOptions.custGroupName); 
                this.form.update(rcrmOptions.custGroupId);
                this.user_group.update(rcrmOptions.userGroupId, rcrmOptions.userGroupName);
                this.pageformat.update(elem.width() , elem.height(), elem.attr('Format'), elem.attr('Unit'));
                this.pageorientation.update(elem.attr('Orientation'));
                this.bg_image.update(elem.find('#rcrm_document_content').attr('bg_filename'));
                this.bg_repeat.update(elem.find('#rcrm_document_content').attr('bg_position'), elem.find('#rcrm_document_content').attr('bg_repeat'));
                this.backgroundcolor.update(elem.find('#rcrm_document_content').css('background-color'));
                var sw = this;
                setTimeout(function () { sw.fitpage.update(elem.attr('fitpage'))}, 50 , sw);
                this.pointspace.update(elem.find('#rcrm_content').css('background-size'));
                var marginElem = elem.find('#rcrm_document_content');
                this.pagemargins.update(Number(marginElem.css('left').replace('px' , '')) + 1, Number(marginElem.css('top').replace('px' , '')) + 1, marginElem.css('right').replace('px' , ''), marginElem.css('bottom').replace('px' , ''));
                this.align.update(elem.find('#rcrm_content').attr('align') /*.css('text-align')*/ , elem.find('#rcrm_content').css('vertical-align'));
                this.content.update('');
            }
            this.appendSetting = function () {
                Container.find('#rcrm_detail_panel').append(this.tempname.clone());
                Container.find('#rcrm_detail_panel').append(this.temptype.clone());
                Container.find('#rcrm_detail_panel').append(this.emailtextparent.clone());
                Container.find('#rcrm_detail_panel').append(this.form.clone());
                Container.find('#rcrm_detail_panel').append(this.pageformat.clone());
                Container.find('#rcrm_detail_panel').append(this.pageorientation.clone());
                if(rcrmIsFactor) Container.find('#rcrm_detail_panel').append(this.pagezoom.clone());
                Container.find('#rcrm_detail_panel').append(this.fitpage.clone());
                if(!rcrmIsEmail) Container.find('#rcrm_detail_panel').append(this.backgroundcolor.clone());
                Container.find('#rcrm_detail_panel').append(this.user_group.clone());
                Container.find('#rcrm_detail_panel').append(this.cust_group.clone());
                Container.find('#rcrm_detail_panel').append(this.align.clone());
                Container.find('#rcrm_detail_panel').append(this.content.clone());
                if(rcrmIsEmail) Container.find('#rcrm_detail_panel').append(this.backgroundcolor.clone());
                Container.find('#rcrm_detail_panel').append(this.bg_image.clone());
                Container.find('#rcrm_detail_panel').append(this.bg_repeat.clone());
                Container.find('#rcrm_detail_panel').append(this.pointspace.clone());
                Container.find('#rcrm_detail_panel').append(this.pagemargins.clone());
            }
        }

        function rcrmText(id, type) {
            this.id = id
            this.content = new rcrmContent();
            if(type == 'link') this.link = new rcrmLink();
            this.position = new rcrmPosition();
            this.size = new rcrmSize();
            this.col_order = new rcrmColOrder();
            this.textstyle = new rcrmTextStyle();
            this.textalign = new rcrmTextAlign();
            this.align = new rcrmAlign();
            this.textcolor = new rcrmTextColor();
            this.backgroundcolor = new rcrmBackgroundColor('> .rcrmContentContainerHelper > .rcrmDocElementContentText');
            this.font = new rcrmFont();
            this.bg_image = new rcrmSelectImage();
            this.bg_repeat = new rcrmBackgroundRepeat();
            this.border = new rcrmBorder();
            this.bordercolor_style = new rcrmBorderColor_Style();
            this.borderwidth = new rcrmBorderWidth();
            this.borderradius = new rcrmBorderRadius();
            this.linespace = new rcrmLineSpacing();
            this.direction = new rcrmDirection();
            this.padding = new rcrmPadding();
            if(rcrmIsEmail) this.max_min_width = new rcrmMaxMinWidth();
            if(rcrmIsEmail) this.margin = new rcrmMargin();
            this.rotate = new rcrmRotate();
            this.colrowspan = new rcrmColumnRowSpan();
            this.display_type = new rcrmDisplayType();
            if(type != 'link') this.repeated_display_type = new rcrmRepeatedDisplayType();
            //this.custom_css = new rcrmCustomCss();

            
            this.clone = function () {
                if(type == 'link') {
                    var elem = Container.find('#rcrmElementCloneArea').find('.rcrmTextElement').clone();
                    elem.width(110).height(26).addClass('rcrmLinkElement').attr('type', 'link').attr('linkType' , 'button').find('.rcrmDocElementContentText').replaceWith('<a class="rcrmDocElementContentText" href="" target="_blank" style="position:unset;left:unset;top:unset">'+ rcrmRes.button +'</a>');
                    return elem;
                }
                else return Container.find('#rcrmElementCloneArea').find('.rcrmTextElement').attr('type', 'text').clone();
            }
            this.updateSetting = function (elem) {
                var hcontainer = elem.find('> .rcrmContentContainerHelper');
                var hcontent = hcontainer.find('> .rcrmDocElementContentText');
                if(rcrmIsEmail && elem.hasClass('rcrmTableTextElement') && hcontent.find('.rcrmDocElement').length > 0) {
                    var text = hcontent.contents().filter(function() { return this.nodeType === 3 });
                    if(text.length > 0) this.content.update(text[0].data);
                }
                else this.content.update(hcontent.text());
                if(type == 'link') this.link.update(elem.find('a').attr('href'), elem.attr('linkType'));
                if(elem.hasClass('rcrmTextElement')) {
                    this.position.update(elem.position().left, elem.position().top, elem.attr('pos'));
                    var width = elem.width();
                    if(rcrmIsEmail) width = elem.outerWidth();
                    var height = elem.height();
                    if(elem[0].style.height == '') height = hcontainer.height();
                    if(elem.attr('widthType') == 'auto') width = 0;
                    if(elem.attr('heightType') == 'auto') height = 0
                    this.size.update(width, height);
                }
                else {
                    var height = elem.outerHeight()
                    if(elem.attr('heighttype') == 'auto') height = 0;
                    this.size.update(elem.outerWidth(), height);
                }
                this.col_order.update(elem.index() + 1);
                this.textstyle.update(hcontent.css('font-weight') , hcontent.css('font-style'), hcontent.css('text-decoration'));
                this.textalign.update(hcontent.css('text-align') , hcontent.css('vertical-align'));
                this.textcolor.update(hcontent.css('color'));
                this.font.update(hcontent.css('font-family'), hcontent.css('font-size'));
                if(elem.hasClass('rcrmTextElement')){
                    this.border.update(hcontainer.css('border-left-style') , hcontainer.css('border-top-style'), hcontainer.css('border-right-style'),hcontainer.css('border-bottom-style'));
                    this.bordercolor_style.update(hcontainer.css('border-color'), elem.attr('borderstyle'));
                    this.borderwidth.update(hcontainer.css('border-width'))
                    this.borderradius.update(hcontainer.css('border-radius'));
                    this.backgroundcolor.update(hcontent.css('background-color'));
                    this.bg_image.update(hcontent.attr('bg_filename'));
                    this.bg_repeat.update(hcontent.attr('bg_position'), hcontent.attr('bg_repeat'));
                    if(rcrmIsEmail) this.margin.update(elem.css('margin-left'),elem.css('margin-top'),elem.css('margin-right'),elem.css('margin-bottom'));
                    if(rcrmIsEmail) this.max_min_width.update(elem.attr('max-width'), elem.attr('min-width'));
                    if(rcrmIsEmail && elem.hasClass('rcrmLinkElement')) this.display_type.update(elem.css('display'));
                    if(rcrmIsEmail && rcrmOptions.openDialog == true && type != 'link') this.repeated_display_type.update(elem.attr('display_way'));
                }
                if(elem.hasClass('rcrmTableTextElement')){
                    this.colrowspan.update(elem.attr('colspan'), elem.attr('rowspan'));
                    if(hcontent.find('.rcrmHolder').length > 0) this.content.update('');
                    var selector = hcontent;
                    if(rcrmIsEmail) selector = elem;
                    this.backgroundcolor.update(selector.css('background-color'));
                    this.bg_image.update(selector.attr('bg_filename'));
                    this.bg_repeat.update(selector.attr('bg_position'), selector.attr('bg_repeat'));
                }
                try {this.linespace.update(hcontent[0].style['line-height']) } catch (e) {};
                try {this.direction.update(hcontent[0].style['direction']) } catch (e) {};
                this.padding.update(hcontent.css('padding-left'),hcontent.css('padding-top'),hcontent.css('padding-right'),hcontent.css('padding-bottom'));
                if(elem.find('.rcrmRotate').length > 0) this.rotate.update(elem.find('.rcrmRotate')[0].style.transform); else this.rotate.update(0);
                if(elem.hasClass('rcrmTextElement')) this.align.update(hcontent.css('text-align') , null); else this.align.update(hcontent.attr('align'), null); 
            }
            this.appendSetting = function (elem) {
                Container.find('#rcrm_detail_panel').append(this.content.clone());
                if(type == 'link') Container.find('#rcrm_detail_panel').append(this.link.clone());
                if(elem.hasClass('rcrmTextElement')) Container.find('#rcrm_detail_panel').append(this.position.clone());
                Container.find('#rcrm_detail_panel').append(this.size.clone());
                if(rcrmIsEmail && rcrmOptions.openDialog == true && elem.hasClass('rcrmTextElement') && type != 'link')
                Container.find('#rcrm_detail_panel').append(this.repeated_display_type.clone());
                Container.find('#rcrm_detail_panel').append(this.col_order.clone());
                Container.find('#rcrm_detail_panel').append(this.textstyle.clone());
                Container.find('#rcrm_detail_panel').append(this.align.clone());
                Container.find('#rcrm_detail_panel').append(this.textalign.clone());
                Container.find('#rcrm_detail_panel').append(this.textcolor.clone());
                Container.find('#rcrm_detail_panel').append(this.backgroundcolor.clone());
                Container.find('#rcrm_detail_panel').append(this.font.clone());
                Container.find('#rcrm_detail_panel').append(this.bg_image.clone());
                Container.find('#rcrm_detail_panel').append(this.bg_repeat.clone());
                if(elem.hasClass('rcrmTextElement')){
                    Container.find('#rcrm_detail_panel').append(this.border.clone());
                    Container.find('#rcrm_detail_panel').append(this.bordercolor_style.clone());
                    Container.find('#rcrm_detail_panel').append(this.borderwidth.clone());
                    Container.find('#rcrm_detail_panel').append(this.borderradius.clone());
                    Container.find('#rcrm_detail_panel').append(this.rotate.clone());
                }
                Container.find('#rcrm_detail_panel').append(this.linespace.clone());
                Container.find('#rcrm_detail_panel').append(this.direction.clone());
                if(rcrmIsEmail && elem.hasClass('rcrmLinkElement')) Container.find('#rcrm_detail_panel').append(this.display_type.clone());
                if(rcrmIsEmail && elem.hasClass('rcrmTextElement')) Container.find('#rcrm_detail_panel').append(this.max_min_width.clone());
                Container.find('#rcrm_detail_panel').append(this.padding.clone());
                if(rcrmIsEmail && elem.hasClass('rcrmTextElement')) Container.find('#rcrm_detail_panel').append(this.margin.clone());
                if(elem.hasClass('rcrmTableTextElement') && !elem.parents('tr').first().parent().is('thead')) Container.find('#rcrm_detail_panel').append(this.colrowspan.clone()); //elem.parents('thead').length == 0
                if(elem.hasClass('rcrmTableTextElement') && !elem.parents('tr').first().parent().is('tbody')) Container.find('#rcrm_detail_panel').append(this.rotate.clone()); //elem.parents('tbody').length == 0
                //if(elem.hasClass('rcrmTableTextElement')) Container.find('#rcrm_detail_panel').append(this.custom_css.clone(elem));
            }
            this.updateInternalSize = function (Elem) {
                var hcontainer = Elem.find('> .rcrmContentContainerHelper');
                var content = hcontainer.find('> .rcrmDocElementContentText');
                var paddingLeft = Number(content.css('padding-left').replace('px', ''));
                var paddingTop = Number(content.css('padding-top').replace('px', ''));
                var paddingRight = Number(content.css('padding-right').replace('px', ''));
                var paddingBottom = Number(content.css('padding-bottom').replace('px', ''));
                var borderLeft = Number(hcontainer.css('border-left-width').replace('px', ''));
                var borderTop = Number(hcontainer.css('border-top-width').replace('px', ''));
                var borderRight = Number(hcontainer.css('border-right-width').replace('px', ''));
                var borderBottom = Number(hcontainer.css('border-bottom-width').replace('px', ''));

                var width = Elem.outerWidth() - (paddingLeft + borderLeft + paddingRight + borderRight);
                var height = Elem.outerHeight() - (paddingTop + borderTop + paddingBottom + borderBottom);
                if(Elem.hasClass('rcrmTableTextElement')){
                    width = Elem[0].offsetWidth - (paddingLeft + borderLeft + paddingRight + borderRight);
                    height = Elem[0].offsetHeight - (paddingTop + borderTop + paddingBottom + borderBottom);
                    Elem.parents('.rcrmTableElement').first().find('> table > * > tr > .rcrmTableTextElement').removeAttr('cellPercentWidth');
                }

                content.width(width < 0 ? 0 : width);
                if(rcrmIsFactor) content.height(height < 0 ? 0 : height);
                else {hcontainer.height('100%'); content.height(hcontainer.height() - (paddingTop + paddingBottom)); hcontainer.height('') };

                if(Elem.hasClass('rcrmTextElement')){

                    if(Elem.hasClass('rcrmBorderLess')) Elem.height('');

                    if(Elem.attr('widthType') == 'auto'){
                        try {
                            if(rcrmRes.lang == 'fa') {
                                var right = Elem.parent().width() - (Elem.position().left + Elem.outerWidth(true));
                                if(right < 0) right = 0;
                                Elem.css('right', right + 'px');
                                Elem.css('left', '');
                                Elem.parent().css('direction' , 'rtl');
                            };
                        } catch (e) {}
                        content.width('auto');
                        if(Elem.find('.rcrmRotate').length > 0) {
                            var rect = Elem.find('.rcrmRotate')[0].getBoundingClientRect();
                            content.width(rect.width)
                        }
                        hcontainer.css('display', 'inline-block')
                        Elem.width(hcontainer.width() + (borderLeft + borderRight) - 2);
                        try {if(rcrmRes.lang == 'fa') { Elem.css('left', Elem.position().left); Elem.css('right', ''); Elem.parent().css('direction' , '') } } catch (e) {}
                    }
                    if(Elem.attr('heightType') == 'auto'){
                        content.height('auto');
                        if(Elem.find('.rcrmRotate').length > 0) {
                            var rect = Elem.find('.rcrmRotate')[0].getBoundingClientRect();
                            content.height(rect.height)
                        }
                        Elem.height(hcontainer.height() + (borderTop + borderBottom) - 2);
                    }
                }
            }
        }

        function rcrmLine(id) {
            this.id = id
            this.position = new rcrmPosition();
            this.size = new rcrmSize();
            this.backgroundcolor = new rcrmBackgroundColor(''); 
            if(rcrmIsEmail) this.max_min_width = new rcrmMaxMinWidth();
            if(rcrmIsEmail) this.margin = new rcrmMargin();

            this.clone = function () {
                return Container.find('#rcrmElementCloneArea').find('.rcrmLineElement').attr('type', 'line').clone();
            }
            this.updateSetting = function (elem) {
                this.position.update(elem.position().left, elem.position().top, elem.attr('pos'));
                this.size.update(elem.width(), elem.height());
                this.backgroundcolor.update(elem.css('background-color'));
                if(rcrmIsEmail) this.margin.update(elem.css('margin-left'),elem.css('margin-top'),elem.css('margin-right'),elem.css('margin-bottom'));
                if(rcrmIsEmail) this.max_min_width.update(elem.attr('max-width'), elem.attr('min-width'));
            }
            this.appendSetting = function () {
                Container.find('#rcrm_detail_panel').append(this.position.clone());
                Container.find('#rcrm_detail_panel').append(this.size.clone());
                if(rcrmIsEmail) Container.find('#rcrm_detail_panel').append(this.max_min_width.clone());
                Container.find('#rcrm_detail_panel').append(this.backgroundcolor.clone());
                if(rcrmIsEmail) Container.find('#rcrm_detail_panel').append(this.margin.clone());
            }
        }

        function rcrmImage(id, type) {
            this.id = id
            this.content = new rcrmContent();
            if(type == 'image') this.src = new rcrmSelectImage();
            this.position = new rcrmPosition();
            this.size = new rcrmSize();
            this.textalign = new rcrmTextAlign();
            this.backgroundcolor = new rcrmBackgroundColor('> .rcrmContentContainerHelper');
            this.align = new rcrmAlign();
            if(type == 'image') this.borderradius = new rcrmBorderRadius();
            if(rcrmIsEmail) { this.padding = new rcrmPadding(); this.margin = new rcrmMargin(); this.max_min_width = new rcrmMaxMinWidth(); }
            if(type == 'barcode') this.barcode_type = new rcrmBarcodeType();
            

            this.clone = function () {
                var imgelem = Container.find('#rcrmElementCloneArea').find('.rcrmImageElement').attr('type', 'image').clone();
                if(type == 'barcode') {
                    imgelem.addClass('rcrmBarcodeElement').attr('type', 'barcode').find('img').attr('src' , resources.host_name + '/pages/getFile.aspx?mode=qrcode&width=200&height=200&data=');
                    if(rcrmIsEmail) imgelem.find('> .rcrmContentContainerHelper').attr('align', 'center').css('text-align',''); //.css('text-align', '-webkit-center');
                    else imgelem.find('> .rcrmContentContainerHelper').removeAttr('align').css('text-align','center'); 
                }
                else{
                    if(rcrmIsEmail) imgelem.find('> .rcrmContentContainerHelper').attr('align', 'left').css('text-align','');
                    else imgelem.find('> .rcrmContentContainerHelper').removeAttr('align').css('text-align','left'); 
                }
                var imgobj = this
                $(imgelem).find('img').load(function () {
                    imgobj.updateDisplayInternal($(imgelem), $(this));
                    rcrmChangeHtml();
                });
                return imgelem;
            }
            this.updateSetting = function (elem) {
                var img = elem.find('img');
                this.content.update(img.attr('source'));
                if(type == 'image') this.src.update(img.attr('FileName'));
                this.position.update(elem.position().left, elem.position().top, elem.attr('pos'));
                var width = elem.width();
                if(rcrmIsEmail) width = elem.outerWidth();
                this.size.update(width, elem.height());
                var effectArea = '> .rcrmContentContainerHelper > .rcrmDocElementContentText';
                if(elem.hasClass('rcrmImageElement')) effectArea = '> .rcrmContentContainerHelper';
                this.textalign.update(elem.find(effectArea).css('text-align') , elem.find(effectArea).css('vertical-align'), elem.find('> .rcrmContentContainerHelper').attr('bg_repeat'));
                this.backgroundcolor.update(elem.find('> .rcrmContentContainerHelper').css('background-color'));
                this.align.update(elem.find(effectArea).attr('align') /*.css('text-align')*/ , null, elem.find('> .rcrmContentContainerHelper').attr('bg_repeat')); 
                if(type == 'image') this.borderradius.update(img.css('border-radius'));
                if(type == 'barcode') this.barcode_type.update(elem.attr('barcode_type'));
                if(rcrmIsEmail) { 
                    this.padding.update(img.css('margin-left'),img.css('margin-top'),img.css('margin-right'),img.css('margin-bottom'));
                    this.margin.update(elem.css('margin-left'),elem.css('margin-top'),elem.css('margin-right'),elem.css('margin-bottom'));
                    this.max_min_width.update(elem.attr('max-width'), elem.attr('min-width'));
                }
            }
            this.updateDisplayInternal = function (imgContainer ,img) {
                if (imgContainer !== null && img !== null) {
                    var imageRatio = 0;
                    var width = imgContainer.width();
                    var height = imgContainer.height();

                    if(rcrmIsEmail){
                        var paddingLeft = Number(img.css('margin-left').replace('px', ''));
                        var paddingTop = Number(img.css('margin-top').replace('px', ''));
                        var paddingRight = Number(img.css('margin-right').replace('px', ''));
                        var paddingBottom = Number(img.css('margin-bottom').replace('px', ''));
                        width = imgContainer.width() - (paddingLeft + paddingRight);
                        height = imgContainer.height() - (paddingTop + paddingBottom);
                    }
                    
                    //===============================================
                    img.width(img.get(0).naturalWidth);
                    img.height(img.get(0).naturalHeight);
                    if (img.height() !== 0) imageRatio = img.width() / img.height();
                    var imageWidth = img.width();
                    var imageHeight= img.height();
                    //----------------------------------------------------------------------
                    var imgWidth = 0;
                    var imgHeight = 0;
                    if (imageRatio !== 0) {
                        imgWidth = imageWidth < width ? imageWidth : width;
                        imgHeight = imageHeight < height ? imageHeight : height;
                        if (imgWidth !== imageWidth || imgHeight !== imageHeight) {
                            var scaledWidth = Math.floor(imgHeight * imageRatio);
                            if (scaledWidth < width) {
                                imgWidth = scaledWidth;
                            } else {
                                imgHeight = Math.floor(imgWidth / imageRatio);
                            }
                        }
                    }
                    $(img).width(imgWidth).height(imgHeight);
                }
            }
            this.appendSetting = function () {
                Container.find('#rcrm_detail_panel').append(this.content.clone());
                if(type == 'barcode') Container.find('#rcrm_detail_panel').append(this.barcode_type.clone());
                if(type == 'image') Container.find('#rcrm_detail_panel').append(this.src.clone());
                Container.find('#rcrm_detail_panel').append(this.position.clone());
                if(rcrmIsFactor) Container.find('#rcrm_detail_panel').append(this.size.clone());
                if(rcrmIsFactor && type == 'image') Container.find('#rcrm_detail_panel').append(this.borderradius.clone());
                Container.find('#rcrm_detail_panel').append(this.textalign.clone());
                Container.find('#rcrm_detail_panel').append(this.backgroundcolor.clone());
                Container.find('#rcrm_detail_panel').append(this.align.clone());
                if(rcrmIsEmail) Container.find('#rcrm_detail_panel').append(this.size.clone());
                if(rcrmIsEmail) Container.find('#rcrm_detail_panel').append(this.max_min_width.clone());
                if(rcrmIsEmail && type == 'image') Container.find('#rcrm_detail_panel').append(this.borderradius.clone());
                if(rcrmIsEmail) Container.find('#rcrm_detail_panel').append(this.padding.clone());
                if(rcrmIsEmail) Container.find('#rcrm_detail_panel').append(this.margin.clone());
            }
        }

        function rcrmTable(id, type) {
            this.id = id
            if(rcrmIsEmail && rcrmOptions.openDialog == true && (type == 'table' || type == 'structure1')) this.content = new rcrmContent();
            this.position = new rcrmPosition();
            this.size = new rcrmSize();
            this.tabletype = new rcrmTableType();
            if(type == 'table') this.columns = new rcrmTableColumns();
            this.header = new rcrmTableHeader();
            this.footer = new rcrmTableFooter();
            this.head_color = new rcrmHeaderColor();
            if(type == 'table') this.odd_color = new rcrmOddRowColor();
            if(type == 'table') this.even_color = new rcrmEvenRowColor();
            if(type == 'table') this.border = new rcrmTableBorder();
            if(type == 'table') this.border_color = new rcrmBorderColor_Style();
            this.border_width = new rcrmBorderWidth();
            this.custom_css = new rcrmCustomCss();
            if(type == 'table') this.equal_col = new rcrmEqualCol();
            if(type == 'table') this.grow_byaddcol = new rcrmGrowByAddCol();
            if(type == 'table' && rcrmIsFactor) this.show_header_eachpage = new rcrmShowHeaderEachPage();
            if(rcrmIsEmail) {
                if(type != 'table') this.display_type = new rcrmDisplayType(); 
                this.margin = new rcrmMargin();
                this.max_min_width = new rcrmMaxMinWidth();
            }


            this.clone = function () {

                var tbl = Container.find('#rcrmElementCloneArea').find('.rcrmTableElement').attr('type', 'table').clone();
                                
                if(type == 'structure1' || type == 'structure2' || type == 'structure3' || type == 'structure4' || type == 'structure5' || type == 'structure6') {
                    tbl = Container.find('#rcrmElementCloneArea').find('.rcrmTableElement').clone();
                    tbl.removeClass('rcrmStructElement').addClass('rcrmStructElement').removeClass('rcrm'+ type +'Element').addClass('rcrm'+ type +'Element').attr('type', type).css('display' , 'block').find('> table > tbody').remove();
                    tbl.find('> table > tfoot').remove();
                    tbl.find('> table > thead > tr > td').height('79px');
                    tbl.find('> table > thead > tr > td:last').remove();
                    //border -------------------------------------------------------------
                    tbl.removeClass('rcrmBorderTableGrid rcrmBorderTableFrameRow  rcrmBorderTableFrame rcrmBorderTableRow rcrmBorderTableNone rcrmBorderTableFrameLeft rcrmBorderTableFrameRight rcrmBorderTableFrameTop rcrmBorderTableFrameBottom');
                    tbl.addClass('rcrmBorderTableNone');
                    tbl.find('> table').css('border-style' , 'none');
                    tbl.find('> table > thead > .rcrmTableBandElement').css('border-style' , 'none');
                    tbl.find('> table > thead > tr > .rcrmTableTextElement').css('border-style' , 'none');
                }
             
                var tblObj = this;
                tbl.find('> table > * > tr > .rcrmTableTextElement').unbind('dblclick');
                tbl.find('> table > * > tr > .rcrmTableTextElement').bind('dblclick' , function (e) {
                    var elem = $(e.target);
                    if(!elem.hasClass('rcrmTableTextElement')) elem = elem.parents('.rcrmTableTextElement').first();
                    tblObj.celldblclick(elem);
                });

                if(rcrmIsEmail) tbl.find('> table > * > tr > td > .rcrmContentContainerHelper > .rcrmDocElementContentText').attr('align', 'right');

                return tbl;
            }
            this.updateSetting = function (elem) {
                if(rcrmIsEmail && rcrmOptions.openDialog == true && (type == 'table' || type == 'structure1')) this.content.update(elem.attr('sectiontitle'));
                this.position.update(elem.position().left, elem.position().top, elem.attr('pos'));
                this.size.update(elem.outerWidth(), null);
                this.tabletype.update(elem.attr('tabletype'));
                if(type == 'table') this.columns.update(elem.find('> table > tbody > tr:first > td').length, elem.find('> table > * > tr:not(:hidden)').length);
                this.header.update(!elem.find('thead').find('.rcrmTableBandElement').hasClass('rcrmHidden'));
                this.footer.update(!elem.find('tfoot').find('.rcrmTableBandElement').hasClass('rcrmHidden'));
                this.head_color.update(elem.find('> table > thead > tr:first').css('background-color')); //elem.attr('head-color')
                if(type == 'table') this.odd_color.update(elem.attr('odd-color'));
                if(type == 'table') this.even_color.update(elem.attr('even-color'));
                var hcontainer = elem.find('> table > tbody > tr > td > .rcrmContentContainerHelper');
                if(type == 'table') this.border.update(hcontainer.css('border-left-style') , hcontainer.css('border-top-style'), hcontainer.css('border-right-style'), hcontainer.css('border-bottom-style'));
                if(type == 'table') this.border_color.update(elem.find('> table').css('border-color'), null);
                this.border_width.update(elem.find('> table').attr('borderwidth'));
                this.custom_css.update(elem.find('> table').attr('style'));
                if(type == 'table') this.grow_byaddcol.update(elem.attr('rcrmFixedTable'));
                if(type == 'table' && rcrmIsFactor) this.show_header_eachpage.update(elem.attr('rcrmshow_eachpage'));
                if(type != 'table') this.display_type.update(elem.css('display'));
                if(rcrmIsEmail) this.margin.update(elem.css('margin-left'),elem.css('margin-top'),elem.css('margin-right'),elem.css('margin-bottom'));
                if(rcrmIsEmail) this.max_min_width.update(elem.attr('max-width'), elem.attr('min-width'));
            }
            this.appendSetting = function (elem) {
                if(rcrmIsEmail && rcrmOptions.openDialog == true && (type == 'table' || type == 'structure1')) Container.find('#rcrm_detail_panel').append(this.content.clone());
                Container.find('#rcrm_detail_panel').append(this.position.clone());
                Container.find('#rcrm_detail_panel').append(this.tabletype.clone());
                if(type == 'table') Container.find('#rcrm_detail_panel').append(this.columns.clone());
                Container.find('#rcrm_detail_panel').append(this.size.clone());
                Container.find('#rcrm_detail_panel').append(this.footer.clone());
                if(type == 'table' && rcrmIsFactor) Container.find('#rcrm_detail_panel').append(this.show_header_eachpage.clone());
                if(type == 'table') {
                    Container.find('#rcrm_detail_panel').append(this.border.clone());
                    Container.find('#rcrm_detail_panel').append(this.border_color.clone());
                    Container.find('#rcrm_detail_panel').append(this.head_color.clone());
                    Container.find('#rcrm_detail_panel').append(this.odd_color.clone());
                    Container.find('#rcrm_detail_panel').append(this.even_color.clone());
                }
                Container.find('#rcrm_detail_panel').append(this.custom_css.clone(elem.find('> table')));
                if(type != 'table') Container.find('#rcrm_detail_panel').append(this.display_type.clone());
                if(rcrmIsEmail) Container.find('#rcrm_detail_panel').append(this.max_min_width.clone());
                if(rcrmIsEmail) Container.find('#rcrm_detail_panel').append(this.margin.clone());
                if(type == 'table') { Container.find('#rcrm_detail_panel').append(this.equal_col.clone()); Container.find('#rcrm_detail_panel').append(this.grow_byaddcol.clone()); }
                
            }
            this.updateInternalSize = function (tableElem, removeAttr) {

                $(tableElem).find('> table > * > tr > .rcrmTableTextElement').each(function () {
                    var Elem = $(this);
                    //Elem.parents('.rcrmTableElement').width('')
                    var hcontainer = Elem.find('> .rcrmContentContainerHelper');
                    var hcontent = hcontainer.find('> .rcrmDocElementContentText');
                    var paddingLeft = Number(hcontent.css('padding-left').replace('px', ''));
                    var paddingTop = Number(hcontent.css('padding-top').replace('px', ''));
                    var paddingRight = Number(hcontent.css('padding-right').replace('px', ''));
                    var paddingBottom = Number(hcontent.css('padding-bottom').replace('px', ''));
                    var borderLeft = Number(hcontainer.css('border-left-width').replace('px', ''));
                    var borderTop = Number(hcontainer.css('border-top-width').replace('px', ''));
                    var borderRight = Number(hcontainer.css('border-right-width').replace('px', ''));
                    var borderBottom = Number(hcontainer.css('border-bottom-width').replace('px', ''));
                    var width =  Elem[0].offsetWidth - (paddingLeft + borderLeft + paddingRight + borderRight);
                    var height = Elem[0].offsetHeight - (paddingTop + borderTop + paddingBottom + borderBottom);

                    hcontent.width(width < 0 ? 0 : width);
                    if(rcrmIsFactor) hcontent.height(height < 0 ? 0 : height);
                    else { hcontainer.height('100%'); hcontent.height(hcontainer.height() - (paddingTop + paddingBottom)); hcontainer.height('') };
                    Elem.width(Elem[0].clientWidth);
                    Elem.parents('.rcrmTableElement').first().width(Elem.parents('table').first().outerWidth(true)); //Elem.parents('.rcrmTableElement').width('');
                    if(rcrmIsFactor) Elem.parents('.rcrmTableElement').first().height(Elem.parents('table').first()[0].clientHeight);
                    else $(tableElem).height('');
                    if(removeAttr == undefined) Elem.removeAttr('cellPercentWidth');
                    
                    if(rcrmIsEmail) {hcontent.css('min-height', '') };
                    if(Elem.attr('heightType') == 'auto') {
                        hcontent.css('min-height' , '15px');
                        hcontent.height('auto').css('position', 'unset');
                        hcontainer.height('auto').css('position', 'unset');
                        Elem.height('');
                        $(tableElem).height('');
                    }
                });

                $(tableElem).find('> table > * > tr > .rcrmTableTextElement[heightType=auto]').each(function () {
                    var hcontainer = $(this).find('> .rcrmContentContainerHelper');
                    var hcontent = hcontainer.find('> .rcrmDocElementContentText');
                    hcontainer.height('100%');
                    hcontent.css('min-height', hcontainer.height() - (Number(hcontent.css('padding-top').replace('px', '')) + Number(hcontent.css('padding-bottom').replace('px', ''))));
                    hcontainer.height('auto') 
                });
            }
            this.celldblclick = function (cell) {
                $(cell).attr('type', 'text');
                if($(cell).attr('id') == ""){
                    rcrmIdpointer++;
                    var id = 'rcrm_el' + rcrmIdpointer;
                    $(cell).attr('id', id);
                }
                rcrmAddSelected($(cell));

                var cellObj = rcrmFindElementInstance($(cell), false);
                var tblDiv = $(cell).parents('.rcrmTableElement').first();
                var tbl = tblDiv.find('> table');
                var tblObj = rcrmFindElementInstance(tblDiv, false);
                var bw = 1;
                //if(tblDiv.hasClass('rcrmBorderTableRow') || tblDiv.hasClass('rcrmBorderTableNone')) bw = 0;
                if(tblDiv.attr('rcrmFixedTable') == undefined) tblDiv.attr('rcrmFixedTable', false);
                var fix = tblDiv.attr('rcrmFixedTable') == 'true'; //rcrmIsEmail && 


                $(cell).resizable({
                    handles: {
                        'e': '> .rcrmSizerE',
                        'w': '> .rcrmSizerW',
                        's': '> .rcrmSizerS'
                    },
                    start:function (e) {
                        var dir = e.toElement ? e.toElement : e.originalEvent.target;
                        if(fix) {
                            if($(this).next('td').length > 0) tbl.find('> * > tr > td:nth-child('+ ($(this).next('td').index() + 1) +')').width('');
                            else tbl.find('> * > tr > td:nth-child('+ $(this).index() +')').width('');
                        }
                        else
                        {
                            if(!$(dir).hasClass('rcrmSizerS') || rcrmIsFactor) tbl.width(0);
                            try { $(cell).parents('tr').first().find('> .rcrmTableTextElement > .rcrmContentContainerHelper > .rcrmDocElementContentText').height(''); } catch (e) {}
                            if(rcrmRes.lang == 'fa' && tblDiv.css('display') != 'inline-block'){
                                if(rcrmIsFactor){
                                    var right = tblDiv.parent().width() - (tblDiv.position().left + tblDiv.outerWidth(true));
                                    if(right < 0) right = 0;
                                    tblDiv.css('right', right + 'px');
                                    tblDiv.css('left', '');
                                };
                                Container.find('#rcrm_content').css('direction' , 'rtl');
                            }
                        }
                        if($(cell).attr('heighttype') == 'auto'){
                            if(!$(dir).hasClass('rcrmSizerE') && !$(dir).hasClass('rcrmSizerW')) {
                                $(cell).parents('tr').first().find('> .rcrmTableTextElement').attr('heighttype', '').find('> .rcrmContentContainerHelper').css('position', '').find('> .rcrmDocElementContentText').css('min-height', '');
                                tblObj.updateInternalSize(tblDiv) 
                            }
                        }
                    },
                    resize:function (e, ui) {
                        var wDif = ui.size.width - $(cell).width();
                        var hDiff = ui.size.height - $(cell)[0].offsetHeight + 1;
                        //-----------------------------------------------------------
                            //tbl.width(tbl.width() + wDif + bw);
                            $(cell).width(ui.size.width + bw); //- wbw //dj
                        //-----------------------------------------------------------
                            var rowtd = $(cell).parents('tr').first().find('> td');
                            rowtd.height(rowtd[0].offsetHeight + hDiff); //- hbw //dj
                        //-----------------------------------------------------------
                        $(cell).css({"left": '0px', "top": '0px'});
                        try { tblDiv.find('.rcrmHolder').hide() } catch (e) {}
                        if(fix) tbl.find('> * > tr > .rcrmTableTextElement').each(function () { 
                            if(rcrmRes.lang == 'fa' && ($(this).offset().left + $(this).width() < tbl.find('> thead > tr > .rcrmTableTextElement:last').offset().left)  && !$(this).parent().parent().is('thead') && $(this).parent().is(':visible') && $(this).parent().parent().is(':visible')) $(this).removeClass('rcrmMergedTD').addClass('rcrmMergedTD');
                            else if(rcrmRes.lang == 'en' && ($(this).offset().left > tbl.find('> thead > tr > .rcrmTableTextElement:last').offset().left)  && !$(this).parent().parent().is('thead') && $(this).parent().is(':visible') && $(this).parent().parent().is(':visible')) $(this).removeClass('rcrmMergedTD').addClass('rcrmMergedTD')
                        });
                    },
                    stop: function (e, sui) {
                        tbl.width(tbl.outerWidth());
                        tblObj.updateInternalSize(tblDiv);
                        cellObj.updateSetting($(cell));
                        if(rcrmRes.lang == 'fa' && tblDiv.css('display') != 'inline-block'){
                            if(rcrmIsFactor){ 
                                tblDiv.css('left', tblDiv.position().left); tblDiv.css('right', '');
                            }
                            else tblDiv.css('right', 'unset').css('left', 'unset');
                            Container.find('#rcrm_content').css('direction' , '');
                        }
                        try { tblDiv.find('.rcrmHolder').hide() } catch (e) {}
                        if(rcrmIsEmail) rcrmSetContainerHeight();
                        rcrmChangeHtml();
                    }
                });
            }
        }

        function rcrmFrame(id) {
            this.id = id
            this.position = new rcrmPosition();
            this.size = new rcrmSize();
            this.backgroundcolor = new rcrmBackgroundColor('> .rcrmContentContainerHelper'); 
            this.border = new rcrmBorder();
            this.bordercolor_style = new rcrmBorderColor_Style();
            this.borderwidth = new rcrmBorderWidth();
            this.borderradius = new rcrmBorderRadius();
            this.show_footer_endpage = new rcrmShowFooterEndPage();


            this.clone = function () {
                return Container.find('#rcrmElementCloneArea').find('.rcrmFrameElement').attr('type', 'frame').clone();
            }
            this.updateSetting = function (elem) {
                this.position.update(elem.position().left, elem.position().top, elem.attr('pos'));
                this.size.update(elem.width(), elem.height());
                this.backgroundcolor.update(elem.find('> .rcrmContentContainerHelper').css('background-color'));
                this.border.update(elem.find('> .rcrmContentContainerHelper').css('border-left-style') , elem.find('> .rcrmContentContainerHelper').css('border-top-style'), elem.find('> .rcrmContentContainerHelper').css('border-right-style'),elem.find('> .rcrmContentContainerHelper').css('border-bottom-style'));
                this.bordercolor_style.update(elem.find('> .rcrmContentContainerHelper').css('border-color'), elem.attr('borderstyle'));
                this.borderwidth.update(elem.find('> .rcrmContentContainerHelper').css('border-width'));
                this.borderradius.update(elem.find('> .rcrmContentContainerHelper').css('border-radius'));
                this.show_footer_endpage.update(elem.attr('rcrmshow_endpage'));
            }
            this.appendSetting = function () {
                Container.find('#rcrm_detail_panel').append(this.position.clone());
                Container.find('#rcrm_detail_panel').append(this.size.clone());
                Container.find('#rcrm_detail_panel').append(this.backgroundcolor.clone());
                Container.find('#rcrm_detail_panel').append(this.border.clone());
                Container.find('#rcrm_detail_panel').append(this.bordercolor_style.clone());
                Container.find('#rcrm_detail_panel').append(this.borderwidth.clone());
                Container.find('#rcrm_detail_panel').append(this.borderradius.clone());
                Container.find('#rcrm_detail_panel').append(this.show_footer_endpage.clone());
            }
            this.updateInternalSize = function (Elem) {
                var borderLeft = Number(Elem.find('> .rcrmContentContainerHelper').css('border-left-width').replace('px', ''));
                var borderTop = Number(Elem.find('> .rcrmContentContainerHelper').css('border-top-width').replace('px', ''));
                var borderRight = Number(Elem.find('> .rcrmContentContainerHelper').css('border-right-width').replace('px', ''));
                var borderBottom = Number(Elem.find('> .rcrmContentContainerHelper').css('border-bottom-width').replace('px', ''));
                var width = Elem.outerWidth() - (borderLeft + borderRight);
                var height = Elem.outerHeight() - (borderTop + borderBottom);
                Elem.find('> .rcrmContentContainerHelper').find('> .rcrmDocElementContentFrame').width(width < 0 ? 0 : width)
                Elem.find('> .rcrmContentContainerHelper').find('> .rcrmDocElementContentFrame').height(height < 0 ? 0 : height)
            }
        }

        function rcrmHtml(id) {
            this.id = id
            this.html_content = new rcrmHtmlContent();
            this.position = new rcrmPosition();
            this.size = new rcrmSize();
            this.font = new rcrmFont();
            this.border = new rcrmBorder();
            this.bordercolor_style = new rcrmBorderColor_Style();
            this.borderwidth = new rcrmBorderWidth();
            this.borderradius = new rcrmBorderRadius();
            this.backgroundcolor = new rcrmBackgroundColor('> .rcrmContentContainerHelper');
            if(rcrmIsEmail) this.max_min_width = new rcrmMaxMinWidth();
            this.white_space = new rcrmWhiteSpace();
            this.padding = new rcrmPadding();
            if(rcrmIsEmail) this.margin = new rcrmMargin();

            
            this.clone = function () {
                return Container.find('#rcrmElementCloneArea').find('.rcrmHtmlElement').attr('type', 'html').clone();
            }
            this.updateSetting = function (elem) {
                var hContainer = elem.find('> .rcrmContentContainerHelper');
                var hContent = hContainer.find('> .rcrmDocElementContentText');
                this.html_content.update(elem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').html());
                this.position.update(elem.position().left, elem.position().top, elem.attr('pos'));
                var width = elem.width();
                if(rcrmIsEmail) width = elem.outerWidth();
                var height = elem.height();
                if(elem.attr('widthType') == 'auto') width = 0;
                if(elem.attr('heightType') == 'auto') height = 0
                this.size.update(width, height);
                this.font.update(elem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').css('font-family'), null);
                this.border.update(elem.find('> .rcrmContentContainerHelper').css('border-left-style') , elem.find('> .rcrmContentContainerHelper').css('border-top-style'), elem.find('> .rcrmContentContainerHelper').css('border-right-style'),elem.find('> .rcrmContentContainerHelper').css('border-bottom-style'));
                this.bordercolor_style.update(elem.find('> .rcrmContentContainerHelper').css('border-color'), elem.attr('borderstyle'));
                this.borderwidth.update(elem.find('> .rcrmContentContainerHelper').css('border-width'))
                this.borderradius.update(elem.find('> .rcrmContentContainerHelper').css('border-radius'))
                this.backgroundcolor.update(elem.find('> .rcrmContentContainerHelper').css('background-color'));
                this.white_space.update(hContent.css('white-space'))
                this.padding.update(hContent.css('padding-left'),hContent.css('padding-top'),hContent.css('padding-right'),hContent.css('padding-bottom'));
                if(rcrmIsEmail) this.margin.update(elem.css('margin-left'),elem.css('margin-top'),elem.css('margin-right'),elem.css('margin-bottom'));
                if(rcrmIsEmail) this.max_min_width.update(elem.attr('max-width'), elem.attr('min-width'));
            }
            this.appendSetting = function (elem) {
                Container.find('#rcrm_detail_panel').append(this.html_content.clone());
                Container.find('#rcrm_detail_panel').append(this.position.clone());
                Container.find('#rcrm_detail_panel').append(this.size.clone());
                Container.find('#rcrm_detail_panel').append(this.font.clone());
                Container.find('#rcrm_detail_panel').append(this.border.clone());
                Container.find('#rcrm_detail_panel').append(this.bordercolor_style.clone());
                Container.find('#rcrm_detail_panel').append(this.backgroundcolor.clone());
                Container.find('#rcrm_detail_panel').append(this.borderwidth.clone());
                Container.find('#rcrm_detail_panel').append(this.borderradius.clone());
                Container.find('#rcrm_detail_panel').append(this.white_space.clone());
                if(rcrmIsEmail) Container.find('#rcrm_detail_panel').append(this.max_min_width.clone());
                Container.find('#rcrm_detail_panel').append(this.padding.clone());
                if(rcrmIsEmail) Container.find('#rcrm_detail_panel').append(this.margin.clone());
            }
            this.updateInternalSize = function (Elem) {
                var hcontainer = Elem.find('> .rcrmContentContainerHelper');
                var content = hcontainer.find('> .rcrmDocElementContentText');
                var paddingLeft = Number(content.css('padding-left').replace('px', ''));
                var paddingTop = Number(content.css('padding-top').replace('px', ''));
                var paddingRight = Number(content.css('padding-right').replace('px', ''));
                var paddingBottom = Number(content.css('padding-bottom').replace('px', ''));
                var borderLeft = Number(hcontainer.css('border-left-width').replace('px', ''));
                var borderTop = Number(hcontainer.css('border-top-width').replace('px', ''));
                var borderRight = Number(hcontainer.css('border-right-width').replace('px', ''));
                var borderBottom = Number(hcontainer.css('border-bottom-width').replace('px', ''));
                var width = Elem.outerWidth() - (paddingLeft + borderLeft + paddingRight + borderRight);
                var height = Elem.outerHeight() - (paddingTop + borderTop + paddingBottom + borderBottom);
                content.width(width < 0 ? 0 : width);
                content.height(height < 0 ? 0 : height);
                if(Elem.attr('widthType') == 'auto'){
                    try {
                        if(rcrmRes.lang == 'fa') {
                            var right = Elem.parent().width() - (Elem.position().left + Elem.outerWidth(true));
                            if(right < 0) right = 0;
                            Elem.css('right', right + 'px');
                            Elem.css('left', '');
                            Elem.parent().css('direction' , 'rtl');
                        };
                    } catch (e) {}
                    content.width('auto');
                    if(Elem.find('.rcrmRotate').length > 0) {
                        var rect = Elem.find('.rcrmRotate')[0].getBoundingClientRect();
                        content.width(rect.width)
                    }
                    Elem.width(hcontainer.width() + (borderLeft + borderRight) - 2);
                    try {if(rcrmRes.lang == 'fa') { Elem.css('left', Elem.position().left); Elem.css('right', ''); Elem.parent().css('direction' , '') } } catch (e) {}
                }
                if(Elem.attr('heightType') == 'auto'){
                    content.height('auto');
                    if(Elem.find('.rcrmRotate').length > 0) {
                        var rect = Elem.find('.rcrmRotate')[0].getBoundingClientRect();
                        content.height(rect.height)
                    }
                    Elem.height(hcontainer.height() + (borderTop + borderBottom) - 2).css('min-height', '');
                }
            }
        }

        function rcrmPageBreak(id) {
            this.id = id
            this.position = new rcrmPosition();


            this.clone = function () {
                return Container.find('#rcrmElementCloneArea').find('.rcrmPageBreakElement').attr('type', 'page_break').clone();
            }
            this.updateSetting = function (elem) {
                this.position.update(elem.position().left, elem.position().top, elem.attr('pos'));
            }
            this.appendSetting = function () {
                Container.find('#rcrm_detail_panel').append(this.position.clone());
            }
        }

        //Setting Objects-------------------------------------------------------------------------------------

        function rcrmContent() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_content_row').clone();
            var obj = this;
           

            this.update = function (Value) {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(elem.length > 0){
                    $(this.html).find('.rcrm_element_content').val(Value);
                    $(this.html).find('.rcrm_element_content').trigger('keydown');
                    if(rcrmIsEmail){
                        Container.find('.rcrmEmail_dp .rcrm_element_content_row').show();
                        if(elem.hasClass('rcrmImageElement') && !elem.hasClass('rcrmBarcodeElement')) Container.find('.rcrmEmail_dp .rcrm_element_content_row').hide();
                        else if(elem.hasClass('rcrmTableTextElement') && elem.find('.rcrmDocElement').length > 0) { $(this.html).find('.rcrm_element_content').val(Value) }
                    }
                }
                else {
                    if(rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText' || rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS'){
                        Container.find('#rcrm_detail_panel .rcrm_element_content').live('click', function() { $(this).parents('.rcrmFormField').first().find('.rcrmButton').trigger('click') });
                        Container.find('#rcrm_detail_panel .rcrm_element_content').css('min-height' , 'unset').height('29px').attr('disabled', true);
                        Container.find('#rcrm_detail_panel .rcrm_element_content_row').show();
                        Container.find('#rcrm_detail_panel .rcrm_element_content_row label').text(rcrmRes.add_parameter);
                    }
                    else {
                        Container.find('#rcrm_detail_panel .rcrm_element_content').die("click");
                        Container.find('#rcrm_detail_panel .rcrm_element_content_row').hide();
                    }
                }
            }
            this.clone = function () {
                Container.find('.rcrm_element_content').unbind('input');
                Container.find('.rcrm_element_content').unbind('keydown');
                Container.find('.rcrm_element_content').unbind('click');
                Container.find('.rcrm_element_content').unbind('blur');
                Container.find('.rcrm_element_content_row .rcrmFormField').unbind('mouseenter');
                Container.find('.rcrm_element_content_row .rcrmFormField').unbind('mouseleave');
                $(this.html).find('.rcrmButton').unbind('click');
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                $(this.html).find('.rcrm_element_content').bind('input', function () {
                    obj.inputText(elem ,$(this).val());
                    $(this).removeClass('rcrmClicked');
                    $(this).addClass('rcrmClicked');
                });
                if(!elem.hasClass('rcrmLinkElement')){

                    //$(this.html).find('.rcrm_element_content').autogrow();
                    //$(this.html).find('.rcrm_element_content').bind('keydown', function () {
                    //    var $el = $(this);
                    //    var elem = this;
                    //    var offset = $el.innerHeight() - $el.height();
                    //    if (elem.scrollHeight > $el.innerHeight()) $el.height(elem.scrollHeight - offset);
                    //    else {
                    //        $el.height(1);
                    //        $el.height(elem.scrollHeight - offset);
                    //    }
                    //});
                    

                    $(this.html).find('.rcrm_element_content').bind('keydown', function () {
                        var el = $(this);
                        setTimeout(function() {
                            var height = $(el).innerHeight();
                            var scrollHeight = el[0].scrollHeight;
                            if (scrollHeight > height) $(el).height(scrollHeight);
                            else $(el).height(scrollHeight -10);
                        }, 1);
                    });

                    $(this.html).find('.rcrm_element_content').bind('paste', function () {
                        var el = $(this);
                        setTimeout(function() {
                            var height = $(el).innerHeight();
                            var scrollHeight = el[0].scrollHeight;
                            if (scrollHeight > height) $(el).height(scrollHeight);
                            else $(el).height(scrollHeight -10);
                        }, 1);
                    });

                }
                $(this.html).find('.rcrm_element_content').bind('click', function () {
                    $(this).removeClass('rcrmClicked');
                    $(this).addClass('rcrmClicked');
                });
                $(this.html).find('.rcrm_element_content').bind('blur', function () {
                    $(this).removeClass('rcrmClicked');
                });
                $(this.html).find('.rcrmFormField').bind('mouseenter', function () {
                    $(obj.html).find('.rcrmButton').css('background-color','rgb(253, 199, 0)');
                });
                $(this.html).find('.rcrmFormField').bind('mouseleave', function () {
                    $(obj.html).find('.rcrmButton').css('background-color','#004864');
                });
                $(this.html).find('.rcrmButton').bind('click', function (e) {
                    if(rcrmOptions.templateType == 'factor'){
                        var type = elem.attr('type');
                        if(elem.hasClass('rcrmTableTextElement') && elem.parents('tbody').length > 0 && elem.parents('.rcrmTableElement').attr('tabletype') == 'repeating') type = 'table';
                        rcrmShowParametrs(type);
                    }
                    else {
                        if(elem.hasClass('rcrmStructElement') || elem.hasClass('rcrmTableElement')) rcrmShowParametrs('table');
                        else rcrmShowParametrs('rcrmEmail');
                    }
                });
                if(elem.hasClass('rcrmImageElement')) $(this.html).find('label').text(rcrmRes.source);
                if(elem.hasClass('rcrmStructElement') || elem.hasClass('rcrmTableElement')) {
                    $(this.html).find('label').text(Container.find('.rcrmField').text());
                    $(this.html).find('.rcrm_element_content').attr('disabled', true);
                }
                return this.html;
            }
            this.inputText = function (elem ,text) {
                var content = elem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText');
                if(elem.hasClass('rcrmTextElement')) {
                    if(elem.find('.rcrmRotate').length == 0) {
                        if(content.find('a').length == 0) content.html(text);
                        else content.find('a').html(text);
                    }
                    else elem.find('.rcrmRotate').html(text);
                    rcrmSetElementBorder(elem);
                }
                if(elem.hasClass('rcrmTableTextElement')){
                    if(elem.find('.rcrmRotate').length == 0) {
                        if(rcrmIsEmail && $(content[0].outerHTML).find('.rcrmDocElement').length > 0) {
                            content.contents().filter(function() { return this.nodeType === 3 }).remove()
                            content.prepend(text);
                        }
                        else content.html(text);
                    }
                    else elem.find('.rcrmRotate').html(text);
                }
                else if(elem.hasClass('rcrmImageElement')) elem.find('img').attr('source' , text.trim());

                if(elem.hasClass('rcrmBarcodeElement')) {
                    elem.attr('barcode_data', text.trim());
                    elem.find('img').attr('src' , resources.host_name + '/pages/getFile.aspx?mode=' + (elem.attr('barcode_type') == undefined ? 'qrcode' : elem.attr('barcode_type')) + '&width='+ elem.width() +'&height='+ elem.height() +'&data=' + text.trim());
                }

                var elemObj = rcrmFindElementInstance(elem, false);
                if(elem.hasClass('rcrmTextElement') && (elem.attr('widthType') == 'auto' || elem.attr('heightType') == 'auto')) elemObj.updateInternalSize(elem); 
                else if(elem.hasClass('rcrmTableTextElement') && elem.attr('heightType') == 'auto') { var tblDiv = elem.parents('.rcrmTableElement').first(); var tblObj = rcrmFindElementInstance(tblDiv, false); tblObj.updateInternalSize(tblDiv) }

                rcrmChangeHtml();
            }
        }

        function rcrmLink() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_link_row').clone();

            this.update = function (address, type) {
                $(this.html).find('.rcrm_element_link_address').val(address);
                $(this.html).find('.rcrm_element_link_type').val(type);
            }
            this.clone = function () {
                Container.find('.rcrm_element_link_address').unbind('input');
                Container.find('.rcrm_element_link_type').unbind('change');
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');

                $(this.html).find('.rcrm_element_link_address').bind('input', function () {
                    var url = $(this).val();
                    if(!url.includes("http") && !url.includes("mailto") && url != '') url = 'http://'  + url; //&& !url.includes("#")
                    elem.find('a').attr('href', url);
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_element_link_type').bind('change', function () {
                    if($(this).val() == 'button') elem.width(110).height(26).removeClass('rcrmLinkElement').addClass('rcrmLinkElement').attr('type', 'link').attr('linkType' , 'button').find('.rcrmDocElementContentText').replaceWith('<a class="rcrmDocElementContentText" href="" target="_blank" style="position:unset;left:unset;top:unset">'+ rcrmRes.button +'</a>');
                    else elem.width(100).height(20).removeClass('rcrmLinkElement').addClass('rcrmLinkElement').attr('type', 'link').attr('linkType' , 'text').find('.rcrmDocElementContentText').replaceWith('<div class="rcrmDocElementContentText" style="position:unset;left:unset;top:unset;background-color:rgba(0, 0, 0, 0)"><a href="" target="_blank">'+ rcrmRes.linkText +'</a></div>');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    elemObj.updateInternalSize(elem);
                    elemObj.updateSetting(elem)
                    rcrmChangeHtml();
                });

                $(this.html).find('.rcrmButton').bind('click', function (e) {
                    rcrmShowParametrs('rcrmEmailLink');
                });

                return this.html;
            }
        }

        function rcrmHtmlContent() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_html_content').clone();
            var editor = null;

            this.update = function (Html) {
                editor.val(Html);
            }
            this.clone = function () {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                var elemObj = rcrmFindElementInstance(elem, false);
                editor = new RaveshUI.Editor({
                    lang: rcrmRes.lang,
                    width: '100%',
                    onChange: function () {
                        elem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').html(editor.val());
                        if(elem.attr('widthType') == 'auto' || elem.attr('heighttype') == 'auto') elemObj.updateInternalSize(elem); 
                        rcrmChangeHtml();
                    }
                });
                $(this.html).html(editor.getUI());
                return this.html;
            }
        }

        function rcrmPosition() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_position_row').clone();
           

            this.update = function (left, top, position) {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(left != null) {
                    if(rcrmRes.lang == 'en') $(this.html).find('.rcrm_element_position_x').val(Math.round(left));
                    else { var right = elem.parent().width() - (left + elem.outerWidth(true)); if(right < 0) right = 0; $(this.html).find('.rcrm_element_position_x').val(Math.round(right)) }
                }
                if(top!=null) $(this.html).find('.rcrm_element_position_y').val(Math.round(top));
                //-------------------------------------------------------------------------------
                if(elem.hasClass('rcrmFrameElement') && elem.parent().hasClass('rcrmDocumentBand')) $(this.html).find('.rcrm_element_position option[value=footer]').show();
                else $(this.html).find('.rcrm_element_position option[value=footer]').hide();
                //-------------------------------------------------------------------------------
                if(position!=null) $(this.html).find('.rcrm_element_position').val(position);
            }
            this.clone = function () {
                Container.find('.rcrm_element_position_x').unbind('input');
                Container.find('.rcrm_element_position_y').unbind('input');
                Container.find('.rcrm_element_position_x').unbind('keydown');
                Container.find('.rcrm_element_position_y').unbind('keydown');
                Container.find('.rcrm_element_position').unbind('change');
                $(this.html).find('.rcrm_element_position_x').bind('input', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var left = Number($(this).val() == "" ? 0 : $(this).val());
                    if(rcrmRes.lang == 'en') elem.css('left', left + 'px');
                    else { var right = elem.parent().width() - (left + elem.outerWidth(true)); if(right < 0) right = 0; elem.css('left', right + 'px'); }
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_element_position_y').bind('input', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    elem.css('top', ($(this).val() == "" ? 0 : $(this).val()) + 'px');
                    rcrmSortParentChilds(elem.parent(), elem);
                    rcrmSetFullHeight(elem);
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_element_position_x').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });
                $(this.html).find('.rcrm_element_position_y').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });
                $(this.html).find('.rcrm_element_position').bind('change', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    if($(this).val() == 'footer' && Container.find('.rcrmFrameElement[pos=footer]').length > 0) $(this).val('absolute');
                    elem.attr('pos', $(this).val());
                    try { elem.removeAttr('rcrmshow_endpage'); elemObj.updateSetting(elem) } catch (e) { }
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmSize() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_size_row').clone();
           

            this.update = function (width, height) {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(width != null) $(this.html).find('.rcrm_element_width').val(Math.round(width));
                if(height != null) $(this.html).find('.rcrm_element_height').val(Math.round(height));
                if(rcrmIsFactor || elem.hasClass('rcrmTableTextElement')) { //|| elem.hasClass('rcrmImageElement')
                    $(this.html).find('.rcrm_element_size').hide(); $(this.html).find('input').width('49%');
                }
                else 
                {
                    $(this.html).find('.rcrm_element_size').show();
                    if(elem.hasClass('rcrmAutoSize')) $(this.html).find('.rcrm_element_size').val('auto'); else $(this.html).find('.rcrm_element_size').val('fix');
                }
                if((rcrmIsEmail && elem.hasClass('rcrmTableTextElement')) || elem.hasClass('rcrmTextElement') || elem.hasClass('rcrmHtmlElement')) $(this.html).find('.rcrmHeightDescrib').show();
                else $(this.html).find('.rcrmHeightDescrib').hide();
            }
            this.clone = function () {
                Container.find('.rcrm_element_width').unbind('input');
                Container.find('.rcrm_element_height').unbind('input');
                Container.find('.rcrm_element_width').unbind('keydown');
                Container.find('.rcrm_element_height').unbind('keydown');
                Container.find('.rcrm_element_width').unbind('blur');
                var tElem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(tElem.hasClass('rcrmTableTextElement') && !tElem.parents('tr').first().parent().is('thead')) $(this.html).find('.rcrm_element_width').hide();
                if(tElem.hasClass('rcrmTableElement')) { $(this.html).find('.rcrm_element_height').hide(); $(this.html).find('.rcrm_element_width').width('49%'); $(this.html).find('.rcrm_element_size').width('49%') };

                $(this.html).find('.rcrm_element_width').bind('input', function () {
                    var width = 0;
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    if($(this).val() != "") width = $(this).val();

                    if(elem.hasClass('rcrmTableTextElement')){
                        width = Number(width);
                        if(width < 5) width = 5;
                        var tblDiv =  elem.parents('.rcrmTableElement').first();
                        var tblObj = rcrmFindElementInstance(tblDiv, false);
                        var tbl = tblDiv.find('> table');
                        var cell = elem;
                        var WDiff = width - elem.outerWidth(true);
                        //--------------------------------------------------------
                        var fix = tblDiv.attr('rcrmFixedTable') == 'true'; //rcrmIsEmail && 
                        if(fix) {
                            if($(cell).next('td').length > 0) tbl.find('> * > tr > td:nth-child('+ ($(cell).next('td').index() + 1) +')').width('');
                            else tbl.find('> * > tr > td:nth-child('+ $(cell).index() +')').width('');
                            tbl.find('> * > tr > .rcrmTableTextElement').each(function () {
                                if(rcrmRes.lang == 'fa' &&  ($(this).offset().left + $(this).width() < tbl.find('> thead > tr > .rcrmTableTextElement:last').offset().left)  && !$(this).parent().parent().is('thead') && $(this).parent().is(':visible') && $(this).parent().parent().is(':visible')) $(this).removeClass('rcrmMergedTD').addClass('rcrmMergedTD');
                                else if(rcrmRes.lang == 'en' &&  ($(this).offset().left > tbl.find('> thead > tr > .rcrmTableTextElement:last').offset().left)  && !$(this).parent().parent().is('thead') && $(this).parent().is(':visible') && $(this).parent().parent().is(':visible')) $(this).removeClass('rcrmMergedTD').addClass('rcrmMergedTD');
                            });
                        }
                        else
                        {
                            if(rcrmRes.lang == 'fa') {
                                var right = tblDiv.parent().width() - (tblDiv.position().left + tblDiv.outerWidth(true));
                                if(right < 0) right = 0;
                                tblDiv.css('right', right + 'px');
                                tblDiv.css('left', '');
                                tblDiv.parent().css('direction' , 'rtl');
                            };
                            tbl.width(tbl.outerWidth(true) + WDiff);
                        }
                        $(cell).width(width - 1);
                        tblObj.updateInternalSize(tblDiv);
                        //--------------------------------------------------------
                        if(rcrmRes.lang == 'fa') { tblDiv.css('left', tblDiv.position().left); tblDiv.css('right', ''); tblDiv.parent().css('direction' , '') };
                    }
                    else if(elem.hasClass('rcrmTableElement')) {
                        width = Number(width);
                        if(width < 5) width = 5;
                        try { if(rcrmIsEmail && width + Number(elem.css('margin-left').replace('px' ,'')) + Number(elem.css('margin-right').replace('px' ,'')) > elem.parent().width())
                        {
                            width =  elem.parent().width() - (Number(elem.css('margin-left').replace('px' ,'')) + Number(elem.css('margin-right').replace('px' ,'')));
                            $(this).val(width);
                        }
                        } catch (e) {}
                        var tbl = elem.find('> table');
                        //-------------------------------------------------------
                        tbl.find('> * > tr > .rcrmTableTextElement > .rcrmContentContainerHelper > .rcrmDocElementContentText').width('');
                        //var keyword = 'last'
                        //if(rcrmRes.lang == 'en') keyword = 'first';
                        tbl.find('> * > tr > .rcrmTableTextElement').each(function () {
                            if(rcrmRes.lang == 'fa' && ($(this).offset().left + $(this).width() < tbl.find('> thead > tr > .rcrmTableTextElement:last').offset().left)  && !$(this).parent().parent().is('thead') && $(this).parent().is(':visible') && $(this).parent().parent().is(':visible')) $(this).addClass('rcrmMergedTD');
                            else if(rcrmRes.lang == 'en' && ($(this).offset().left > tbl.find('> thead > tr > .rcrmTableTextElement:last').offset().left)  && !$(this).parent().parent().is('thead') && $(this).parent().is(':visible') && $(this).parent().parent().is(':visible')) $(this).addClass('rcrmMergedTD');
                            else
                            {
                                var cWidth = ($(this)[0].clientWidth / elem[0].clientWidth) * 100;
                                if($(this).attr('cellPercentWidth') == undefined) $(this).attr('cellPercentWidth', cWidth);
                                $(this).width($(this).attr('cellPercentWidth') + '%');
                            }
                        });
                        //--------------------------------------------------------
                        if(rcrmRes.lang == 'fa' && rcrmIsFactor) {
                            var right = elem.parent().width() - (elem.position().left + elem.outerWidth(true));
                            if(right < 0) right = 0;
                            elem.css('right', right + 'px');
                            elem.css('left', '');
                            elem.parent().css('direction' , 'rtl');
                        };
                        //--------------------------------------------------------
                        tbl.width(width);
                        elemObj.updateInternalSize(elem, false);
                        if(rcrmRes.lang == 'fa' && rcrmIsFactor) { elem.css('left', elem.position().left); elem.css('right', ''); elem.parent().css('direction' , '') };
                    }
                    else { 
                        if(rcrmRes.lang == 'fa') {
                            var right = elem.parent().width() - (elem.position().left + elem.outerWidth(true));
                            if(right < 0) right = 0;
                            elem.css('right', right + 'px');
                            elem.css('left', '');
                            elem.parent().css('direction' , 'rtl');
                        };
                        try {
                            if(rcrmIsEmail && Number(width) + Number(elem.css('margin-left').replace('px' ,'')) + Number(elem.css('margin-right').replace('px' ,'')) /*+ 2*/ > elem.parent().width()) {
                                width =  elem.parent().width() - (Number(elem.css('margin-left').replace('px' ,'')) + Number(elem.css('margin-right').replace('px' ,'')) /*+ 2*/);
                                $(this).val(width);
                            }
                        } catch (e) {}

                        if(rcrmIsEmail) elem.css('width', (width - (Number(elem.css('border-left-width').replace('px' ,'')) + Number(elem.css('border-right-width').replace('px' ,'')))) + 'px');
                        else elem.css('width', width + 'px');
                        try { if(elem.hasClass('rcrmTextElement') || elem.hasClass('rcrmHtmlElement')){
                            if(width <= 0){
                                elem.attr('widthType' , 'auto');
                                elem.find('.rcrmDocElementContentText').css('word-break' , 'unset').css('white-space' , 'nowrap');
                            }
                            else {
                                elem.attr('widthType' , '');
                                elem.find('.rcrmDocElementContentText').css('word-break' , '') //.css('white-space' , 'pre-line');
                                if(!elem.hasClass('rcrmHtmlElement')){
                                    if(rcrmIsEmail) elem.find('.rcrmDocElementContentText').css('white-space' , 'normal');
                                    else elem.find('.rcrmDocElementContentText').css('white-space' , 'pre-line');
                                }
                            }
                            elemObj.updateInternalSize(elem);
                        }} catch (e) {}
                        try { if(elem.hasClass('rcrmFrameElement')) elemObj.updateInternalSize(elem) } catch (e) {}
                        try { if(elem.hasClass('rcrmImageElement')){
                            if(elem.hasClass('rcrmBarcodeElement')) elem.find('img').attr('src' , resources.host_name + '/pages/getFile.aspx?mode=' + (elem.attr('barcode_type') == undefined ? 'qrcode' : elem.attr('barcode_type')) + '&width='+ elem.width() +'&height='+ elem.height() +'&data=' + (elem.attr('barcode_data') == undefined ? '' : elem.attr('barcode_data')));
                            elemObj.updateDisplayInternal(elem, elem.find('img'));
                        }} catch (e) {}
                        if(rcrmRes.lang == 'fa') { elem.css('left', elem.position().left); elem.css('right', ''); elem.parent().css('direction' , '') };
                    }
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_element_height').bind('input', function () {
                    var height = 0;
                    if($(this).val() != "") height = $(this).val();
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);

                    if(elem.hasClass('rcrmTableTextElement')){
                        var tblDiv =  elem.parents('.rcrmTableElement').first();
                        var tblObj = rcrmFindElementInstance(tblDiv, false);
                        var tbl = tblDiv.find('> table');
                        var rowtd = elem.parents('tr').first().find('> td');
                        try { rowtd.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').height(''); } catch (e) {}
                        var hDiff = height - elem[0].offsetHeight;
                        rowtd.height(rowtd[0].offsetHeight + hDiff - 1);
                        try {
                            if(rcrmIsEmail){
                                if(height <= 0) {
                                    rowtd.attr('heighttype' , 'auto');
                                    rowtd.each(function() { $(this).resize(function() { if($(this).attr('heightType') == 'auto') tblObj.updateInternalSize(tblDiv) }) });
                                }
                                else {
                                    rowtd.attr('heightType' , '');
                                    rowtd.find('> .rcrmContentContainerHelper').css('position', '');
                                }
                            }
                        } catch (e) {}
                        tblObj.updateInternalSize(tblDiv)
                    }
                    else {
                        elem.css('height', height + 'px');
                        try {
                            if(elem.hasClass('rcrmTextElement') || elem.hasClass('rcrmHtmlElement')){
                                if(height <= 0) elem.attr('heightType' , 'auto');
                                else elem.attr('heightType' , '').css('min-height' , '');
                                elemObj.updateInternalSize(elem)
                            }
                        } catch (e) {}
                        try { if(elem.hasClass('rcrmFrameElement')) elemObj.updateInternalSize(elem) } catch (e) {}
                        try { if(elem.hasClass('rcrmImageElement')) {
                            if(elem.hasClass('rcrmBarcodeElement')) elem.find('img').attr('src' , resources.host_name + '/pages/getFile.aspx?mode=' + (elem.attr('barcode_type') == undefined ? 'qrcode' : elem.attr('barcode_type')) + '&width='+ elem.width() +'&height='+ elem.height() +'&data=' + (elem.attr('barcode_data') == undefined ? '' : elem.attr('barcode_data')));
                            elemObj.updateDisplayInternal(elem, elem.find('img'));
                        }} catch (e) {}
                        try { if(elem.parents('.rcrmTableTextElement[heightType=auto]').length > 0) elem.parents('.rcrmTableTextElement[heightType=auto]').trigger('resize') } catch (e) {}
                    }
                    if(rcrmIsEmail) rcrmSetContainerHeight();
                    rcrmSetFullHeight(elem);
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_element_width').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });
                $(this.html).find('.rcrm_element_height').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });
                $(this.html).find('.rcrm_element_size').bind('change', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    if($(this).val() == 'auto') elem.removeClass('rcrmAutoSize').addClass('rcrmAutoSize');
                    else elem.removeClass('rcrmAutoSize');
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmTextStyle() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_textstyle_row').clone();
           

            this.update = function (fontWieght, fontStyle, textDecoration) {
                if(fontWieght == 'bold' || fontWieght == 700)
                    $(this.html).find('.rcrm_element_bold').addClass('rcrmButtonActive');
                else
                    $(this.html).find('.rcrm_element_bold').removeClass('rcrmButtonActive') ;

                if(fontStyle == 'italic')
                    $(this.html).find('.rcrm_element_italic').addClass('rcrmButtonActive');
                else
                    $(this.html).find('.rcrm_element_italic').removeClass('rcrmButtonActive');

                if(textDecoration == 'underline solid rgb(0, 0, 0)')
                    $(this.html).find('.rcrm_element_underline').addClass('rcrmButtonActive');
                else
                    $(this.html).find('.rcrm_element_underline').removeClass('rcrmButtonActive');
                this.updateVisibility();
            }
            this.updateVisibility = function () {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper > .rcrmDocElementContentText');
                if(elem.css('font-family') == 'BTitrBold' || elem.css('font-family') == 'BKoodakBold') $(this.html).find('.rcrm_element_bold').hide();
                else $(this.html).find('.rcrm_element_bold').show();
            }
            this.clone = function () {
                Container.find('.rcrm_element_bold').unbind('click');
                Container.find('.rcrm_element_italic').unbind('click');
                Container.find('.rcrm_element_underline').unbind('click');
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                var elemObj = rcrmFindElementInstance(elem, false);
                $(this.html).find('.rcrm_element_bold').bind('click', function () {
                    $(this).toggleClass('rcrmButtonActive');
                    $(this).blur();
                    elem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').css('font-weight', $(this).hasClass('rcrmButtonActive') ? 'bold' : 400);
                    if(elem.hasClass('rcrmTextElement') && elem.attr('widthType') == 'auto') elemObj.updateInternalSize(elem);
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_element_italic').bind('click', function () {
                    $(this).toggleClass('rcrmButtonActive');
                    $(this).blur();
                    Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').css('font-style', $(this).hasClass('rcrmButtonActive') ? 'italic' : 'normal');
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_element_underline').bind('click', function () {
                    $(this).toggleClass('rcrmButtonActive');
                    $(this).blur();
                    Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').css('text-decoration', $(this).hasClass('rcrmButtonActive') ? 'underline' : 'none');
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrmActionButton').removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
                return this.html
            }
        }

        function rcrmTextAlign() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_text_align_row').clone();
           

            this.update = function (textAlign, verticalAlign, repeat) {
                $(this.html).find('.rcrm_element_halignment .rcrmButton').removeClass('rcrmButtonActive');
                if(textAlign == 'left' || textAlign == 'center' || textAlign == 'right' || textAlign == 'justify')
                    $(this.html).find('.rcrm_element_halignment_' + textAlign).addClass('rcrmButtonActive');

                $(this.html).find('.rcrm_element_valignment .rcrmButton').removeClass('rcrmButtonActive');
                if(verticalAlign == 'top' || verticalAlign == 'middle' || verticalAlign == 'bottom')
                    $(this.html).find('.rcrm_element_valignment_' + verticalAlign).addClass('rcrmButtonActive');

                if(Container.find('#rcrm_content').find('.rcrmSelected').find('.rcrmRotate').length > 0){
                    Container.find('#rcrm_detail_panel .rcrm_element_halignment .rcrmButton').attr('disabled', true);
                    Container.find('#rcrm_detail_panel .rcrm_element_valignment .rcrmButton').attr('disabled', true);
                }
                else{
                    Container.find('#rcrm_detail_panel .rcrm_element_halignment .rcrmButton').removeAttr('disabled');
                    Container.find('#rcrm_detail_panel .rcrm_element_valignment .rcrmButton').removeAttr('disabled');
                }
                
                if(repeat != undefined) Container.find('#rcrm_detail_panel .rcrm_element_img_repeat').val(repeat);
            }
            this.clone = function () {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(elem.hasClass('rcrmImageElement')) $(this.html).find('label').text(rcrmRes.image_align + ' :');
                Container.find('.rcrm_element_text_align_row .rcrmButton').unbind('click');
                Container.find('.rcrm_element_img_repeat').unbind('change');

                $(this.html).find('.rcrm_element_halignment .rcrmButton').bind('click', function () {
                    Container.find('.rcrm_element_halignment .rcrmButton').removeClass('rcrmButtonActive');
                    $(this).addClass('rcrmButtonActive');
                    Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper').removeClass('rcrmDocElementAlignLeft rcrmDocElementAlignRight rcrmDocElementAlignCenter rcrmDocElementAlignJustify').addClass('rcrmDocElementAlign' + $(this).val());
                    var effectArea = '> .rcrmContentContainerHelper > .rcrmDocElementContentText';
                    if( Container.find('#rcrm_content').find('.rcrmSelected').hasClass('rcrmImageElement')){
                        effectArea= '> .rcrmContentContainerHelper';
                        Container.find('#rcrm_content').find('.rcrmSelected > .rcrmContentContainerHelper').css('background-position-x', $(this).val());
                    }
                    Container.find('#rcrm_content').find('.rcrmSelected ' + effectArea).css('text-align', $(this).val());
                    rcrmChangeHtml();
                });

                $(this.html).find('.rcrm_element_valignment .rcrmButton').bind('click', function () {
                    Container.find('.rcrm_element_valignment .rcrmButton').removeClass('rcrmButtonActive');
                    $(this).addClass('rcrmButtonActive');
                    Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper').removeClass('rcrmDocElementVAlignTop rcrmDocElementVAlignMiddle rcrmDocElementVAlignBottom').addClass('rcrmDocElementVAlign' + $(this).val());
                    var effectArea = '> .rcrmContentContainerHelper > .rcrmDocElementContentText';
                    if( Container.find('#rcrm_content').find('.rcrmSelected').hasClass('rcrmImageElement')){
                        effectArea= '> .rcrmContentContainerHelper';
                        var align = $(this).val();
                        if(align == 'Middle') align = 'center';
                        Container.find('#rcrm_content').find('.rcrmSelected > .rcrmContentContainerHelper').css('background-position-y', align);
                    }
                    Container.find('#rcrm_content').find('.rcrmSelected ' + effectArea).css('vertical-align', $(this).val().toLowerCase());
                    rcrmChangeHtml();
                });

                $(this.html).find('.rcrmActionButton').removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
                $(this.html).find('.rcrm_element_img_repeat').hide();
                if(elem.hasClass('rcrmImageElement')) {
                    $(this.html).find('.rcrm_element_halignment_justify').remove();
                    $(this.html).find('.rcrm_element_img_repeat').show().bind('change', function () {
                        elem.find('> .rcrmContentContainerHelper').css('background-repeat', $(this).val()).css('background-size', 'unset').attr('bg_repeat', $(this).val());
                        if($(this).val() == 'no-repeat'){ elem.find('img').show(); elem.find('> .rcrmContentContainerHelper').css('background-image', 'unset') }
                        else { elem.find('img').hide(); elem.find('> .rcrmContentContainerHelper').css('background-image', 'url('+ elem.find('img').attr('src') +')') }
                        if($(this).val() == 'stretch') elem.find('> .rcrmContentContainerHelper').css('background-repeat', 'no-repeat').css('background-size', 'cover');
                        rcrmChangeHtml();
                    });
                }
                return this.html
            }
        }

        function rcrmAlign() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_align_row').clone();

            this.update = function (Align, verticalAlign, repeat) {
                $(this.html).find('.rcrm_halignment .rcrmButton').removeClass('rcrmButtonActive');
                Align = Align.toLowerCase(); //Align.replace('-webkit-', '').replace('-moz-', '').toLowerCase();
                if(Align == 'left' || Align == 'center' || Align == 'right') $(this.html).find('.rcrm_halignment_' + Align).addClass('rcrmButtonActive');
                if (rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText' || rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS') $(this.html).hide();
                if(repeat != undefined) Container.find('#rcrm_detail_panel .rcrm_img_repeat').val(repeat);
            }
            this.clone = function () {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                Container.find('.rcrm_align_row .rcrmButton').unbind('click');
                Container.find('.rcrm_img_repeat').unbind('change');

                $(this.html).find('.rcrm_halignment .rcrmButton').bind('click', function () {
                    Container.find('.rcrm_halignment .rcrmButton').removeClass('rcrmButtonActive');
                    $(this).addClass('rcrmButtonActive');
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    if(elem.length > 0) {
                        if(elem.hasClass('rcrmImageElement')) elem.find('> .rcrmContentContainerHelper').attr('align', $(this).val().toLowerCase()).css('display' , 'block').css('background-position-x', $(this).val()).css('text-align','')  //.css('text-align', '-webkit-' + $(this).val());
                        else if(elem.hasClass('rcrmTextElement')) elem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').removeAttr('align').css('text-align',$(this).val().toLowerCase()).css('display' , 'block');
                        else elem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').attr('align', $(this).val().toLowerCase()).css('display' , 'block').css('text-align','')  //.css('text-align', '-webkit-' + $(this).val());
                    }
                    else Container.find('#rcrm_content').attr('align', $(this).val().toLowerCase()).css('text-align','')  //.css('text-align', '-webkit-' + $(this).val());
                    rcrmChangeHtml();
                });

                $(this.html).find('.rcrmActionButton').removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
                $(this.html).find('.rcrm_img_repeat').hide();
                if(elem.hasClass('rcrmImageElement')) {
                    var elemObj = rcrmFindElementInstance(elem, false);
                    $(this.html).find('.rcrm_img_repeat').show().bind('change', function () {
                        elem.find('> .rcrmContentContainerHelper').css('background-repeat', $(this).val()).css('background-size', 'unset').attr('bg_repeat', $(this).val());
                        if($(this).val() == 'no-repeat') {
                            elem.find('img').show();
                            elem.find('> .rcrmContentContainerHelper').css('background-image', 'unset');
                        }
                        else 
                        {
                            elem.find('img').hide();
                            elem.find('> .rcrmContentContainerHelper').css('background-image', 'url('+ elem.find('img').attr('src') +')')
                        }
                        if($(this).val() == 'stretch') elem.find('> .rcrmContentContainerHelper').css('background-repeat', 'no-repeat').css('background-size', 'cover');
                        try { if(rcrmIsEmail) elemObj.borderradius.update(elem.find('> .rcrmContentContainerHelper > img').css('border-radius')) } catch (e) {}
                        rcrmChangeHtml();
                    });
                }
                return this.html
            }
        }

        function rcrmTextColor() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_text_color_row').clone();
           

            this.update = function (color) {
                $(this.html).find('.rcrm_element_text_color').spectrum("set", color);
            }
            this.clone = function () {
                $(this.html).find('.sp-replacer').remove();
                $(this.html).find('.rcrm_element_text_color').spectrum({
                    cancelText: rcrmRes.cancel,
                    chooseText: rcrmRes.select,
                    showInput: true,
                    showInitial: true,
                    preferredFormat: "hex6",
                    clickoutFiresChange: true,
                    showPalette: true,
                    palette: [['#f44336', '#e91e63', '#9c27b0', '#673ab7'], ['#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'], ['#009688', '#4caf50', '#8bc34a', '#cddc39'], ['#ffeb3b', '#ffc107', '#ff9800', '#ff5722'], ['#000', '#fff', '#aaa', 'transparent']],
                    move: function (color) {
                        color = color.toRgbString();
                        if(color != 'rgba(0, 0, 0, 0)' && color.indexOf('a') != -1) color = color.replace('a' , '').replace(', 0)' , '');
                        Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').css('color', color);
                    },
                    change: function(color) {
                        color = color.toRgbString();
                        if(color != 'rgba(0, 0, 0, 0)' && color.indexOf('a') != -1) color = color.replace('a' , '').replace(', 0)' , '');
                        Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').css('color', color);
                        rcrmChangeHtml();
                    }
                });
                return this.html;
            }
        }

        function rcrmBackgroundColor(selector) {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_background_color_row').clone();
            var elemObj = this;
           

            this.update = function (backgroundcolor) {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                $(this.html).find('.rcrm_element_background_color').spectrum("set", backgroundcolor);
                if(elem.length == 0 && (rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS')) $(this.html).hide();
                else $(this.html).show();
            }
            this.clone = function () {
                if(Container.find('#rcrm_content').find('.rcrmSelected').hasClass('rcrmLineElement')) $(this.html).find('label').text(rcrmRes.color + ' :');
                $(this.html).find('.sp-replacer').remove();
                $(this.html).find('.rcrm_element_background_color').spectrum({
                    cancelText: rcrmRes.cancel,
                    chooseText: rcrmRes.select,
                    showInput: true,
                    showInitial: true,
                    preferredFormat: "hex6",
                    clickoutFiresChange: true,
                    showPalette: true,
                    palette: [['#f44336', '#e91e63', '#9c27b0', '#673ab7'], ['#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'], ['#009688', '#4caf50', '#8bc34a', '#cddc39'], ['#ffeb3b', '#ffc107', '#ff9800', '#ff5722'], ['#000', '#fff', '#aaa', 'transparent']],
                    move: function (color) { elemObj.setColor(color); },
                    change: function(color){ elemObj.setColor(color); rcrmChangeHtml() },
                    hide: function(color)  { elemObj.setColor(color); }
                });
                return this.html;
            }
            this.setColor = function(color) {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(elem.length == 0) elem = Container.find('#rcrm_document_content'); 

                //WhiteElem*************************************************************************
                var select = selector;
                if(select == '> .rcrmContentContainerHelper') {
                    if(elem.hasClass('rcrmTextElement') || elem.hasClass('rcrmHtmlElement')) select = '> .rcrmContentContainerHelper > .rcrmDocElementContentText';
                    if(elem.hasClass('rcrmFrameElement')) select = '> .rcrmContentContainerHelper > .rcrmDocElementContentFrame';
                }
                if(color.toRgbString() == 'rgb(255, 255, 255)') { 
                    if(elem.hasClass('rcrmTableTextElement')) elem.removeClass('rcrmWhiteElement').addClass('rcrmWhiteElement');
                    else elem.find(select).removeClass('rcrmWhiteElement').addClass('rcrmWhiteElement');
                }
                else {
                    if(elem.hasClass('rcrmTableTextElement')) elem.removeClass('rcrmWhiteElement');
                    else elem.find(select).removeClass('rcrmWhiteElement');
                }
                //*************************************************************************
                color = color.toRgbString();
                if(color != 'rgba(0, 0, 0, 0)' && color.indexOf('a') != -1) {
                    color = color.replace('a' , '').replace(', 0)' , '');
                    $(this.html).find('.rcrm_element_background_color').spectrum("set", color);
                }

                if(selector == '') elem.css('background-color', color);
                else 
                {
                    if(elem.hasClass('rcrmTableTextElement') && rcrmIsEmail) elem.css('background-color', color);
                    else elem.find(selector).css('background-color', color);
                    if(elem.hasClass('rcrmTextElement') && selector == '> .rcrmContentContainerHelper > .rcrmDocElementContentText' && rcrmIsFactor) elem.find('> .rcrmContentContainerHelper').css('background-color', color);
                }
            }
        }

        function rcrmFont() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_font_row').clone();
            var obj = this;
             
            this.update = function (font, fontsize) {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(font != null) { 
                    $(this.html).find('.rcrm_element_font').val(font);
                    Container.find('#rcrm_detail_panel').find('.rcrm_html_content .ravesh-editor-content').css('font-family', font);
                }
                if(fontsize != null) $(this.html).find('.rcrm_element_font_size').val(fontsize.replace('px', ''));
                if(elem.hasClass('rcrmHtmlElement') && rcrmOptions.templateType != 'factor') $(this.html).hide(); else $(this.html).show();
            }
            this.clone = function () {
                Container.find('.rcrm_element_font').unbind('change');
                Container.find('.rcrm_element_font_size').unbind('change');
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                var elemObj = rcrmFindElementInstance(elem, false);
                $(this.html).find('.rcrm_element_font').bind('change', function () {
                    Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').css('font-family', $(this).val());
                    if(elem.hasClass('rcrmTextElement') && elem.attr('widthType') == 'auto') elemObj.updateInternalSize(elem);
                    try { Container.find('#rcrm_detail_panel').find('.rcrm_html_content .ravesh-editor-content').css('font-family', $(this).val()) } catch (e) {}
                    try { elemObj.textstyle.updateVisibility(); } catch (e) {}
                    rcrmChangeHtml($(this).val(),null,null);
                });
                $(this.html).find('.rcrm_element_font_size').bind('change', function () {
                    Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').css('font-size', $(this).val() + 'px');
                    if(elem.hasClass('rcrmTextElement') && elem.attr('widthType') == 'auto') elemObj.updateInternalSize(elem);
                    if(elem.hasClass('rcrmTextElement') && (elem.attr('widthType') == 'auto' || elem.attr('heightType') == 'auto')) elemObj.updateInternalSize(elem);
                    if(elem.hasClass('rcrmTableTextElement') && elem.attr('heightType') == 'auto') {
                        var tblDiv = elem.parents('.rcrmTableElement').first();
                        var tblObj = rcrmFindElementInstance(tblDiv, false);
                        tblObj.updateInternalSize(tblDiv);
                    }
                    rcrmChangeHtml();
                });
                if(rcrmRes.lang == 'en') $(this.html).find('.rcrm_element_font .fontFa[value=tahoma]').remove();
                if(elem.hasClass('rcrmHtmlElement')) { $(this.html).find('.rcrm_element_font_size').hide(); $(this.html).find('.rcrm_element_font').width('100%') }
                return this.html
            }
        }

        function rcrmBorder() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_border_row').clone();

            this.update = function (borderLeft, borderTop, borderRight, borderBottom) {
                $(this.html).find('button').removeClass('rcrmButtonActive');
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(elem.attr('borderstyle') == undefined) elem.attr('borderstyle', 'solid');
                if(borderLeft == elem.attr('borderstyle')) $(this.html).find('.rcrm_element_border_left').addClass('rcrmButtonActive'); //'solid'
                if(borderTop == elem.attr('borderstyle')) $(this.html).find('.rcrm_element_border_top').addClass('rcrmButtonActive');
                if(borderRight == elem.attr('borderstyle')) $(this.html).find('.rcrm_element_border_right').addClass('rcrmButtonActive');
                if(borderBottom == elem.attr('borderstyle')) $(this.html).find('.rcrm_element_border_bottom').addClass('rcrmButtonActive');
                if(borderLeft == elem.attr('borderstyle') && borderTop == elem.attr('borderstyle') && borderRight == elem.attr('borderstyle') && borderBottom == elem.attr('borderstyle'))
                    $(this.html).find('.rcrm_element_border_all').addClass('rcrmButtonActive');
            }
            this.clone = function () {
                var elem = $(this.html);
                elem.find('button').unbind('click');
                elem.find('button').bind('click', function () {
                    var innerElem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(innerElem, false);
                    if(innerElem.attr('borderstyle') == undefined) innerElem.attr('borderstyle', 'solid');

                    if($(this).val() == 'all')
                    {
                        if($(this).hasClass('rcrmButtonActive')) elem.find('.rcrmActionButton').removeClass('rcrmButtonActive');
                        else { elem.find('.rcrmActionButton').removeClass('rcrmButtonActive'); elem.find('.rcrmActionButton').addClass('rcrmButtonActive') }
                        var border = $(this).hasClass('rcrmButtonActive') ? innerElem.attr('borderstyle') : 'none'; //'solid'
                        Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper').css('border-left-style', border).css('border-top-style', border).css('border-right-style', border).css('border-bottom-style', border);
                    }
                    else
                    {
                        if($(this).hasClass('rcrmButtonActive'))
                        {
                            $(this).removeClass('rcrmButtonActive'); elem.find('.rcrm_element_border_all').removeClass('rcrmButtonActive')
                        }
                        else 
                        {
                            $(this).addClass('rcrmButtonActive');
                            elem.find('.rcrm_element_border_all').addClass('rcrmButtonActive');
                            elem.find(".rcrmActionButton:not(.rcrm_element_border_all)").each(function () {
                                if(! $(this).hasClass('rcrmButtonActive')) elem.find('.rcrm_element_border_all').removeClass('rcrmButtonActive');
                            });
                        }
                        Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper').css('border-'+ $(this).val() +'-style', $(this).hasClass('rcrmButtonActive') ? innerElem.attr('borderstyle') : 'none'); //'solid'
                    }
                    try {
                        if(innerElem.hasClass('rcrmTextElement') || innerElem.hasClass('rcrmTableTextElement') || innerElem.hasClass('rcrmHtmlElement'))
                        {
                            elemObj.updateInternalSize(innerElem) ;
                            elemObj.borderwidth_radius.update(innerElem.find('> .rcrmContentContainerHelper').css('border-width'), null);
                        } 
                    } catch (e) {}
                    try {
                        if(innerElem.hasClass('rcrmFrameElement')){
                            elemObj.updateInternalSize(innerElem);
                            elemObj.borderwidth_radius.update(innerElem.find('> .rcrmContentContainerHelper').css('border-width'), null);
                        }
                    } catch (e) {}
                    try { if(rcrmIsEmail && innerElem.hasClass('rcrmTextElement')) Container.find('#rcrm_detail_panel .rcrm_element_border_width').trigger('input') } catch (e) {}
                    $(this).blur();
                    rcrmChangeHtml();
                });
                elem.find('.rcrmActionButton').removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
                return this.html
            }
        }

        function rcrmBorderColor_Style() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_border_color_style_row').clone();
            var elemObject = this;

            this.update = function (color, style) {
                $(this.html).find('.rcrm_element_border_color').spectrum("set", color);
                if(style != null) $(this.html).find('.rcrm_element_border_style').val(style);
            }
            this.clone = function () {
                $(this.html).find('.sp-replacer').remove();
                Container.find('.rcrm_element_border_style').unbind('change');
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(elem.hasClass('rcrmTableElement')) $(this.html).find('.rcrm_element_border_style').hide();

                $(this.html).find('.rcrm_element_border_color').spectrum({
                    cancelText: rcrmRes.cancel,
                    chooseText: rcrmRes.select,
                    showInput: true,
                    showInitial: true,
                    preferredFormat: "hex6",
                    clickoutFiresChange: true,
                    showPalette: true,
                    palette: [['#f44336', '#e91e63', '#9c27b0', '#673ab7'], ['#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'], ['#009688', '#4caf50', '#8bc34a', '#cddc39'], ['#ffeb3b', '#ffc107', '#ff9800', '#ff5722'], ['#000', '#fff', '#aaa', 'transparent']],
                    move: function (color) { elemObject.setColor(color); },
                    change: function(color){ elemObject.setColor(color);  rcrmChangeHtml() }
                });
                $(this.html).find('.rcrm_element_border_style').bind('change', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var innerElem = elem.find('> .rcrmContentContainerHelper')
                    if(elem.attr('borderstyle') == undefined) elem.attr('borderstyle', 'solid');
                    var borderStyle = innerElem.css('border-style').toString().split(elem.attr('borderstyle')).join($(this).val());
                    elem.attr('borderstyle', $(this).val())
                    innerElem.css('border-style', borderStyle)
                    rcrmChangeHtml();
                });
                return this.html;
            }
            this.setColor = function(color) {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                color = color.toRgbString();
                if(color != 'rgba(0, 0, 0, 0)' && color.indexOf('a') != -1) {
                    color = color.replace('a' , '').replace(', 0)' , '');
                    $(this.html).find('.rcrm_element_border_color').spectrum("set", color);
                }
                if(elem.hasClass('rcrmTableElement')){
                    elem.find('> table').css('border-color', color);
                    elem.find('> table > * > .rcrmTableBandElement').css('border-color', color);
                    elem.find('> table > * > tr > .rcrmTableTextElement').css('border-color', color);
                    try { var elemObj = rcrmFindElementInstance(elem, false); elemObj.custom_css.update(elem.find('> table').attr('style')) } catch (e) {}
                }
                else elem.find('> .rcrmContentContainerHelper').css('border-color', color);
            }
        }

        function rcrmBorderWidth() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_border_width_row').clone();
           

            this.update = function (width) {
                if(width == undefined) { $(this.html).find('.rcrm_element_border_width').val('1'); return false; }
                if(width != null){
                    if (width == '0px') width = '1px'; 
                    var widthArr = width.split(' ');
                    $.each(widthArr ,function (i, data) { if(data != '0px'){ width = data; return false; } });
                    $(this.html).find('.rcrm_element_border_width').val(width.replace('px',''));
                }
            }
            this.clone = function () {
                Container.find('.rcrm_element_border_width').unbind('input');
                Container.find('.rcrm_element_border_width').unbind('keydown');
                $(this.html).find('.rcrm_element_border_width').bind('input', function () {
                    var width = 1;
                    if($(this).val() != "" && $(this).val() != 0) width = $(this).val();
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);

                    if(elem.hasClass('rcrmTableElement')){
                        elem.find('table').css('border-width', width + 'px').attr('borderwidth' , width + 'px');
                        elem.find('.rcrmTableBandElement').css('border-width', width + 'px');
                        elem.find('.rcrmTableTextElement').css('border-width', width + 'px');
                        //elem.find('table').width(elem.find('table')[0].offsetWidth);
                    }
                    else {
                        elem.find('> .rcrmContentContainerHelper').css('border-width', width + 'px');
                        if(rcrmIsEmail && width > 1 && (elem.hasClass('rcrmTextElement') || elem.hasClass('rcrmHtmlElement')) && !elem.hasClass('rcrmLinkElement') && elem.find('> .rcrmContentContainerHelper').css('border-style') != 'none') { elem.height(''); elem.addClass('rcrmBorderLess') }
                        else elem.removeClass('rcrmBorderLess');
                    }
                    try { if(elem.hasClass('rcrmTextElement') || elem.hasClass('rcrmHtmlElement')) elemObj.updateInternalSize(elem) } catch (e) {} 
                    try { if(elem.hasClass('rcrmFrameElement')) elemObj.updateInternalSize(elem) } catch (e) {}
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_element_border_width').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });
                return this.html
            }
        }

        function rcrmBorderRadius() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_border_radius_row').clone();
           

            this.update = function (radius) {
                if(radius != null) $(this.html).find('.rcrm_element_border_radius').val(radius.replace('px',''));
                if(rcrmIsEmail) {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    if(elem.hasClass('rcrmImageElement')) if(elem.find('> .rcrmContentContainerHelper').css('background-image') == 'none') $(this.html).show(); else $(this.html).hide(); 
                }
            }
            this.clone = function () {
                Container.find('.rcrm_element_border_radius').unbind('input');
                Container.find('.rcrm_element_border_radius').unbind('keydown');
                $(this.html).find('.rcrm_element_border_radius').bind('input', function () {
                    var radius = 0;
                    if($(this).val() != "") radius = $(this).val();
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');

                    if(elem.hasClass('rcrmImageElement')) elem.find('> .rcrmContentContainerHelper > img').css('border-radius', radius + 'px');
                    else elem.find('> .rcrmContentContainerHelper').css('border-radius', radius + 'px');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_element_border_radius').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });
                return this.html
            }
        }

        function rcrmLineSpacing() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_line_space_row').clone();
           

            this.update = function (lineSpace) {
                if(lineSpace == '' || lineSpace == null || lineSpace == undefined) lineSpace = '100%';
                lineSpace = Number(lineSpace.replace('%', '')) /100;
                $(this.html).find('.rcrm_element_line_spacing').val(lineSpace);
            }
            this.clone = function () {
                Container.find('.rcrm_element_line_spacing').unbind('input');
                Container.find('.rcrm_element_line_spacing').unbind('keydown');
                $(this.html).find('.rcrm_element_line_spacing').bind('input', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').css('line-height', (Number($(this).val()) * 100) + '%');
                    if(elem.hasClass('rcrmTextElement') && (elem.attr('widthType') == 'auto' || elem.attr('heightType') == 'auto')) elemObj.updateInternalSize(elem); 
                    if(elem.hasClass('rcrmTableTextElement') && elem.attr('heightType') == 'auto') {
                        var tblDiv = elem.parents('.rcrmTableElement').first();
                        var tblObj = rcrmFindElementInstance(tblDiv, false);
                        tblObj.updateInternalSize(tblDiv);
                    }
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_element_line_spacing').bind('keydown', function (e){
                    rcrmTextKeyDown(e, pareseInt($(this)));
                    return rcrmIsNumber(e, true);
                });
                return this.html
            }
        }

        function rcrmDirection() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_direction_row').clone();
           

            this.update = function (direction) {
                if(direction == '' || direction == undefined) { if(rcrmRes.lang == 'fa') direction = 'rtl'; else direction = 'ltr' }
                $(this.html).find('.rcrm_element_direction').val(direction);
                Container.find('#rcrm_detail_panel .rcrm_element_content').removeClass('rcrm_rtl').removeClass('rcrm_ltr').addClass('rcrm_' + direction);
            }
            this.clone = function () {
                Container.find('.rcrm_element_direction').unbind('change');
                $(this.html).find('.rcrm_element_direction').bind('change', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper > .rcrmDocElementContentText');
                    elem.css('direction', $(this).val()).removeClass('rcrm_rtl').removeClass('rcrm_ltr').addClass('rcrm_' + $(this).val());
                    Container.find('#rcrm_detail_panel .rcrm_element_content').removeClass('rcrm_rtl').removeClass('rcrm_ltr').addClass('rcrm_' + $(this).val());
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmWhiteSpace() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_white_space_row').clone();
           

            this.update = function (white_space) {
                if(white_space == '' || white_space == undefined) white_space = 'pre-line';
                $(this.html).find('.rcrm_white_space').val(white_space);
            }
            this.clone = function () {
                Container.find('.rcrm_white_space').unbind('change');
                $(this.html).find('.rcrm_white_space').bind('change', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper > .rcrmDocElementContentText');
                    elem.css('white-space', $(this).val());
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmMaxMinWidth() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_max_min_width_row').clone();
           

            this.update = function (maxWidth, minWidth) {
                if(maxWidth == undefined) maxWidth = 0;
                if(minWidth == undefined) minWidth = 0;
                $(this.html).find('.rcrm_element_max_width').val(maxWidth);
                $(this.html).find('.rcrm_element_min_width').val(minWidth);
            }
            this.clone = function () {
                Container.find('.rcrm_element_max_width').unbind('input');
                Container.find('.rcrm_element_max_width').unbind('keydown');
                Container.find('.rcrm_element_min_width').unbind('input');
                Container.find('.rcrm_element_min_width').unbind('keydown');

                $(this.html).find('.rcrm_element_max_width').bind('input', function () {
                    var maxWidth = 0;
                    if($(this).val() != "") maxWidth = $(this).val();
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    if(maxWidth == 0) elem.removeAttr('max-width');
                    else elem.attr('max-width' , maxWidth);
                });
                $(this.html).find('.rcrm_element_max_width').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });

                $(this.html).find('.rcrm_element_min_width').bind('input', function () {
                    var minWidth = 0;
                    if($(this).val() != "") minWidth = $(this).val();
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    if(minWidth == 0) elem.removeAttr('min-width');
                    else elem.attr('min-width' , minWidth);
                });
                $(this.html).find('.rcrm_element_min_width').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });

                return this.html
            }
        }

        function rcrmPadding() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_padding_row').clone();
           

            this.update = function (left, top,right,bottom) {
                $(this.html).find('.rcrm_element_padding_left').val(left.replace('px',''));
                $(this.html).find('.rcrm_element_padding_top').val(top.replace('px',''));
                $(this.html).find('.rcrm_element_padding_right').val(right.replace('px',''));
                $(this.html).find('.rcrm_element_padding_bottom').val(bottom.replace('px',''));
            }
            this.clone = function () {
                Container.find('.rcrm_element_padding_row input').unbind('input');
                Container.find('.rcrm_element_padding_row input').unbind('keydown');
                $(this.html).find('input').bind('input', function () {
                    var padding = 0;
                    if($(this).val() != "") padding = $(this).val();
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    if(elem.hasClass('rcrmImageElement')) elem.find('> .rcrmContentContainerHelper > img').css('margin-' + $(this).attr('spin'), padding + 'px');;
                    elem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').css('padding-' + $(this).attr('spin'), padding + 'px');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    try { if(elem.hasClass('rcrmTextElement') || elem.hasClass('rcrmTableTextElement') || elem.hasClass('rcrmHtmlElement')) elemObj.updateInternalSize(elem) } catch (e) {}
                    try { if(elem.hasClass('rcrmImageElement')){ elemObj.updateDisplayInternal(elem, elem.find('img'))} } catch (e) {}
                    rcrmChangeHtml();
                });
                $(this.html).find('input').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });
                return this.html
            }
        }

        function rcrmMargin() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_margin_row').clone();
           

            this.update = function (left, top,right,bottom) {
                $(this.html).find('.rcrm_element_margin_left').val(left.replace('px',''));
                $(this.html).find('.rcrm_element_margin_top').val(top.replace('px',''));
                $(this.html).find('.rcrm_element_margin_right').val(right.replace('px',''));
                $(this.html).find('.rcrm_element_margin_bottom').val(bottom.replace('px',''));
            }
            this.clone = function () {
                Container.find('.rcrm_element_margin_row input').unbind('input');
                Container.find('.rcrm_element_margin_row input').unbind('keydown');
                $(this.html).find('input').bind('input', function () {
                    var margin = 0;
                    if($(this).val() != "") margin = $(this).val();
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    if(($(this).attr('spin') == 'left') && elem.outerWidth() + Number($(this).val()) + Number(elem.css('margin-right').replace('px' , '')) >= elem.parent().width()) Container.find('#rcrm_detail_panel .rcrm_element_size_row .rcrm_element_width').val(elem.parent().width() - Number($(this).val()) - Number(elem.css('margin-right').replace('px' , ''))).trigger('input');
                    if(($(this).attr('spin') == 'right') && elem.outerWidth() + Number($(this).val()) + Number(elem.css('margin-left').replace('px' , '')) >= elem.parent().width()) Container.find('#rcrm_detail_panel .rcrm_element_size_row .rcrm_element_width').val(elem.parent().width() - Number($(this).val()) - Number(elem.css('margin-left').replace('px' , ''))).trigger('input');
                    elem.css('margin-' + $(this).attr('spin'), margin + 'px');
                    if($(this).attr('spin') == 'top' || $(this).attr('spin') == 'bottom') rcrmSetContainerHeight();
                    rcrmChangeHtml();
                });
                $(this.html).find('input').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });
                return this.html
            }
        }

        function rcrmRotate() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_rotate_row').clone();

            this.update = function (degree) {
                if (degree  == '') degree = 0;
                if(degree.toString().indexOf('(') != -1) degree = degree.toString().replace('rotate(' , '').replace('deg)', '');
                $(this.html).find('.rcrm_element_rotate').val(degree);
            }
            this.clone = function () {
                Container.find('.rcrm_element_rotate').unbind('change');
                $(this.html).find('.rcrm_element_rotate').bind('change', function () {
                    var deg = $(this).val();
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);

                    var txtElem = elem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText');
                    if(txtElem.find('.rcrmRotate').length == 0) txtElem.html('<div class="rcrmRotate">'+ txtElem.text() +'<div>');
                    txtElem.find('.rcrmRotate').css('transform', 'rotate(' + deg + 'deg)').attr('trans' , deg);
                    if(deg != 0) {
                        Container.find('#rcrm_detail_panel .rcrm_element_halignment .rcrmButton').removeClass('rcrmButtonActive').attr('disabled', true);
                        Container.find('#rcrm_detail_panel .rcrm_element_halignment_center').addClass('rcrmButtonActive');
                        Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper').removeClass('rcrmDocElementAlignLeft rcrmDocElementAlignRight rcrmDocElementAlignCenter rcrmDocElementAlignJustify').addClass('rcrmDocElementAlignCenter');
                        Container.find('#rcrm_content').find('.rcrmSelected > .rcrmContentContainerHelper > .rcrmDocElementContentText').css('text-align', 'center');
                        //--------------------------------------------------------------------------------------------------------------------------------
                        Container.find('#rcrm_detail_panel .rcrm_element_valignment .rcrmButton').removeClass('rcrmButtonActive').attr('disabled', true);
                        Container.find('#rcrm_detail_panel .rcrm_element_valignment_middle').addClass('rcrmButtonActive');
                        Container.find('#rcrm_content').find('.rcrmSelected').find('> .rcrmContentContainerHelper').removeClass('rcrmDocElementVAlignTop rcrmDocElementVAlignMiddle rcrmDocElementVAlignBottom').addClass('rcrmDocElementVAlignMiddle');
                        Container.find('#rcrm_content').find('.rcrmSelected > .rcrmContentContainerHelper > .rcrmDocElementContentText').css('vertical-align', 'middle');
                    }
                    else{
                        Container.find('#rcrm_detail_panel .rcrm_element_halignment .rcrmButton').removeAttr('disabled');
                        Container.find('#rcrm_detail_panel .rcrm_element_valignment .rcrmButton').removeAttr('disabled');
                        if(elem.find('.rcrmRotate').length > 0){
                            var txt = elem.find('.rcrmRotate').text();
                            elem.find('.rcrmRotate').remove();
                            elem.find('> .rcrmContentContainerHelper > .rcrmDocElementContentText').html(txt);
                        }
                    }
                    if(elem.hasClass('rcrmTextElement')) elemObj.updateInternalSize(elem);
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmSelectImage() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_select_image_row').clone();
           

            this.update = function (fileName) {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(elem.hasClass('rcrmImageElement')){
                    $(this.html).find('.rcrmfilepicLbl').show();
                    $(this.html).find('.rcrmbgpicLbl').hide();
                }
                else {
                    $(this.html).find('.rcrmfilepicLbl').hide();
                    $(this.html).find('.rcrmbgpicLbl').show();
                }
                if(fileName != "" && fileName != undefined) {
                    $(this.html).find('.rcrm_element_select_image_filename').text(fileName);
                    $(this.html).find('.rcrm_element_select_image_filename_container').removeClass('rcrmHidden');
                }
                else{
                    $(this.html).find('.rcrm_element_select_image_filename').text("");
                    $(this.html).find('.rcrm_element_select_image_filename_container').addClass('rcrmHidden');
                }
                if((elem.length == 0) && (rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS')) $(this.html).hide();
                else if((elem.hasClass('rcrmTableTextElement') && (rcrmIsFactor)) || (elem.hasClass('rcrmTextElement') && !elem.hasClass('rcrmLinkElement')) || elem.attr('linktype') == 'text') $(this.html).hide();
                else $(this.html).show();
            }
            this.clone = function () {
                Container.find('.rcrm_element_select_image_row input').unbind('click');
                Container.find('.rcrm_element_select_image_row .rcrm_element_select_image_filename_clear').unbind('click');
                var settingElem = $(this.html);
                $(this.html).find('input').bind('click', function () {
                    show_fileManager(3, function (item, urlmode) {
                        var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                        $(item.dialogID).dialog("close");
                        if (elem.hasClass('rcrmImageElement')) {
                            if (urlmode == 'relative') elem.find('img').attr('src', item.relative_url.replace('..', $("#HFServerurl").val()));
                            else if (urlmode == 'absolute') elem.find('img').attr('src', item.url);
                            //elem.find('img').attr('src', item.url); //vagti address nesbi mizanim to daryaft file nemire aksro . bara hamin fagat motlag zadim
                            elem.find('img').attr('FileName', item.title);
                            settingElem.find('.rcrm_element_select_image_filename').text(item.title);
                            Container.find('#rcrm_detail_panel').find('.rcrm_element_img_repeat').trigger('change');
                            Container.find('#rcrm_detail_panel').find('.rcrm_img_repeat').trigger('change');
                        }
                        else if(elem.hasClass('rcrmTableTextElement')){
                            elem.css('background-image' , 'url(' + item.url + ')');
                            elem.attr('bg_filename', item.title);
                        }
                        else if(elem.hasClass('rcrmLinkElement') && elem.attr('linktype') == 'button') {
                            elem.find('.rcrmDocElementContentText').css('background-image' , 'url(' + item.url + ')');
                            elem.find('.rcrmDocElementContentText').attr('bg_filename', item.title);
                        }
                        else if(elem.length == 0) {
                            Container.find('#rcrm_document_content').css('background-image' , 'url(' + item.url + ')');
                            Container.find('#rcrm_document_content').attr('bg_filename', item.title);
                            Container.find('#rcrm_detail_panel').find('.rcrm_element_background_repeat_row').css('display', '')
                        }
                        settingElem.find('.rcrm_element_select_image_filename').text(item.title);
                        settingElem.find('.rcrm_element_select_image_filename_container').removeClass('rcrmHidden');
                        rcrmChangeHtml();
                    });
                });
                $(this.html).find('.rcrm_element_select_image_filename_clear').bind('click', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    if(elem.hasClass('rcrmImageElement')){
                        elem.find('img').attr('src', "");
                        elem.find('img').attr('FileName', "");
                        elem.find('img').attr('source', "");
                        elem.find('img').width('').height('');
                        Container.find('#rcrm_detail_panel').find('.rcrm_element_img_repeat').trigger('change');
                        Container.find('#rcrm_detail_panel').find('.rcrm_img_repeat').trigger('change');
                    }
                    else if(elem.hasClass('rcrmTableTextElement')){
                        elem.css('background-image' , '');
                        elem.attr('bg_filename', '');
                    }
                    else if(elem.hasClass('rcrmLinkElement') && elem.attr('linktype') == 'button'){
                        elem.find('.rcrmDocElementContentText').css('background-image' , '');
                        elem.find('.rcrmDocElementContentText').attr('bg_filename', '');
                    }
                    else if(elem.length == 0) {
                        Container.find('#rcrm_document_content').css('background-image' , '');
                        Container.find('#rcrm_document_content').attr('bg_filename', '');
                        Container.find('#rcrm_detail_panel').find('.rcrm_element_background_repeat_row').hide();
                    }
                    settingElem.find('.rcrm_element_select_image_filename').text("");
                    settingElem.find('.rcrm_element_select_image_filename_container').addClass('rcrmHidden');
                    Container.find('#rcrm_detail_panel').find('.rcrm_element_content').val("");
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmBackgroundRepeat() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_background_repeat_row').clone();
           

            this.update = function (position, repeat) {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(position != undefined) $(this.html).find('.rcrm_element_background_position').val(position);
                if(repeat != undefined) $(this.html).find('.rcrm_element_background_repeat').val(repeat);
                //---------------------------------------------------------------------------------------------------
                if((elem.length == 0) && (rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS')) $(this.html).hide();
                else if((elem.hasClass('rcrmTableTextElement') && (rcrmIsFactor)) || (elem.hasClass('rcrmTextElement') && !elem.hasClass('rcrmLinkElement')) || elem.attr('linktype') == 'text') $(this.html).hide();
                else if((elem.length == 0) && (Container.find('#rcrm_document_panel #rcrm_document_content').attr('bg_filename') == '' || Container.find('#rcrm_document_panel #rcrm_document_content').attr('bg_filename') == undefined)) $(this.html).hide();
                else $(this.html).show();
            }
            this.clone = function () {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                Container.find('.rcrm_element_background_position').unbind('change');
                Container.find('.rcrm_element_background_repeat').unbind('change');
                $(this.html).find('.rcrm_element_background_position').bind('change', function () {
                    if(elem.length == 0){
                        Container.find('#rcrm_document_content').css('background-position-x', $(this).val());
                        Container.find('#rcrm_document_content').attr('bg_position', $(this).val());
                    }
                    else if(elem.hasClass('rcrmTableTextElement')) {
                        elem.css('background-position-x', $(this).val());
                        elem.attr('bg_position', $(this).val());
                    }
                    else if(elem.hasClass('rcrmLinkElement') && elem.attr('linktype') == 'button'){
                        elem.find('.rcrmDocElementContentText').css('background-position-x', $(this).val());
                        elem.find('.rcrmDocElementContentText').attr('bg_position', $(this).val());
                    }
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_element_background_repeat').bind('change', function () {
                    var selector = Container.find('#rcrm_document_content');
                    if(elem.hasClass('rcrmTableTextElement')) selector = elem;
                    if(elem.hasClass('rcrmLinkElement') && elem.attr('linktype') == 'button') selector = elem.find('.rcrmDocElementContentText');
                    if($(this).val() == 'stretch') selector.css('background-repeat', 'no-repeat').css('background-size', 'cover');
                    else if($(this).val() == 'auto') selector.css('background-repeat', 'no-repeat').css('background-size', 'contain');
                    else selector.css('background-repeat', $(this).val()).css('background-size', 'unset');
                    selector.attr('bg_repeat', $(this).val());
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmRepeatedDisplayType() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_repeated_display_type_row').clone();

            this.update = function (displayType) {
                if(displayType == '' || displayType == undefined) displayType = 'inline';
                $(this.html).find('.rcrm_repeated_display_type').val(displayType);
            }
            this.clone = function () {
                Container.find('.rcrm_repeated_display_type').unbind('change');
                $(this.html).find('.rcrm_repeated_display_type').bind('change', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    var input = Container.find('#rcrm_detail_panel').find('.rcrm_element_content');

                    elem.attr('display_way', $(this).val());
                    if($(this).val() == 'colmun'){
                        var ret = input.val().replace(/#field_[\w-_()$%+]+/g , function (x) { return x + '_br' });
                        input.val(ret);
                        elemObj.content.inputText(elem , ret);
                    }
                    else {
                        var ret = input.val().replace(/_br#/g , '#');
                        input.val(ret);
                        elemObj.content.inputText(elem , ret);
                    }
                    input.trigger('keydown');
                });
                return this.html
            }
        }

        function rcrmShowFooterEndPage() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_show_footer_endpage_row').clone();
            this.switcher = null;

            this.update = function (show) {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(show == undefined) show = false;
                show = (show == 'false' || show == false) ? false : true;
                if(this.switcher != null){
                    var el = $(this.html).find('.rcrm_show_footer_endpage');
                    if($(el).is(':checked') != show) this.switcher.setPosition(true);
                }
                if(elem.attr('pos') == 'footer') $(this.html).show(); else $(this.html).hide();
            }
            this.clone = function () {
                Container.find('.rcrm_show_footer_endpage').unbind('change');
                $(this.html).find('.switchery').remove();
                var switchElem = $(this.html).find('input')[0];
                this.switcher = new Switchery(switchElem , { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: '', falseLabel: '' });

                $(this.html).find('.rcrm_show_footer_endpage').bind('change', function () {
                    Container.find('#rcrm_content').find('.rcrmSelected').attr('rcrmshow_endpage' , $(this).attr('checked'));
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmBarcodeType() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_barcode_type_row').clone();
           

            this.update = function (barcode_type) {
                if(barcode_type == '' || barcode_type == undefined) barcode_type = 'qrcode';
                $(this.html).find('.rcrm_element_barcode_type').val(barcode_type);
            }
            this.clone = function () {
                Container.find('.rcrm_element_barcode_type').unbind('change');
                $(this.html).find('.rcrm_element_barcode_type').bind('change', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    elem.attr('barcode_type', $(this).val());
                    elem.find('img').attr('src' , resources.host_name + '/pages/getFile.aspx?mode=' + $(this).val() + '&width='+ elem.width() +'&height='+ elem.height() +'&data=' + (elem.attr('barcode_data') == undefined ? '' : elem.attr('barcode_data')));
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        //table -------------------------

        function rcrmColumnRowSpan() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_column_span_row').clone();
            var htmlObj = $(this.html);
           

            this.update = function (colSpan, rowSpan) {
                if(colSpan != null) htmlObj.find('.rcrm_element_column_span_input').val(colSpan.toString());
                else htmlObj.find('.rcrm_element_column_span_input').val('1');
                if(rowSpan != null) htmlObj.find('.rcrm_element_row_span_input').val(rowSpan.toString());
                else htmlObj.find('.rcrm_element_row_span_input').val('1');
            }
            this.clone = function () {
                Container.find('.rcrm_element_column_span_input').unbind('input');
                Container.find('.rcrm_element_column_span_input').unbind('keydown');
                Container.find('.rcrm_element_row_span_input').unbind('input');
                Container.find('.rcrm_element_row_span_input').unbind('keydown');
                htmlObj.find('.rcrm_element_column_span_input').bind('input', function () {
                    var colSpan = 1;
                    if($(this).val() != "") colSpan = $(this).val();
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var tblDiv = elem.parents('.rcrmTableElement').first();
                    var tbl = tblDiv.find('> table');
                    var tblObj = rcrmFindElementInstance(tblDiv, false);
                    var merged = false;

                    if( tbl.find('.rcrmMergedTD').length > 0) { merged = true; tbl.find('> * > tr > .rcrmTableTextElement').removeClass('rcrmMergedTD') }
                    elem.attr('colspan' , colSpan);
                    if(merged) tbl.find('> :not(thead) > tr > .rcrmTableTextElement').each(function () {
                        if(rcrmRes.lang == 'fa' && ($(this).offset().left + $(this).width() < tbl.find('> thead > tr > .rcrmTableTextElement:last').offset().left) && $(this).parent().is(':visible') && $(this).parent().parent().is(':visible')) $(this).addClass('rcrmMergedTD');
                        else if(rcrmRes.lang == 'en' && ($(this).offset().left  > tbl.find('> thead > tr > .rcrmTableTextElement:last').offset().left) && $(this).parent().is(':visible') && $(this).parent().parent().is(':visible')) $(this).addClass('rcrmMergedTD');
                    });
                    try {
                        if(elem.hasClass('rcrmTableTextElement') && tblObj != null){
                            tblObj.updateInternalSize(tblDiv);
                            var elemObj = rcrmFindElementInstance(elem, false);
                            elemObj.size.update(elem.outerWidth());
                        }
                    } catch (e) {}
                    rcrmChangeHtml();
                });
                htmlObj.find('.rcrm_element_row_span_input').bind('input', function () {
                    var rowSpan = 1;
                    if($(this).val() != "" && $(this).val() != 0) rowSpan = $(this).val();
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var tblDiv = elem.parents('.rcrmTableElement').first();
                    var tbl = tblDiv.find('> table');
                    var tblObj = rcrmFindElementInstance(tblDiv, false);
                    var merged = false;

                    if( tbl.find('.rcrmMergedTD').length > 0) { merged = true; tbl.find('> * > tr > .rcrmTableTextElement').removeClass('rcrmMergedTD') }
                    elem.attr('rowspan' , rowSpan);
                    if(merged) tbl.find('> :not(thead) > tr > .rcrmTableTextElement').each(function () {
                        if(rcrmRes.lang == 'fa' && ($(this).offset().left + $(this).width() < tbl.find('> thead > tr > .rcrmTableTextElement:last').offset().left) && $(this).parent().is(':visible') && $(this).parent().parent().is(':visible')) $(this).addClass('rcrmMergedTD');
                        else if(rcrmRes.lang == 'en' &&  ($(this).offset().left > tbl.find('> thead > tr > .rcrmTableTextElement:last').offset().left) && $(this).parent().is(':visible') && $(this).parent().parent().is(':visible')) $(this).addClass('rcrmMergedTD');
                    });

                    try {
                        if(elem.hasClass('rcrmTableTextElement') && tblObj != null){
                            tblObj.updateInternalSize(tblDiv);
                            var elemObj = rcrmFindElementInstance(elem, false);
                            elemObj.size.update(null, elem.outerHeight());
                        }
                    } catch (e) {}
                    rcrmChangeHtml();
                });
                htmlObj.find('.rcrm_element_column_span_input').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });
                htmlObj.find('.rcrm_element_row_span_input').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });

                var tElem = Container.find('#rcrm_content').find('.rcrmSelected');
                htmlObj.find('.rcrm_element_row_span_input').show();
                htmlObj.find('label').text( Container.find('#rcrmSettingCloneArea .rcrm_element_column_span_row label').text());
                if(tElem.index() == 0 || tElem.parents('.rcrmTableElement').attr('tabletype') == 'repeating' || tElem.parents('tfoot').length > 0){
                    htmlObj.find('.rcrm_element_row_span_input').hide();
                    htmlObj.find('label').text(rcrmRes.merge + ' ' + rcrmRes.column);
                }
                return this.html;
            }

        }

        function rcrmTableType() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_table_type_row').clone();
            var htmlObj = $(this.html);

            this.update = function (type) {
                if(rcrmOptions.templateType != 'factor') {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    elem.attr('tabletype', 'normal');
                    Container.find('#rcrm_detail_panel .rcrm_element_table_type').val(type);
                    Container.find('#rcrm_detail_panel .rcrm_element_table_type_row').hide();
                    Container.find('#rcrm_detail_panel .rcrm_element_column_row label').text(rcrmRes.column + ' ' + rcrmRes.and + ' ' + rcrmRes.row);
                    Container.find('#rcrm_detail_panel .rcrm_element_row_input').show();
                }
                else {
                    Container.find('#rcrm_detail_panel .rcrm_element_table_type').show();
                    if(type != null && type != '') {
                        Container.find('#rcrm_detail_panel .rcrm_element_table_type').val(type);
                        if(type == 'normal') {
                            Container.find('#rcrm_detail_panel .rcrm_element_row_input').show();
                            Container.find('#rcrm_detail_panel .rcrm_element_column_row label').text(rcrmRes.column + ' ' + rcrmRes.and + ' ' + rcrmRes.row);
                        }
                        else{
                            Container.find('#rcrm_detail_panel .rcrm_element_row_input').hide()
                            Container.find('#rcrm_detail_panel .rcrm_element_column_row label').text(rcrmRes.column);
                        }
                    }
                }
            }
            this.clone = function () {
                Container.find('.rcrm_element_table_type').unbind('change');
                $(this.html).find('.rcrm_element_table_type').bind('change', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    elem.attr('tabletype', $(this).val());
                    var elemObj = rcrmFindElementInstance(elem, false);
                    try {
                        elem.removeAttr('odd-color').removeAttr('even-color') //.removeAttr('head-color');
                        elem.find('tr').css('background-color', '');
                        elemObj.head_color.update(undefined);
                        elemObj.odd_color.update(undefined);
                        elemObj.even_color.update(undefined);
                        elem.removeAttr('rcrmshow_eachpage');
                        if(rcrmIsFactor) elemObj.show_header_eachpage.update(undefined);
                    } catch (e) {}
                  
                    if($(this).val() == 'normal'){
                        Container.find('#rcrm_detail_panel .rcrm_element_column_row label').text(rcrmRes.column + ' ' + rcrmRes.and + ' ' + rcrmRes.row);
                        Container.find('#rcrm_detail_panel .rcrm_element_row_input').show();
                    }
                    else{
                        Container.find('#rcrm_detail_panel .rcrm_element_row_input').hide();
                        Container.find('#rcrm_detail_panel .rcrm_element_column_row label').text(rcrmRes.column);
                    }
                    Container.find('#rcrm_detail_panel .rcrm_element_row_input').val(elem.find('tr:not(:hidden)').length);
                    elem.find('.rcrmNormalTr').remove();
                    Container.find('#rcrm_content').find('.rcrmSelected tbody tr:first td > .rcrmContentContainerHelper > .rcrmDocElementContentText').html('');
                    elem.find('tbody').find("tr:first").show();
                    elemObj.updateInternalSize(elem);
                    rcrmChangeHtml();
                });
                return this.html
            }

        }

        function rcrmTableColumns() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_column_row').clone();
            var htmlObj = $(this.html);
           

            this.update = function (col, row) {
                if(col != null && col != 0) htmlObj.find('.rcrm_element_columns_input').val(col.toString());
                else htmlObj.find('.rcrm_element_columns_input').val('2');
                if(row != null && row != 0) htmlObj.find('.rcrm_element_row_input').val(row.toString());
                else htmlObj.find('.rcrm_element_row_input').val(Container.find('#rcrm_content').find('.rcrmSelected > table > * > tr:not(:hidden)').length);
            }
            this.clone = function () {
                Container.find('.rcrm_element_columns_input').unbind('keyup mouseup keydown');
                Container.find('.rcrm_element_row_input').unbind('keyup mouseup keydown');

                htmlObj.find('.rcrm_element_columns_input').bind('keyup mouseup', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    var tblDiv =  Container.find('#rcrm_content').find('.rcrmSelected') ,tbl = tblDiv.find('> table');
                    if(tblDiv.attr('rcrmFixedTable') == undefined) tblDiv.attr('rcrmFixedTable', false);
                    var fix = (tbl.width() + 40) > (tblDiv.parent().width() - (Number(tblDiv.css('margin-left').replace('px' ,'')) + Number(tblDiv.css('margin-right').replace('px' ,'')))) || tblDiv.attr('rcrmFixedTable') == 'true'; //+ 45 //rcrmIsEmail && (
                    //Col Create ============================================================================
                    var inputCol = 2;
                    var existCol = 2;
                    var colElem = htmlObj.find('.rcrm_element_columns_input');
                    if(colElem.val() != ""){
                        inputCol = Number(colElem.val());
                        if(inputCol > 11) { inputCol = 11; colElem.val('11'); } 
                        if(inputCol < 1) { inputCol = 1; colElem.val('1'); } 
                    }
                    else { inputCol = 2; colElem.val('2'); }
                    existCol = Container.find('#rcrm_content').find('.rcrmSelected > table > tbody > tr:first > td').length;
                    var colDiff = inputCol - existCol;
                    if(rcrmRes.lang == 'fa' && (rcrmIsFactor)) {
                        var right = elem.parent().width() - (elem.position().left + elem.outerWidth(true));
                        if(right < 0) right = 0;
                        elem.css('right', right + 'px');
                        elem.css('left', '');
                        elem.parent().css('direction' , 'rtl');
                    };
                    if(colDiff > 0){
                        var width = "width:39px";
                        var lastTdWidth = tbl.find('> thead > tr > td:last').width();
                        if(fix) width = ""; else if(rcrmIsEmail && (tbl.width() + lastTdWidth + 6) <= tblDiv.parent().width()) width = 'width:' + lastTdWidth + 'px';
                        var textElem = '<td class="rcrmTableTextElement" style="' + width + '"> <div class="rcrmContentContainerHelper rcrmDocElementAlignRight rcrmDocElementVAlignMiddle"> <div class="rcrmDocElementContentText" style="width:36px" ></div> </div> <div class="rcrmSizer rcrmSizerS ui-resizable-handle ui-resizable-s"></div> </td>';
                        for (var i = 0; i < colDiff; i++) {
                            tbl.find('> * > tr').each(function () {
                                var tr = $(this);
                                if(fix) {
                                    var parentWidth = tblDiv.parent().width() - (Number(tblDiv.css('margin-left').replace('px' ,'')) + Number(tblDiv.css('margin-right').replace('px' ,''))); //10
                                    tblDiv.css('max-width' , parentWidth);
                                    tbl.css('max-width' , parentWidth);
                                    tr.find(' > td').width('');
                                }
                                tr.append(textElem);
                                td = tr.find('> td:last');
                                if(tr.parent().is('thead')) td.append('<div class="rcrmSizer rcrmSizerE ui-resizable-handle ui-resizable-e"></div><div class="rcrmSizer rcrmSizerW ui-resizable-handle ui-resizable-w"></div>')
                                td.dblclick(function (e) {
                                    var tdElem = $(e.target);
                                    if(!tdElem.hasClass('rcrmTableTextElement')) tdElem = tdElem.parents('.rcrmTableTextElement').first();
                                    elemObj.celldblclick(tdElem); //this
                                });
                                rcrmEmailTableDroppable(td);
                            });
                            tbl.width(tbl.width() + 2);
                        }
                        elemObj.updateInternalSize(elem);
                        if(fix) Container.find('#rcrm_detail_panel .rcrm_element_width').trigger('input');
                    }
                    else if(colDiff < 0) {
                        for (var i = 0; i < (colDiff * (-1)); i++) {
                            td = tbl.find('> * > tr > td:last-child');
                            var dif = td.first().outerWidth();
                            td.remove();
                            tbl.width(tbl.outerWidth() - dif)
                        }
                        elemObj.updateInternalSize(elem);
                        if(tblDiv.attr('rcrmFixedTable') == 'true') Container.find('#rcrm_detail_panel .rcrm_element_width').trigger('input'); //rcrmIsEmail && 
                    }
                    if(rcrmRes.lang == 'fa' && (rcrmIsFactor)) {
                        elem.css('left', elem.position().left); elem.css('right', '');
                        elem.parent().css('direction' , '') 
                    }
                    Container.find('#rcrm_detail_panel').find('.rcrmButtonActive').trigger('click');
                    elem.find('> table > * > tr > .rcrmTableTextElement').css('border-color', elem.find('> table').css('border-color')).css('border-width', elem.find('> table').attr('borderwidth'));
                    elemObj.updateSetting(elem);
                    rcrmChangeHtml();
                });
                htmlObj.find('.rcrm_element_columns_input').bind('keydown', function (e){
                    if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 9) return false;
                });

                htmlObj.find('.rcrm_element_row_input').bind('keyup mouseup', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    //Row Create ==================================================================================
                    var rowElem = htmlObj.find('.rcrm_element_row_input');
                    var inputRow =  Number(rowElem.val());
                    var existRow = Container.find('#rcrm_content').find('.rcrmSelected  > table > * > tr:not(:hidden)').length;
                    if(isNaN(inputRow)) return false;

                    var minRow = elem.find('> table > tfoot > tr').hasClass('rcrmHidden') ? 1 : 2; //? 2 : 3;
                    
                    if(inputRow > 10) { inputRow = 10; rowElem.val('10') } 
                    if(inputRow < minRow) { inputRow = minRow; rowElem.val(minRow) } 

                    var rowDiff = inputRow - existRow;
                    if(rowDiff > 0){
                        for (var j = 0; j < rowDiff; j++) {
                            if(elem.find('> table > tbody > tr:first').css('display') == 'none') elem.find('> table > tbody > tr:first').css('display', '');
                            else {
                                var trElem = elem.find('> table > thead  > tr:first').clone();
                                var oddColor = trElem[0].style.backgroundColor;
                                var evenColor = elem.find('> table > tbody > tr:first')[0].style.backgroundColor;
                                trElem.addClass('rcrmNormalTr').find('> td > .rcrmContentContainerHelper > .rcrmDocElementContentText').html('').css('background-color' , 'rgba(0, 0, 0, 0)');
                                trElem.find('> td > .rcrmSizerE, > td > .rcrmSizerW').remove();
                                elem.find('> table > tbody').append(trElem);
                                elem.find('> table > tbody > tr:first').removeClass('rcrmNormalTr');
                                elem.find('> table > tbody > tr:last > td').dblclick(function (e) {
                                    var tdElem = $(e.target);
                                    if(!tdElem.hasClass('rcrmTableTextElement')) tdElem = tdElem.parents('.rcrmTableTextElement').first();
                                    elemObj.celldblclick(tdElem); //this
                                });
                                rcrmEmailTableDroppable(elem.find('> table > tbody > tr:last > .rcrmTableTextElement'));
                                elem.find('> table > tbody > tr:nth-child(even)').css('background-color', oddColor);
                                elem.find('> table > tbody > tr:nth-child(odd)').css('background-color', evenColor);
                            }
                        }
                        elemObj.updateInternalSize(elem);
                    }
                    else if(rowDiff < 0) {
                        for (var k = 0; k < (rowDiff * (-1)); k++) {
                            var tblDiv =  Container.find('#rcrm_content').find('.rcrmSelected');
                            var tbl = tblDiv.find('> table');
                            var tr = tbl.find('> tbody > tr:last');
                            if(tr.hasClass('rcrmNormalTr')) tr.remove(); else tr.hide();
                        }
                        elemObj.updateInternalSize(elem);
                    }
                    Container.find('#rcrm_detail_panel').find('.rcrmButtonActive').trigger('click');
                    rcrmChangeHtml();
                });
                htmlObj.find('.rcrm_element_row_input').bind('keydown', function (e){
                    if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 9) return false;
                });
                return this.html;
            }

        }

        function rcrmTableHeader() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_table_header_row').clone();
            this.switcher = null;

            this.update = function (hasHeader) {
                if(this.switcher != null){
                    var el = $(this.html).find('.rcrm_element_table_header_input');
                    if($(el).is(':checked') != hasHeader) this.switcher.setPosition(true);
                }
            }
            this.clone = function () {
                Container.find('.rcrm_element_table_header_row input').unbind('change');
                $(this.html).find('.switchery').remove();
                var switchElem = $(this.html).find('input')[0];
                this.switcher = new Switchery(switchElem , { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: '', falseLabel: '' });

                $(this.html).find('input').bind('change', function (a,b) {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    if ($(this).is(":checked")){
                        Container.find('#rcrm_content').find('.rcrmSelected').find('thead').find('.rcrmTableBandElement').removeClass('rcrmHidden');
                        elemObj.updateInternalSize(elem);
                    }
                    else Container.find('#rcrm_content').find('.rcrmSelected').find('thead').find('.rcrmTableBandElement').addClass('rcrmHidden');
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmTableFooter() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_table_footer_row').clone();
            this.switcher = null;

            this.update = function (hasFooter) {
                if(this.switcher != null){
                    var el = $(this.html).find('.rcrm_element_table_footer_input');
                    if($(el).is(':checked') != hasFooter) this.switcher.setPosition(true);
                }
            }
            this.clone = function () {
                Container.find('.rcrm_element_table_footer_row input').unbind('change');
                $(this.html).find('.switchery').remove();
                var switchElem = $(this.html).find('input')[0];
                this.switcher = new Switchery(switchElem , { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: '', falseLabel: '' });
               
                $(this.html).find('input').bind('change', function (a,b) {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    if ($(this).is(":checked")){
                        Container.find('#rcrm_content').find('.rcrmSelected').find('tfoot').find('.rcrmTableBandElement').removeClass('rcrmHidden'); 
                        elemObj.updateInternalSize(elem);
                    }
                    else {
                        Container.find('#rcrm_content').find('.rcrmSelected').find('tfoot').find('.rcrmTableBandElement').addClass('rcrmHidden');
                        elemObj.updateInternalSize(elem);
                    }
                    elemObj.updateSetting(elem);
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmHeaderColor() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_table_head_color_row').clone();
            var elem = this;
           

            this.update = function (headColor) {
                if(Container.find('#rcrm_content').find('.rcrmSelected').attr('tabletype') == 'repeating'){
                    if(headColor == undefined) headColor = 'rgba(0, 0, 0, 0)';
                    $(this.html).find('.rcrm_table_head_color').spectrum("set", headColor);
                    $(this.html).show();
                }
                else $(this.html).hide()
            }
            this.clone = function () {
                $(this.html).find('.sp-replacer').remove();
                $(this.html).find('.rcrm_table_head_color').spectrum({
                    cancelText: rcrmRes.cancel,
                    chooseText: rcrmRes.select,
                    showInput: true,
                    showInitial: true,
                    preferredFormat: "hex6",
                    clickoutFiresChange: true,
                    showPalette: true,
                    palette: [['#f44336', '#e91e63', '#9c27b0', '#673ab7'], ['#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'], ['#009688', '#4caf50', '#8bc34a', '#cddc39'], ['#ffeb3b', '#ffc107', '#ff9800', '#ff5722'], ['#000', '#fff', '#aaa', 'transparent']],
                    move: function (color) {
                        elem.selectHeader(color);
                    },
                    change: function(color) {
                        elem.selectHeader(color);
                        rcrmChangeHtml();
                    },
                    hide: function(color) {
                        elem.selectHeader(color);
                    }
                });
                return this.html;
            }
            this.selectHeader = function(color) {
                color = color.toRgbString();
                if(color != 'rgba(0, 0, 0, 0)' && color.indexOf('a') != -1) {
                    color = color.replace('a' , '').replace(', 0)' , '');
                    $(this.html).find('.rcrm_table_head_color').spectrum("set", color);
                }
                Container.find('#rcrm_content').find('.rcrmSelected').find('thead tr').css('background-color', color);
            }
        }

        function rcrmOddRowColor() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_table_odd_color_row').clone();
            var elem = this;
           

            this.update = function (Rowcolor) {
                if(Rowcolor == undefined) Rowcolor = 'rgba(0, 0, 0, 0)';
                $(this.html).find('.rcrm_table_odd_color').spectrum("set", Rowcolor);
            }
            this.clone = function () {
                $(this.html).find('.sp-replacer').remove();
                $(this.html).find('.rcrm_table_odd_color').spectrum({
                    cancelText: rcrmRes.cancel,
                    chooseText: rcrmRes.select,
                    showInput: true,
                    showInitial: true,
                    preferredFormat: "hex6",
                    clickoutFiresChange: true,
                    showPalette: true,
                    palette: [['#f44336', '#e91e63', '#9c27b0', '#673ab7'], ['#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'], ['#009688', '#4caf50', '#8bc34a', '#cddc39'], ['#ffeb3b', '#ffc107', '#ff9800', '#ff5722'], ['#000', '#fff', '#aaa', 'transparent']],
                    move: function (color) {
                        elem.selectOdd(color);
                    },
                    change: function(color) {
                        elem.selectOdd(color);
                        rcrmChangeHtml();
                    },
                    hide: function(color) {
                        elem.selectOdd(color);
                    }
                });
                return this.html;
            }
            this.selectOdd = function(color) {
                color = color.toRgbString();
                if(color != 'rgba(0, 0, 0, 0)' && color.indexOf('a') != -1) {
                    color = color.replace('a' , '').replace(', 0)' , '');
                    $(this.html).find('.rcrm_table_odd_color').spectrum("set", color);
                }
                Container.find('#rcrm_content').find('.rcrmSelected').attr('odd-color', color);
                if(Container.find('#rcrm_content').find('.rcrmSelected').attr('tabletype') == 'normal'){
                    Container.find('#rcrm_content').find('.rcrmSelected').find('> table > tbody > tr:nth-child(even)').css('background-color', color);
                    Container.find('#rcrm_content').find('.rcrmSelected').find('> table > thead > tr').css('background-color', color);
                }
            }
        }

        function rcrmEvenRowColor() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_table_even_color_row').clone();
            var elem = this;
           

            this.update = function (Rowcolor) {
                if(Rowcolor == undefined) Rowcolor = 'rgba(0, 0, 0, 0)'; //'rgb(255, 255, 255)';
                $(this.html).find('.rcrm_table_even_color').spectrum("set", Rowcolor);
            }
            this.clone = function () {
                $(this.html).find('.sp-replacer').remove();
                $(this.html).find('.rcrm_table_even_color').spectrum({
                    cancelText: rcrmRes.cancel,
                    chooseText: rcrmRes.select,
                    showInput: true,
                    showInitial: true,
                    preferredFormat: "hex6",
                    clickoutFiresChange: true,
                    showPalette: true,
                    palette: [['#f44336', '#e91e63', '#9c27b0', '#673ab7'], ['#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'], ['#009688', '#4caf50', '#8bc34a', '#cddc39'], ['#ffeb3b', '#ffc107', '#ff9800', '#ff5722'], ['#000', '#fff', '#aaa', 'transparent']],
                    move: function (color) {
                        elem.selectEven(color);
                    },
                    change: function(color) {
                        elem.selectEven(color);
                        rcrmChangeHtml();
                    },
                    hide: function(color) {
                        elem.selectEven(color);
                    }
                });
                return this.html;
            }
            this.selectEven = function(color) {
                color = color.toRgbString();
                if(color != 'rgba(0, 0, 0, 0)' && color.indexOf('a') != -1) {
                    color = color.replace('a' , '').replace(', 0)' , '');
                    $(this.html).find('.rcrm_table_even_color').spectrum("set", color);
                }
                Container.find('#rcrm_content').find('.rcrmSelected').attr('even-color', color);
                if(Container.find('#rcrm_content').find('.rcrmSelected').attr('tabletype') == 'normal')
                    Container.find('#rcrm_content').find('.rcrmSelected').find('> table > tbody > tr:nth-child(odd)').css('background-color', color);
            }
        }

        function rcrmTableBorder() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_table_border_row').clone();

            this.update = function () {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                $(this.html).find('button').removeClass('rcrmButtonActive');
                if(elem.hasClass('rcrmBorderTableGrid')) $(this.html).find('.rcrm_border_grid').addClass('rcrmButtonActive');
                if(elem.hasClass('rcrmBorderTableFrameRow')) $(this.html).find('.rcrm_border_frame_row').addClass('rcrmButtonActive');
                if(elem.hasClass('rcrmBorderTableFrame')) $(this.html).find('.rcrm_border_frame').addClass('rcrmButtonActive');
                if(elem.hasClass('rcrmBorderTableRow')) $(this.html).find('.rcrm_border-row').addClass('rcrmButtonActive');
                if(elem.hasClass('rcrmBorderTableNone')) $(this.html).find('.rcrm_border_none').addClass('rcrmButtonActive');

                if(elem.hasClass('rcrmBorderTableFrameLeft')) $(this.html).find('.rcrm_element_border_left').addClass('rcrmButtonActive');
                if(elem.hasClass('rcrmBorderTableFrameRight')) $(this.html).find('.rcrm_element_border_right').addClass('rcrmButtonActive');
                if(elem.hasClass('rcrmBorderTableFrameTop')) $(this.html).find('.rcrm_element_border_top').addClass('rcrmButtonActive');
                if(elem.hasClass('rcrmBorderTableFrameBottom')) $(this.html).find('.rcrm_element_border_bottom').addClass('rcrmButtonActive');
            }
            this.clone = function () {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                var elemObj = rcrmFindElementInstance(elem, false);
                var settingElem = $(this.html);

                settingElem.find('button').unbind('click');
                settingElem.find('button').bind('click', function () {
                    settingElem.find('.rcrmActionButton').removeClass('rcrmButtonActive');
                    $(this).addClass('rcrmButtonActive');
                    elem.removeClass('rcrmBorderTableGrid rcrmBorderTableFrameRow  rcrmBorderTableFrame rcrmBorderTableRow rcrmBorderTableNone rcrmBorderTableFrameLeft rcrmBorderTableFrameRight rcrmBorderTableFrameTop rcrmBorderTableFrameBottom');
                    if($(this).hasClass('rcrm_border_grid')){
                        elem.addClass('rcrmBorderTableGrid');
                        elem.find('> table').css('border-style' , 'solid');
                        elem.find('> table > * > .rcrmTableBandElement').css('border-style' , '');
                        elem.find('> table > * > tr > .rcrmTableTextElement').css('border-style' , '');
                    }
                    if($(this).hasClass('rcrm_border_frame_row')){
                        elem.addClass('rcrmBorderTableFrameRow');
                        elem.find('> table').css('border-style' , 'solid');
                        elem.find('> table > * > .rcrmTableBandElement').css('border-style' , '');
                        elem.find('> table > * > tr > .rcrmTableTextElement').css('border-style' , 'none');
                    }
                    if($(this).hasClass('rcrm_border_frame')){
                        elem.addClass('rcrmBorderTableFrame');
                        elem.find('> table').css('border-style' , 'solid');
                        elem.find('> table > * > .rcrmTableBandElement').css('border-style' , 'none');
                        elem.find('> table > * > tr > .rcrmTableTextElement').css('border-style' , 'none');
                    }
                    if($(this).hasClass('rcrm_border-row')){
                        elem.addClass('rcrmBorderTableRow');
                        elem.find('> table').css('border-style' , 'none');
                        elem.find('> table > * > .rcrmTableBandElement').css('border-style' , '');
                        elem.find('> table > * > tr > .rcrmTableTextElement').css('border-style' , 'none');
                    }
                    if($(this).hasClass('rcrm_border_none')){
                        elem.addClass('rcrmBorderTableNone');
                        elem.find('> table').css('border-style' , 'none');
                        elem.find('> table > * > .rcrmTableBandElement').css('border-style' , 'none');
                        elem.find('> table > * > tr > .rcrmTableTextElement').css('border-style' , 'none');
                    }
                    if($(this).hasClass('rcrm_element_border_left')){
                        elem.addClass('rcrmBorderTableFrameLeft');
                        elem.find('> table').css('border-style' , 'none');
                        elem.find('> table > * > .rcrmTableBandElement').css('border-style' , 'none');
                        elem.find('> table > * > tr > .rcrmTableTextElement').css('border-style' , 'none');
                        elem.find('> table').css('border-left-style' , 'solid');
                    }
                    if($(this).hasClass('rcrm_element_border_right')){
                        elem.addClass('rcrmBorderTableFrameRight');
                        elem.find('> table').css('border-style' , 'none');
                        elem.find('> table > * > .rcrmTableBandElement').css('border-style' , 'none');
                        elem.find('> table > * > tr > .rcrmTableTextElement').css('border-style' , 'none');
                        elem.find('> table').css('border-right-style' , 'solid');
                    }
                    if($(this).hasClass('rcrm_element_border_top')){
                        elem.addClass('rcrmBorderTableFrameTop');
                        elem.find('> table').css('border-style' , 'none');
                        elem.find('> table > * > .rcrmTableBandElement').css('border-style' , 'none');
                        elem.find('> table > * > tr > .rcrmTableTextElement').css('border-style' , 'none');
                        elem.find('> table').css('border-top-style' , 'solid');
                    }
                    if($(this).hasClass('rcrm_element_border_bottom')){
                        elem.addClass('rcrmBorderTableFrameBottom');
                        elem.find('> table').css('border-style' , 'none');
                        elem.find('> table > * > .rcrmTableBandElement').css('border-style' , 'none');
                        elem.find('> table > * > tr > .rcrmTableTextElement').css('border-style' , 'none');
                        elem.find('> table').css('border-bottom-style' , 'solid');
                    }
                    elemObj.updateInternalSize(elem); //dj inkaht comment beshe
                    try { elemObj.custom_css.update(elem.find('> table').attr('style')) } catch (e) {}
                    rcrmChangeHtml();
                });
                elem.find('.rcrmActionButton').removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
                return this.html
            }
        }

        function rcrmCustomCss() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_element_custom_css_row').clone();

            this.update = function (style) {
                $(this.html).hide();
                //var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                //if(rcrmIsFactor || elem.hasClass('rcrmTextElement')) $(this.html).hide();
                //else {
                //    $(this.html).show();
                //    if(style != null) $(this.html).find('.rcrm_element_custom_css').val(style);
                //    $(this.html).find('.rcrm_element_custom_css').trigger('keydown');
                //}
            }
            this.clone = function (selector) {
                Container.find('.rcrm_element_custom_css').unbind('blur');
                Container.find('.rcrm_element_custom_css').unbind('keyup');
                $(this.html).find('.rcrm_element_custom_css').bind('blur', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    selector.attr('style' , $(this).val());
                    elemObj.updateInternalSize(elem);
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_element_custom_css').bind('keydown', function () {
                    var el = this;
                    setTimeout(function () {
                        el.style.cssText= 'height:auto'
                        el.style.cssText= 'height:' + el.scrollHeight + 'px';
                    },0);
                });
                return this.html
            }
        }

        function rcrmColOrder() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_table_col_order_row').clone();
           

            this.update = function (order) {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(elem.hasClass('rcrmTextElement')) $(this.html).hide();
                if(elem.hasClass('rcrmTableTextElement')) {
                    if(elem.parent().parent().is('thead')){
                        $(this.html).show();
                        $(this.html).find('.rcrm_table_col_order').val(order.toString());
                    }
                    else $(this.html).hide();
                }
            }
            this.clone = function () {
                Container.find('.rcrm_table_col_order').unbind('input');
                Container.find('.rcrm_table_col_order').unbind('keydown');
                $(this.html).find('.rcrm_table_col_order').bind('input', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var tbl = elem.parents('.rcrmTableElement').first().find('> table');
                    if(tbl.find('> * > tr > .rcrmTableTextElement').filter(function() { return $(this).attr("colspan") > 1 }).length > 0) { RaveshUI.warningToast('' , Container.find('.rcrmCantMove').text()); $(this).val(elem.index() + 1); return false; }
                    if($(this).val() != ""){
                        if($(this).val() < 1 || $(this).val() > tbl.find('> thead > tr > td').length) $(this).val(elem.index() + 1);
                        var from = elem.index();
                        var to = Number($(this).val()) -1;
                        tbl.find('> * > tr').each(function () {
                            var cell = $(this).find('> td').eq(from).detach();
                            if($(this).find('> td').eq(to).length > 0) cell.insertBefore($(this).find('> td').eq(to));
                            else cell.insertAfter($(this).find('> td').eq(to -1));
                        });
                        rcrmChangeHtml();
                    }
                });
                $(this.html).find('.rcrm_table_col_order').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this));
                    return rcrmIsNumber(e);
                });
                return this.html
            }
        }

        function rcrmEqualCol() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_table_equal_col_row').clone();
           
            this.clone = function () {
                Container.find('.rcrm_table_equal_col').unbind('click');
                $(this.html).find('.rcrm_table_equal_col').bind('click', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    var elemObj = rcrmFindElementInstance(elem, false);
                    Container.find('#rcrm_detail_panel .rcrm_element_width').trigger('input');
                    elem.find('> table > * > tr > td:not(.rcrmMergedTD)').width('');
                    elemObj.updateInternalSize(elem);
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmGrowByAddCol() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_table_grow_addcol_row').clone();
            this.switcher = null;

            this.update = function (fixed) {
                if(fixed == undefined) fixed = false;
                fixed = (fixed == 'false' || fixed == false) ? false : true;
                if(this.switcher != null){
                    var el = $(this.html).find('.rcrm_table_grow_addcol');
                    if($(el).is(':checked') != fixed) this.switcher.setPosition(true);
                }
            }
            this.clone = function () {
                Container.find('.rcrm_table_grow_addcol').unbind('change');
                $(this.html).find('.switchery').remove();
                var switchElem = $(this.html).find('input')[0];
                this.switcher = new Switchery(switchElem , { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: '', falseLabel: '' });

                $(this.html).find('.rcrm_table_grow_addcol').bind('change', function () {
                    Container.find('#rcrm_content').find('.rcrmSelected').attr('rcrmFixedTable' , $(this).attr('checked'));
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmShowHeaderEachPage() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_show_header_eachpage_row').clone();
            this.switcher = null;

            this.update = function (show) {
                var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                if(show == undefined) show = false;
                if(Container.find('#rcrm_document_main').attr('fitpage') == 'true') { elem.removeAttr('rcrmshow_eachpage'); show = false; }
                show = (show == 'false' || show == false) ? false : true;
                if(this.switcher != null){
                    var el = $(this.html).find('.rcrm_show_header_eachpage');
                    if($(el).is(':checked') != show) this.switcher.setPosition(true);
                }
                if(elem.attr('tabletype') == 'normal' || Container.find('#rcrm_document_main').attr('fitpage') == 'true') $(this.html).hide(); else $(this.html).show();
            }
            this.clone = function () {
                Container.find('.rcrm_show_header_eachpage').unbind('change');
                $(this.html).find('.switchery').remove();
                var switchElem = $(this.html).find('input')[0];
                this.switcher = new Switchery(switchElem , { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: '', falseLabel: '' });

                $(this.html).find('.rcrm_show_header_eachpage').bind('change', function () {
                    Container.find('#rcrm_content').find('.rcrmSelected').attr('rcrmshow_eachpage' , $(this).attr('checked'));
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmDisplayType() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_struct_display_type_row').clone();
           

            this.update = function (displayType) {
                if(displayType == '' || displayType == undefined) displayType = 'block';
                $(this.html).find('.rcrm_struct_display_type').val(displayType);
            }
            this.clone = function () {
                Container.find('.rcrm_struct_display_type').unbind('change');
                $(this.html).find('.rcrm_struct_display_type').bind('change', function () {
                    var elem = Container.find('#rcrm_content').find('.rcrmSelected');
                    elem.css('display', $(this).val());
                    if($(this).val() == 'inline-block') elem.css('vertical-align', 'top'); else elem.css('vertical-align', '');
                    rcrmSetContainerHeight();
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        //page --------------------------

        function rcrmTemplateName() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_document_template_name_row').clone();


            this.update = function (tempName) {
                if(tempName != null) $(this.html).find('.rcrm_document_template_name_input').val(tempName);
            }
            this.clone = function () {
                Container.find('.rcrm_document_template_name_input').unbind('input');
                $(this.html).find('.rcrm_document_template_name_input').bind('input', function () {
                    rcrmOptions.templateName = $(this).val();
                });
                return this.html
            }
        }

        function rcrmTemplateType() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_document_template_type_row').clone();
            this.typeGroup = { "factor" : ['factor', 'sms_show', 'fax', 'Customer'] , "email" : ['EMail', 'Ticket_Save', 'Ticket_Result', 'User_Save', 'Cust_Group', 'User_support_Save' , 'support_CreateUserSupportVaFrom'], 'sms' : ['SMS', 'support_CreateUserSupportVaFromSms', 'Ticket_SMS'], 'emailtext' : ['EMail_Text', 'support_preparedText'] }
            var elem = this;

            this.update = function (type) {
                $(this.html).find('.rcrm_document_template_type').val(type);
                if (rcrmOptions.openDialog == true) $(this.html).hide();
            }
            this.clone = function () {
                Container.find('.rcrm_document_template_type').unbind('change');
                $(this.html).find('.rcrm_document_template_type').bind('change', function () {
                    if(!elem.sameType($(this).val(), rcrmOptions.templateType)) { rcrmRefreshTemplateDesign($(this).val()) }
                    else {
                        rcrmOptions.templateType = $(this).val();
                        rcrmTemplateChangeHandel();
                    }
                });
                return this.html
            }
            this.sameType = function (newType, oldType) {
                var obj = elem.typeGroup;
                var newGroup = "";
                var oldGroup = "";
                Object.keys(obj).forEach(function(key) { if(obj[key].indexOf(newType) > -1) { newGroup = key; return false } else return true });
                Object.keys(obj).forEach(function(key) { if(obj[key].indexOf(oldType) > -1) { oldGroup = key; return false } else return true });
                if(newGroup == oldGroup) return true; else return false;
            }
        }

        function rcrmEmailTextParent() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_document_emailtext_parent_row').clone();

            this.update = function (parent) {
                if(rcrmOptions.templateType != 'EMail_Text') $(this.html).hide(); else $(this.html).show();
                if(parent == null && parent == undefined) $(this.html).find('.rcrm_document_emailtext_parent').val('');
                else $(this.html).find('.rcrm_document_emailtext_parent').val(parent);
            }
            this.clone = function () {
                Container.find('.rcrm_document_emailtext_parent').unbind('change');
                $(this.html).find('.rcrm_document_emailtext_parent').bind('change', function () {
                    rcrmOptions.emailTextParent = $(this).val();
                });
                return this.html
            }
        }

        function rcrmForm() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_document_form_row').clone();

            this.update = function (formId) {
                if(rcrmOptions.templateType == 'support_CreateUserSupportVaFrom' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms'){
                    $(this.html).show();
                    if(formId == null && formId == undefined) $(this.html).find('.rcrm_document_form').val('');
                    else $(this.html).find('.rcrm_document_form').val(formId);
                }
                else { 
                    $(this.html).hide();
                    $(this.html).find('.rcrm_document_form').val('');
                }
            }
            this.clone = function () {
                Container.find('.rcrm_document_form').unbind('change');
                $(this.html).find('.rcrm_document_form').bind('change', function () {
                    rcrmOptions.custGroupId = $(this).val();
                });
                return this.html
            }
        }

        function rcrmCustomerGroup() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_document_cust_group_row').clone();

            this.update = function (custGroupId, custGroupName) {
                if(rcrmOptions.templateType == 'Cust_Group'){
                    $(this.html).show();
                    $(this.html).find('#rcrmTxtGroupCustomer').menuA({ content: $(this.html).find('#Sample_content_Customer').html() ,backLink: false });
                }else $(this.html).hide();
                if(custGroupId != '' && custGroupId != undefined && custGroupId != null && custGroupId != 0) {
                    var GrupCust_ = new Array();
                    GrupCust_.push({name : custGroupName , code : custGroupId});
                    Container.find('#rcrm_detail_panel #rcrmTxtGroupCustomer .tag-groupSelector').remove();
                    Container.find('#rcrmSettingCloneArea #rcrmTxtGroupCustomer').MultiGroupSelector('set', GrupCust_);
                    Container.find('#rcrmSettingCloneArea #rcrmTxtGroupCustomer .tag-groupSelector').appendTo(Container.find('#rcrm_detail_panel #rcrmTxtGroupCustomer'));
                    Container.find('#rcrm_detail_panel #rcrmTxtGroupCustomer .icon-times').click(function () { $(this).parents('.tag-groupSelector').first().remove(); rcrmOptions.custGroupId = ''; rcrmOptions.custGroupName = '' });
                }
            }
            this.clone = function () {
                return this.html
            }
        }

        function rcrmCustomerGroupCallback(id, name) { 
            rcrmOptions.custGroupId = id;
            rcrmOptions.custGroupName = name;
            Container.find('#rcrm_detail_panel #rcrmTxtGroupCustomer .tag-groupSelector').remove();
            Container.find('#rcrmSettingCloneArea #rcrmTxtGroupCustomer .tag-groupSelector').appendTo(Container.find('#rcrm_detail_panel #rcrmTxtGroupCustomer'));
            Container.find('#rcrm_detail_panel #rcrmTxtGroupCustomer .icon-times').click(function () {
                $(this).parents('.tag-groupSelector').first().remove();
                rcrmOptions.custGroupId = '';
                rcrmOptions.custGroupName = '';
            });
        }

        function rcrmUserGroup() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_document_user_group_row').clone();

            this.update = function (userGroupId, userGroupName) {
                if(rcrmOptions.templateType == 'EMail' || rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'fax' || rcrmOptions.templateType == 'Customer') {
                    $(this.html).show();
                    $(this.html).find('#rcrmTxtGroupUser').menuA({ content: $(this.html).find('#Sample_content_User').html() ,backLink: false });
                } else $(this.html).hide();
                if(userGroupId != '' && userGroupId != undefined && userGroupId != null && userGroupId != 0) {
                    var GrupUsers_ = new Array();
                    GrupUsers_.push({name : userGroupName , code : userGroupId});
                    Container.find('#rcrm_detail_panel #rcrmTxtGroupUser .tag-groupSelector').remove();
                    Container.find('#rcrmSettingCloneArea #rcrmTxtGroupUser').MultiGroupSelector('set', GrupUsers_);
                    Container.find('#rcrmSettingCloneArea #rcrmTxtGroupUser .tag-groupSelector').appendTo(Container.find('#rcrm_detail_panel #rcrmTxtGroupUser'));
                    Container.find('#rcrm_detail_panel #rcrmTxtGroupUser .icon-times').click(function () { $(this).parents('.tag-groupSelector').first().remove(); rcrmOptions.userGroupId = ''; rcrmOptions.userGroupName = '' });
                }
                if (rcrmOptions.openDialog == true) $(this.html).hide();
            }
            this.clone = function () {
                return this.html;
            }
        }

        function rcrmUserGroupCallback(id, name) {
            rcrmOptions.userGroupId = id;
            rcrmOptions.userGroupName = name;
            Container.find('#rcrm_detail_panel #rcrmTxtGroupUser .tag-groupSelector').remove();
            Container.find('#rcrmSettingCloneArea #rcrmTxtGroupUser .tag-groupSelector').appendTo(Container.find('#rcrm_detail_panel #rcrmTxtGroupUser'));
            Container.find('#rcrm_detail_panel #rcrmTxtGroupUser .icon-times').click(function () {
                $(this).parents('.tag-groupSelector').first().remove();
                rcrmOptions.userGroupId = '';
                rcrmOptions.userGroupName = '';
            });
        }

        function rcrmPageFormat() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_document_properties_page_row').clone();
            this.dpi = 72;

            var obj = this;
            this.update = function (width, height, format, unit) {
                if(rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText' || rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS') $(this.html).hide();
                else $(this.html).show();

                $(this.html).find('.rcrm_document_properties_page_format').val(format).show();
                $(this.html).find('.rcrm_document_properties_page_size_row').hide();
                $(this.html).find('.rcrm_document_properties_unit').val(unit);
                $(this.html).find('.rcrm_document_properties_page_width').val('');
                $(this.html).find('.rcrm_document_properties_page_height').val('');
                if(format ==  'Own'){
                    var realWidth = 0;
                    if(unit == 'px') realWidth = width;
                    else if (unit == 'mm') realWidth = obj.convert_mm_px(width, true);
                    else realWidth = obj.convert_inch_px(width, true);

                    var realHeight = 0;
                    if(unit == 'px') realHeight = height;
                    else if (unit == 'mm') realHeight = obj.convert_mm_px(height, true);
                    else realHeight = obj.convert_inch_px(height, true);

                    $(this.html).find('.rcrm_document_properties_page_size_row').show();
                    $(this.html).find('.rcrm_document_properties_page_width').val(realWidth);
                    $(this.html).find('.rcrm_document_properties_page_height').val(realHeight);
                }
                if(rcrmIsFactor) { 
                    $(this.html).find('.rcrm_document_properties_size_type').hide();
                    if(Container.find('#rcrm_document_main').attr('fitpage') == 'true') $(this.html).find('.rcrmSizeDescrib').css('display' , 'block');
                    else $(this.html).find('.rcrmSizeDescrib').hide();
                }
                else
                {
                    $(this.html).find('.rcrm_document_properties_size_type').show();
                    if(Container.find('#rcrm_document_main').hasClass('rcrmAutoPage')) {
                        $(this.html).find('.rcrm_document_properties_size_type').val('auto');
                        $(this.html).find('.rcrmSizeDescrib').css('display' , 'block');
                    }
                    else { $(this.html).find('.rcrm_document_properties_size_type').val('fix'); $(this.html).find('.rcrmSizeDescrib').hide() }
                }
            }
            this.clone = function () {
                Container.find('.rcrm_document_properties_page_format').unbind('change');
                Container.find('.rcrm_document_properties_page_width').unbind('input');
                Container.find('.rcrm_document_properties_page_width').unbind('change');
                Container.find('.rcrm_document_properties_page_width').unbind('keydown');
                Container.find('.rcrm_document_properties_page_height').unbind('change');
                Container.find('.rcrm_document_properties_page_height').unbind('keydown');
                Container.find('.rcrm_document_properties_unit').unbind('change');

                var htmlElem = $(this.html);
                $(this.html).find('.rcrm_document_properties_page_format').bind('change', function () {
                    Container.find('#rcrm_document_main').attr('Format' , $(this).val());
                    htmlElem.find('.rcrm_document_properties_page_size_row').hide();
                    htmlElem.find('.rcrm_document_properties_page_width').val('');
                    htmlElem.find('.rcrm_document_properties_page_height').val('');
                    htmlElem.find('.rcrm_document_properties_unit').val('mm');
                    Container.find('#rcrm_document_main').attr('Unit' , 'mm');
                    var orientation = Container.find('#rcrm_document_main').attr('Orientation');
                    switch ($(this).val()) {
                        case 'A4' :
                            var width = orientation == 'portrait' ? 210 : 297
                            var height = orientation == 'portrait' ? 297 : 210
                            obj.setWidth(width, 'mm');
                            obj.setHeight(height, 'mm');
                            rcrmChangeHtml();
                            break;
                        case 'A5' :
                            var width = orientation == 'portrait' ? 148 : 210
                            var height = orientation == 'portrait' ? 210 : 148
                            obj.setWidth(width, 'mm');
                            obj.setHeight(height, 'mm');
                            rcrmChangeHtml();
                            break;
                        case 'Letter' :
                            var width = orientation == 'portrait' ? 8.5 : 11
                            var height = orientation == 'portrait' ? 11 : 8.5
                            obj.setWidth(width, 'inch');
                            obj.setHeight(height, 'inch');
                            rcrmChangeHtml();
                            break;
                        default: htmlElem.find('.rcrm_document_properties_page_size_row').show(); break;
                    }
                });
                $(this.html).find('.rcrm_document_properties_page_width').bind('input', function () {
                    var width = 0;
                    if($(this).val() != ""){
                        if(rcrmIsEmail && Number($(this).val()) > Container.find('#rcrm_document_panel').width() - 2) $(this).val(Container.find('#rcrm_document_panel').width() - 2);
                        else $(this).val($(this).val().replace('.',''));
                        width = $(this).val()
                    }
                    obj.setWidth(width, Container.find('#rcrm_document_main').attr('Unit'));
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_document_properties_page_width').bind('change', function () {
                    if(rcrmIsEmail) {
                        Container.find('#rcrm_content > .rcrmDocElement').each(function myfunction() {
                            if($(this).width() + 8 > Container.find('#rcrm_document_main').width()) rcrmEmailElementsFitWidth(Container.find('#rcrm_content'), $(this));
                        });
                    }
                });
                $(this.html).find('.rcrm_document_properties_page_height').bind('change', function () {
                    var height = 0;
                    if($(this).val() != ""){
                        $(this).val($(this).val().replace('.',''));
                        height = $(this).val();
                    }
                    obj.setHeight(height, Container.find('#rcrm_document_main').attr('Unit'));
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_document_properties_page_width').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this), 'change');
                    return rcrmIsNumber(e);
                });
                $(this.html).find('.rcrm_document_properties_page_height').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this), 'change');
                    return rcrmIsNumber(e);
                });
                $(this.html).find('.rcrm_document_properties_unit').bind('change', function () {
                    Container.find('#rcrm_document_main').attr('Unit' , $(this).val());
                    var width = 0;
                    var height = 0;
                    if($(obj.html).find('.rcrm_document_properties_page_width').val() != "") width = $(obj.html).find('.rcrm_document_properties_page_width').val();
                    if($(obj.html).find('.rcrm_document_properties_page_height') != "") height = $(obj.html).find('.rcrm_document_properties_page_height').val();
                    obj.setWidth(width, Container.find('#rcrm_document_main').attr('Unit'));
                    obj.setHeight(height, Container.find('#rcrm_document_main').attr('Unit'));
                    rcrmChangeHtml();
                });
                $(this.html).find('.rcrm_document_properties_size_type').bind('change', function () {
                    if($(this).val() == 'auto') {
                        Container.find('#rcrm_document_main').removeClass('rcrmAutoPage').addClass('rcrmAutoPage');
                        //rcrmEmailFitPage();
                        RaveshUI.confirmModal(Container.find('.rcrmYes').text(), Container.find('.rcrmNo').text(), "", Container.find('.rcrmQuestionChangeToAuto').text(), function (value) {
                            if (value == true) Container.find('#rcrm_document_main .rcrmDocElement').removeClass('rcrmAutoSize').addClass('rcrmAutoSize');
                        });
                        $(obj.html).find('.rcrmSizeDescrib').css('display' , 'block');
                    }
                    else {
                        Container.find('#rcrm_document_main').removeClass('rcrmAutoPage');
                        RaveshUI.confirmModal(Container.find('.rcrmYes').text(), Container.find('.rcrmNo').text(), "", Container.find('.rcrmQuestionChangeToFix').text(), function (value) {
                            if (value == true) Container.find('#rcrm_document_main .rcrmDocElement').removeClass('rcrmAutoSize');
                        });
                        $(obj.html).find('.rcrmSizeDescrib').hide();
                    }
                    rcrmChangeHtml();
                });
                return this.html
            }
            this.setWidth = function (width, unit) {
                var pxWidth = 0;
                if(unit == 'px') pxWidth = width;
                else if (unit == 'mm') pxWidth = obj.convert_mm_px(width);
                else pxWidth = obj.convert_inch_px(width);
                Container.find('#rcrm_document_main').width(pxWidth); //.removeClass('rcrmAutoPage');
                rcrmSetContainerHeight();
            }
            this.setHeight = function (height, unit) {
                var pxHeight = 0;
                if(unit == 'px') pxHeight = height;
                else if (unit == 'mm') pxHeight = obj.convert_mm_px(height);
                else pxHeight = obj.convert_inch_px(height);
                Container.find('#rcrm_document_main').height(pxHeight);
                rcrmSetContainerHeight()
            }
            this.convert_mm_px = function (unit ,reverse) {
                if(reverse == null)
                {
                    var px = Math.round((unit * this.dpi) / 25.4);
                    return px;
                }
                else 
                {
                    var mm = Math.round((unit * 25.4) / this.dpi);
                    return mm;
                }
            }
            this.convert_inch_px = function (unit ,reverse) {
                if(reverse == null)
                {
                    var px = Math.round(unit * this.dpi);
                    return px;
                }
                else 
                {
                    var Inches = Math.round(unit / this.dpi);
                    return Inches;
                }
            }
        }

        function rcrmPageOrientation() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_document_orientation_row').clone();

            this.update = function (orientation) {
                $(this.html).find('.rcrm_document_properties_orientation').val(orientation);
            }
            this.clone = function () {
                Container.find('.rcrm_document_properties_orientation').unbind('change');
                $(this.html).find('.rcrm_document_properties_orientation').bind('change', function () {
                    Container.find('#rcrm_document_main').attr('Orientation' , $(this).val());
                    if(Container.find('#rcrm_document_main').attr('Format') != 'Own'){ 
                        var width = Container.find('#rcrm_document_main').width();
                        var height = Container.find('#rcrm_document_main').height();
                        Container.find('#rcrm_document_main').width(height).height(width);
                        rcrmSetContainerHeight()
                        rcrmChangeHtml();
                    }
                });
                return this.html
            }
        }

        function rcrmPageZoom() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_document_zoom_row').clone();
            this.clone = function () { return this.html }
        }

        function rcrmFitPage() {
            var fitElem = this;

            this.update = function (fitpage) {
                if(this.switcher != null){
                    var el = $(this.html).find('.rcrm_document_properties_fitpage');
                    if($(el).is(':checked').toString() != fitpage) this.switcher.setPosition(true);
                }
            }
            this.clone = function () {
                this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_document_fitpage_row').clone();
                this.switcher = null;
                Container.find('.rcrm_document_properties_fitpage').unbind('change');
                var switchElem = $(this.html).find('input')[0];
                this.switcher = new Switchery(switchElem , { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: '', falseLabel: '' });

                $(this.html).find('.rcrm_document_properties_fitpage').bind('change', function () {
                    Container.find('#rcrm_document_main').attr('fitpage' , $(this).is(":checked"));
                    if($(this).is(":checked")) Container.find('#rcrm_detail_panel .rcrmSizeDescrib').css('display' , 'block');
                    else Container.find('#rcrm_detail_panel .rcrmSizeDescrib').hide();
                });
                if(rcrmOptions.templateType == 'EMail_Text' || rcrmOptions.templateType == 'support_preparedText' || rcrmOptions.templateType == 'SMS' || rcrmOptions.templateType == 'support_CreateUserSupportVaFromSms' || rcrmOptions.templateType == 'Ticket_SMS') $(this.html).hide();
                else $(this.html).show();
                return this.html
            }
            this.fit = function () {
                var selector = '#rcrmOutHtml', autoPage = '.rcrmAutoPage';
                if(rcrmIsFactor) {
                    selector = '#rcrm_document_panel';
                    autoPage = '';
                    Container.find('#rcrm_document_panel').find('.rcrmDocElement').each(function () {
                        var parent = $(this).parent();
                        var left = $(this).position().left;
                        $(this).attr("pxleft", left);
                        var leftPercent = (100 * parseFloat(left / parseFloat(parent.width())));
                        $(this).css("left", leftPercent + "%");
                    }); //setPosition
                }
                
                Container.find(selector).find('.rcrmContentContainerHelper').each(function () {
                    var elem = $(this).find('> div'), autoSize = true;
                    if(rcrmIsEmail) 
                    {
                        emailElem = $(this).parents('.rcrmDocElement').first();
                        if(!emailElem.hasClass('rcrmAutoSize')) autoSize = false;
                        if(emailElem.hasClass('rcrmLinkElement') && autoSize) elem = $(this).find('> .rcrmDocElementContentText');
                        if(emailElem.hasClass('rcrmImageElement') && autoSize) {
                            elem = $(this).find('> img');
                            elem.attr('pxheight', elem.height());
                            elem.height('auto');
                            $(this).attr('pxheight', '');
                            $(this).height('auto');
                            emailElem.attr('pxheight', emailElem.height());
                            emailElem.height('auto');
                        }
                    }
                    if(elem.length > 0 && autoSize) {
                        var parent = elem.parent().parent();
                        var width = elem.width();
                        if(parent.hasClass('rcrmTextElement') || parent.hasClass('rcrmHtmlElement')) width = parent.width();
                        var percentWidth = fitElem.convertPxtoPercent(width, parent.width());
                        elem.attr("percentwidth", percentWidth + "%");
                        elem.attr("pxwidth", elem.width());
                        $(this).attr('percentwidth', '100%');

                        if(rcrmIsEmail && (parent.hasClass('rcrmTextElement') || parent.hasClass('rcrmHtmlElement'))){ //agar matn nadashte bashe = to outlook neshon nemide//chon andaze container calc dare//mikhay neshun bede in if ro bardar
                            $(this).attr('percentwidth', 'calc(100% - ' + (Number($(this).css('border-left-width').replace('px', '')) + Number($(this).css('border-right-width').replace('px', ''))) + 'px)');
                            //var borderRight = Number($(this).css('border-right-width').replace('px', ''));
                            //var borderLeft = Number($(this).css('border-left-width').replace('px', ''));
                            //elem.css('padding-right', borderRight).css('padding-left', borderLeft).css('box-sizing', 'border-box');
                        }

                        $(this).attr('pxwidth', 'auto');
                    }
                }); //setContentWidth

                Container.find(selector).find('.rcrmContentContainerHelper').each(function () {
                    var elem = $(this).parent(), autoSize = true;
                    if(rcrmIsEmail) { emailElem = $(this).parents('.rcrmDocElement').first(); if(!emailElem.hasClass('rcrmAutoSize')) autoSize = false }
                    if(elem.length > 0 && autoSize && (rcrmIsEmail || !elem.hasClass('rcrmImageElement'))){
                        var parent = elem.parent();
                        var width = elem.width();
                        elem.attr("pxwidth", width);
                        if(elem.hasClass('rcrmTableTextElement')){
                            width = elem.outerWidth() + 1;
                            elem.attr("pxwidth", elem[0].clientWidth);
                        }
                        else if(rcrmIsEmail) width = elem.outerWidth(true) + 2;
                        var percentWidth = fitElem.convertPxtoPercent(width, parent.width());
                        percentWidth = percentWidth + "%";

                        if(rcrmIsEmail && elem.hasClass('rcrmDocElement')) {
                            //percentWidth = 'calc('+ percentWidth + ' - ' + (Number(elem.css('margin-left').replace('px', '')) + Number(elem.css('margin-right').replace('px', ''))) + 'px)';
                            var marginRight = Number(elem.css('margin-right').replace('px', ''));
                            var marginLeft = Number(elem.css('margin-left').replace('px', ''));
                            elem.attr('margin-right', marginRight).attr('margin-left', marginLeft);
                            elem.css('padding-right', marginRight).css('padding-left', marginLeft).css('margin-right', '0px').css('margin-left', '0px').css('box-sizing', 'border-box');
                        }

                        elem.attr("percentwidth", percentWidth);
                    }
                }); //setDocElementWidth

                Container.find(selector).find('.rcrmTableElement').each(function () {
                    var tblElem = $(this).find('> table'), autoSize = true;
                    if(rcrmIsEmail && !$(this).hasClass('rcrmAutoSize')) autoSize = false;
                    if(autoSize) {
                        var tblParent = $(this);
                        tblElem.css('max-width' , '').attr("percentwidth", '100%');
                        tblElem.attr("pxwidth", tblElem.outerWidth(true));

                        var elem = $(this);
                        var parent = elem.parent();
                        var width = tblElem.width();
                        var border = 2;
                        if(elem.hasClass('rcrmStructElement')) border = 0;
                        if(rcrmIsEmail) width = width + border + (Number(elem.css('margin-left').replace('px', '')) + Number(elem.css('margin-right').replace('px', '')));
                        var percentWidth = fitElem.convertPxtoPercent(width, parent.width());
                        percentWidth = percentWidth + "%";
                       
                        elem.attr("percentwidth", percentWidth);
                        var pxWidth = rcrmIsEmail ? elem.width() : tblElem.width();
                        elem.attr('pxwidth', pxWidth); //'auto'

                        if(rcrmIsEmail){
                            //percentWidth = 'calc('+ percentWidth + ' - ' + (Number(elem.css('margin-left').replace('px', '')) + Number(elem.css('margin-right').replace('px', ''))) + 'px)';
                            var marginRight = Number(elem.css('margin-right').replace('px', ''));
                            var marginLeft = Number(elem.css('margin-left').replace('px', ''));
                            elem.attr('margin-right', marginRight).attr('margin-left', marginLeft);
                            elem.css('padding-right', marginRight).css('padding-left', marginLeft).css('margin-right', '0px').css('margin-left', '0px').css('box-sizing', 'border-box');
                        }

                    }
                }); //setTableWidth

                Container.find(selector).find('.rcrmLineElement').each(function () {
                    var elem = $(this), autoSize = true;
                    if(rcrmIsEmail && !$(this).hasClass('rcrmAutoSize')) autoSize = false;
                    if(autoSize) {
                        var parent = elem.parent();
                        var width = elem.width();
                        var margin = 0;
                        if(rcrmIsEmail){
                            width = elem.outerWidth(true);
                            margin = Number(elem.css('margin-left').replace('px', '')) + Number(elem.css('margin-right').replace('px', ''));
                        }
                        var percentWidth = fitElem.convertPxtoPercent(width - margin, parent.width());
                        percentWidth = percentWidth + "%";
                        elem.attr('pxwidth', elem.width());
                        //if(rcrmIsEmail) percentWidth = 'calc('+ percentWidth + ' - ' + (Number(elem.css('margin-left').replace('px', '')) + Number(elem.css('margin-right').replace('px', ''))) + 'px)';
                        elem.attr("percentwidth", percentWidth);
                    }
                }); //setLineWidth
              
                Container.find(selector).find('#rcrm_document_main' + autoPage).attr('percentwidth', '100%');
                Container.find(selector).find('#rcrm_document_main' + autoPage).attr('pxwidth', Container.find(selector).find('#rcrm_document_main' + autoPage).width());

                fitElem.replacPx_Percent();
            }
            this.convertPxtoPercent = function (width, parentWidth) {
                return (100 * parseFloat(width / parseFloat(parentWidth)));
            }
            this.replacPx_Percent = function () {
                Container.find('[percentwidth]').each(function () {
                    $(this).width($(this).attr('percentwidth'));
                    $(this).removeAttr('percentwidth');
                });
            }
        }

        function rcrmPointDistance() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_page_pointspace_row').clone();

            this.update = function (space) {
                space = space.replace('px', '');
                $(this.html).find('.rcrm_page_pointspace').val(space);
                if(Container.find('#rcrm_menu_toggle_grid').hasClass('rcrmButtonActive')) Container.find('#rcrm_detail_panel .rcrm_page_pointspace_row').show();
                else Container.find('#rcrm_detail_panel .rcrm_page_pointspace_row').hide();
            }
            this.clone = function () {
                Container.find('.rcrm_page_pointspace').unbind('change');
                $(this.html).find('.rcrm_page_pointspace').bind('change', function () {
                    rcrmPointSpace = Number($(this).val());
                    rcrmChangePointSpace();
                    rcrmChangeHtml();
                });
                return this.html
            }
        }

        function rcrmPageMargins() {
            this.html = Container.find('#rcrmSettingCloneArea').find('.rcrm_document_page_margin_row').clone();

            this.update = function (left, top, right, bottom) {
                $(this.html).find('.rcrm_document_page_margin_left').val(left);
                $(this.html).find('.rcrm_document_page_margin_top').val(top);
                $(this.html).find('.rcrm_document_page_margin_right').val(right);
                $(this.html).find('.rcrm_document_page_margin_bottom').val(bottom);
            }
            this.clone = function () {
                Container.find('.rcrm_document_page_margin_row input').unbind('change');
                Container.find('.rcrm_document_page_margin_row input').unbind('keydown');
                $(this.html).find('input').bind('change', function () {
                    var margin = 0;
                    var spin = $(this).attr('spin');
                    if($(this).val() != "") margin = $(this).val();
                    if(spin == 'top' || spin == 'left') margin = margin - 1;
                    var elem = Container.find('#rcrm_document_main');
                    elem.find('#rcrm_document_content').css(spin, margin + 'px');
                    elem.find('#rcrm_divider_margin_' + spin).css(spin, margin + 'px');
                    if(spin == 'right' || spin == 'bottom') if(margin == 0) elem.find('#rcrm_divider_margin_' + spin).hide(); else elem.find('#rcrm_divider_margin_' + spin).show();
                    rcrmChangeHtml();
                });
                $(this.html).find('input').bind('keydown', function (e){
                    rcrmTextKeyDown(e, $(this), 'change');
                    return rcrmIsNumber(e);
                });
                return this.html
            }
        }

    };

    var rcrmMethods = {
        LoadHtml: function () { },
        RefreshTemplateDesign: function () { },
        GetHtml: function () { },
        ImportFile: function () { },
        FormFieldChange: function () { }
    };

    var rcrmDefaultOptions = {
        templateId : null,
        templateName : '',
        templateType: '',
        emailTextParent: null, 
        custGroupId: '',
        userGroupId: '',
        custGroupName: '',
        userGroupName: '',
        openDialog: false,
        dialogTitle : '',
        dialogHtml : '',
        dialogParemetrs : new Array(),
        insertCallBack: null,
        updateCallBack: null,
        openDialogCallBack: function () { },
        closeDialogCallBack: function () { }
        //templateStatus : true,
    };

});
