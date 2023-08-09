var shareToEditoFAQ_;
var showAllHelpItem = false;
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var HelpOverlayClose;

var showText1;
var showText2;
var sliderHelper = function () {
    var showTextCount = 1;
    var windowsSize = function () {
        var h = $("body").height(),
            w = $("body").width();
        $("#sliderHelprt-overlay").width(w).height(h);

//(w * 2) / 4
        $("#sliderHelprt-slider").width(700).height(500).css("top", "110px").css("left", (w -700)/2);
        $(".sliderHelprt-slider-left").css("top", "360px").css("left", w / 8);
        $(".sliderHelprt-slider-right").css("top", "360px").css("right", w / 8);
    };

        $(window).resize(function () { windowsSize(); });
        var HelperHidden = function () {
            $("#sliderHelprt-overlay").hide();
            $("#sliderHelprt-slider").hide();
            $(".sliderHelprt-slider-arrow").hide();
        }
        var HelperCloseHidden = function (end_) {
            $("#sliderHelprt-overlay").show();
            $("#sliderHelprt-slider").show();
            $(".sliderHelprt-slider-arrow").show();
            if (! end_) {
                $(".sliderHelprt-slider-arrow.icon-ok ").hide();
            }
          
        }
        var showText1 = function () {
            var t = $("#sliderHelprt-slider");
            t.html("");
          

            var k4 = $('<img style="width: 300px;      z-index: 1;position: absolute;      height: auto;left: 190px;top: 22px;" src="https://raveshcrm.ir/Theme_buy/images/crm4.png" class="viewport-animated">');
            t.append(k4);
            k4.animateCSS('bounce', { speed: 500, viewport: true });

            var k2 = $('<div id="t2" style="border-radius: 0px 0px 9px 9px;visibility: visible;font-size: 36px;height: 149px;width: 690px;background-color: #ef6c00;padding: 23px 5px;bottom: 0px;text-align: center;position: absolute;"></div>');
            t.append(k2);

            var k1 = $('<div id="t1" style=" font-size: 36px;color: #fff;padding: 23px 5px; text-align: center;">خوش آمدید</div>')
            t.find("#t2").append(k1);
            k1.animateCSS('fadeIn', { speed: 500, viewport: true });

            var k3 = $('<div id="t3" style=" font-size: 25px;padding: 5px 5px; line-height: 40px;  color: rgb(255, 255, 255); font-family: BKoodakBold, B Koodak, tahoma; text-align: center;">خودتون رو برای حرکت سریع به سمت موفقیت آماده کنید</div>');
            t.find("#t2").append(k3);
            k2.animateCSS('fadeInLeftBig', { speed: 500, viewport: true, callback: function () {  } });
            k3.animateCSS('fadeInDown', { speed: 500, viewport: true });

        }
        var showText2 = function () {
            var t = $("#sliderHelprt-slider");
            t.html("");
          
            var k4 = $('<img style="width: 300px; position: absolute; height: auto;left: 210px;top: 13px;" src="https://raveshcrm.ir/Theme_buy/images/crm5.png" class="viewport-animated">');
            t.append(k4);
            k4.animateCSS('fadeInUp', { speed: 500, viewport: true });


            var k2 = $('<div id="t2" style="border-radius: 0px 0px 9px 9px;visibility: visible;font-size: 36px;height: 149px;width: 690px;background-color: #7cb342;padding: 23px 5px;bottom: 0px;text-align: center;position: absolute;"></div>');
            t.append(k2);
            var k3 = $('<div id="t3" style="font-size: 25px;padding: 36px 5px;line-height: 40px;color: #fff;font-family: BKoodakBold,B Koodak,tahoma;text-align: center;">برای حفظ ارتباط با مشتری هاتون و جذب مشتری های جدید میتونید از ابزار های مختلفی که این سیستم در اختیارتون گذاشته استفاده کنید</div>');
            t.find("#t2").append(k3);
            k2.animateCSS('bounceInDown', { speed: 500, viewport: true, callback: function () { } });
            k3.animateCSS('bounceIn', { speed: 500, viewport: true });
        }
        var showText3 = function () {
            var t = $("#sliderHelprt-slider");
            t.html("");
           
            var k4 = $('<img style="width: 336px;z-index: 0;position: absolute; height: auto;left: 195px;top: 6px;" src="https://raveshcrm.ir/Theme_buy/images/crm6.png" class="viewport-animated">');
            t.append(k4);
            k4.animateCSS('fadeInUp', { speed: 500, viewport: true });


            var k2 = $('<div id="t2" style="border-radius: 0px 0px 9px 9px;visibility: visible;font-size: 36px;height: 149px;width: 690px;background-color: #00bea4;padding: 23px 5px;bottom: 0px;text-align: center;position: absolute;"></div>');
            t.append(k2);
            var k3 = $('<div id="t3" style="font-size: 25px;padding: 36px 5px;line-height: 40px;color: #fff;font-family: BKoodakBold,B Koodak,tahoma;text-align: center;">دوست دارین با قسمت های اصلی نرم افزار آشنا بشین؟<div id="btnMainHelperShow"  class="btn-helper" style="background-color: #3F51B5;">دیدن قسمت های اصلی</div></div>');
            t.find("#t2").append(k3);
            k2.animateCSS('fadeInRightBig', {
                speed: 500, viewport: true, callback: function () {
                  
                }
            });

            k3.find("#btnMainHelperShow").click(function () {
                        var this_ = $(this);
                        if (!this_.hasClass("active")) {
                            this_.addClass("active wait");
                            //call intro 

                            var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), introId: "base1" } };
                            $.ajax({
                                type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_Tour_with_introIdService",
                                data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                                success: function (c) {
                                    this_.removeClass("active wait");
                                    var enjoyhint_instance = new EnjoyHint({
                                        onStart: function () {
                                            HelperHidden();
                                        },
                                        onEnd: function () {
                                            HelperCloseHidden(false);
                                            enjoyhint_instance.setScript("enjoyhint_script_step");
                                        },
                                        onSkip: function () {
                                            HelperCloseHidden(false);
                                            enjoyhint_instance.setScript("enjoyhint_script_step");
                                        }
                                    });
                                    enjoyhint_instance.setScript(eval(c.d.code));
                                    enjoyhint_instance.runScript();


                                }, error: function (c) {
                                    this_.removeClass("active wait");
                                }
                            });


                        }


                    });
             
        }
        var showText4 = function () {
            var t = $("#sliderHelprt-slider");
            t.html("");

            var k4 = $('<img style="width: 221px; position: absolute; height: auto;left: 254px;top: 21px;" src="https://raveshcrm.ir/Theme_buy/images/crm7.png" class="viewport-animated">');
            t.append(k4);
            k4.animateCSS('fadeInUp', { speed: 500, viewport: true });


            var k2 = $('<div id="t2" style="border-radius: 0px 0px 9px 9px;visibility: visible;font-size: 36px;height: 149px;width: 690px;background-color: #039be5;padding: 23px 5px;bottom: 0px;text-align: center;position: absolute;"></div>');
            t.append(k2);
            var k3 = $('<div id="t3" style="font-size: 25px;padding: 10px 5px;line-height: 40px;color: #fff;font-family: BKoodakBold,B Koodak,tahoma;text-align: center;direction: rtl;">ایده ای نداری از کجا شروع کنی!!!<p> می خواهی با راهنمای ایجاد مشتری شروع کنی؟</p><div  id="btnMainHelperShow2"  class="btn-helper" style="background-color: #FF9800;">راهنمای ایجاد مشتری</div></div>');
            t.find("#t2").append(k3);
            k2.animateCSS('bounceIn', {
                speed: 500, viewport: true, callback: function () {
                   
                }
            });

             k3.find("#btnMainHelperShow2").click(function () {
                        var this_ = $(this);
                        if (!this_.hasClass("active")) {
                            this_.addClass("active wait");
                            //call intro 

                            var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), introId: "NotVisiable1" } };
                            $.ajax({
                                type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_Tour_with_introIdService",
                                data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                                success: function (c) {
                                    this_.removeClass("active wait");
                                    var enjoyhint_instance = new EnjoyHint({
                                        onStart: function () {
                                            HelperHidden();
                                        },
                                        onEnd: function () {
                                            HelperCloseHidden(true);
                                            enjoyhint_instance.setScript("enjoyhint_script_step");
                                        },
                                        onSkip: function () {
                                            HelperCloseHidden(true);
                                            enjoyhint_instance.setScript("enjoyhint_script_step");
                                        }
                                    });
                                    enjoyhint_instance.setScript(eval(c.d.code));
                                    enjoyhint_instance.runScript();


                                }, error: function (c) {
                                    this_.removeClass("active wait");
                                }
                            });


                        }


                    });
            
        }
        var unBindeBtnHelp = function () {
            $("#sliderHelprt-slider").find("#btnMainHelperShow").unbind();
       //  $(".sliderHelprt-slider-arrow.done").unbind();
        }
        var sliderHelperFinsih = function () {
            unBindeBtnHelp();
            $("#sliderHelprt-overlay").remove();
            $("#sliderHelprt-slider").remove();
            $(".sliderHelprt-slider-arrow").remove();
        };
    var createSlider = function () {
        if ($("#sliderHelprt-slider").length == 0) {
            var slider_ = $('<div id="sliderHelprt-slider"></div>');
            var rightArrow = $('<div class="icon-angle-right sliderHelprt-slider-arrow sliderHelprt-slider-right "></div>');
            var leftArrow = $('<div class="icon-angle-left sliderHelprt-slider-arrow sliderHelprt-slider-left disable"></div>');
            var finishArrow = $('<div style="display:none;" class="sliderHelprt-slider-arrow sliderHelprt-slider-right icon-ok done"></div>');
            $("body").append(slider_).append(leftArrow).append(rightArrow).append(finishArrow);
            leftArrow.click(function () {
                if (!$(this).hasClass("disable")) {
                    unBindeBtnHelp();
                    if (showTextCount == 4) {
                        showText3();
                        rightArrow.show();
                        finishArrow.hide();
                        showTextCount -= 1;
                    } else if (showTextCount == 3) {
                        showText2();
                        showTextCount -= 1;
                    } else if (showTextCount == 2) {
                        showText1();
                        leftArrow.addClass("disable");

                        showTextCount -= 1;
                    }
                }

            });
            finishArrow.click(function () {
                sliderHelperFinsih();
            });
            
            rightArrow.click(function () {
                if (!$(this).hasClass("disable")) {
                    unBindeBtnHelp();
                    if (showTextCount == 1) {
                        showText2();
                        leftArrow.removeClass("disable");
                        showTextCount += 1;
                    } else if (showTextCount == 2) {
                        showText3();
                        showTextCount += 1;
                    } else if (showTextCount == 3) {
                        showText4();
                        rightArrow.hide();
                        finishArrow.show();
                        showTextCount += 1;
                    }

                }
            });
        }

        windowsSize();
        showText1();
    };

 
    var init = function () {
            if ($("#sliderHelprt-overlay").length == 0) {
                var overly_ = $('<div id="sliderHelprt-overlay" class="ui-widget-overlay" style="z-index: 1001;"></div>');
                $("body").append(overly_);
            };
     
            createSlider()
    }

    init();
   
}


$(document).ready(function () {
  //sliderHelper();
    //Create HelpBtn
    if ($(".btnHelp").length == 0) {
        $(".box .title").eq(0).append('<div class="btnHelp left" title="' + resources.help + '"><i class="fas icon-question"></i></div>');
        $('.page-utility-contain').prepend('<div class="btnHelp left page-utility-btn" title="' + resources.help + '"><i class="fas icon-question"></i></div>');
        $('.page-main-container .page-head .page-head-date').before('<div class="btnHelp page-head-date float-left th-color ravesh-link" style="cursor: pointer;" title="' + resources.help + '">' + resources.help + '</div>');
    }
    ///////////////////////////////////////////////////////////////////////////
    //Create Report Button - Start
    ///////////////////////////////////////////////////////////////////////////
    var categoryArr = [
        //داشبورد
        //{ pageName: "dashboard.aspx", category: "00" },
        //کارتابل
        { pageName: "cartabl_new.aspx", category: "01" },
        { pageName: "letter_ready.aspx", category: "01" },
        //مشتریان
        { pageName: "cus.aspx", category: "02" },
        { pageName: "design_custField.aspx", category: "02" },
        { pageName: "createProperty.aspx", category: "02" },
        { pageName: "def_group_customer.aspx", category: "02" },
        { pageName: "importCustomer.aspx", category: "02" },
        { pageName: "exportCustomer.aspx", category: "02" },
        { pageName: "ReportLogs.aspx", category: "02" },
        //{ pageName: "Def_Lists.aspx", category: "02" },
        //ایمیل
        { pageName: "create_Email.aspx", category: "03" },
        { pageName: "Email_signature.aspx", category: "03" },
        { pageName: "Email_sender.aspx", category: "03" },
        { pageName: "pop3.aspx", category: "03" },
        { pageName: "Email_receiver.aspx", category: "03" },
        { pageName: "Advertisement.aspx", category: "03" },
        { pageName: "AdvertisementReport.aspx", category: "03" },
        //پیامک
        { pageName: "managesms2.aspx", category: "04" },
        { pageName: "sms_account.aspx", category: "04" },
        { pageName: "buy_sms_online.aspx", category: "04" },
        { pageName: "SMS_sender.aspx", category: "04" },
        { pageName: "SMS_recive_search.aspx", category: "04" },
        { pageName: "sms_auto_reply.aspx", category: "04" },
        //فرم ها
        { pageName: "1load_forms2.aspx", category: "05" },
        { pageName: "1form_file.aspx", category: "05" },
        { pageName: "1form_manager.aspx", category: "05" },
        { pageName: "1form.aspx", category: "05" },
        //پشتیبانی
        { pageName: "support.aspx", category: "06" },
        { pageName: "support_user.aspx", category: "06" },
        { pageName: "Create_userSupport.aspx", category: "06" },
        //کاربران
        { pageName: "usersManagment.aspx", category: "07" },
        { pageName: "users2.aspx", category: "07" },
        { pageName: "def_user_group.aspx", category: "07" },
        { pageName: "user_log.aspx", category: "07" },
        //امکانات تلفنی
        { pageName: "fax_new.aspx", category: "08" },
        { pageName: "voice_new.aspx", category: "08" },
        { pageName: "ivruser.aspx", category: "08" },
        { pageName: "ivrserver.aspx", category: "08" },
        { pageName: "ivrservice.aspx", category: "08" },
        { pageName: "ivrviewlines.aspx", category: "08" },
        { pageName: "ivrlog.aspx", category: "08" },
        { pageName: "ivrinbox.aspx", category: "08" },
        //وضایف کاری
        { pageName: "TodoPage.aspx", category: "09" },
        { pageName: "Event.aspx", category: "09" },
        { pageName: "wf_show.aspx", category: "09" },
        { pageName: "fullcalendar.aspx", category: "09" },
        { pageName: "template_schedule.aspx", category: "09" },
        { pageName: "wf_diagramEditor.aspx", category: "09" },
        { pageName: "reminder.aspx", category: "09" },
        //حسابداری
        { pageName: "store_Kol.aspx", category: "10" },
        { pageName: "store_Moin.aspx", category: "10" },
        { pageName: "store_Tafzili.aspx", category: "10" },
        { pageName: "Store_InitialInventory.aspx", category: "10" },
        { pageName: "store_Store.aspx", category: "10" },
        { pageName: "store_Group.aspx", category: "10" },
        { pageName: "store_Product.aspx", category: "10" },
        { pageName: "Store_FactorBuy.aspx", category: "10" },
        { pageName: "Store_FactorSales.aspx", category: "10" },
        { pageName: "store_Setting.aspx", category: "10" },
        { pageName: "show_payment.aspx", category: "10" },
        { pageName: "store_productstatus.aspx", category: "10" },
        { pageName: "store_productreport.aspx", category: "10" },
        { pageName: "store_FactorReport.aspx", category: "10" },
        { pageName: "store_productreport_sale.aspx", category: "10" },
        //تنظیمات
        //فرم ها جدید
        { pageName: "FormSubmission.aspx", category: "11" },
        { pageName: "FormBuilder.aspx", category: "11" }



    ];
    var path = window.location.pathname;
    var page = path.split("/").pop();
    var c = jQuery.grep(categoryArr, function (item) {
        return (item.pageName.toString().toLowerCase() == page.toLowerCase());
    });
    if (c.length > 0) {
        if ($(".btnReport").length == 0) {
            $(".box .title").eq(0).append('<div class="btnReport left ' + resources.lang + '" title="' + resources.ReportGenerator_report + '" category="' + c[0].category + '"><i class="fas icon-pie-chart"></i></div>');
            $('.page-utility-contain').prepend('<div class="btnReport left page-utility-btn ' + resources.lang + '" title="' + resources.ReportGenerator_report + '" category="' + c[0].category + '"><i class="fas icon-pie-chart"></i></div>')
        }
        $(".btnReport").click(function () {
            if ($(this).attr("loading") == "true") {
                return false;
            }else{
            $(this).attr("loading", true);
            $(this).find("i").removeClass("icon-bar-chart").append($("<img src=\"/Themes/resources/images/movewait.gif\"/>"));
            $("#reminderPaging").hide();
            $.ajax({
                type: "POST",
                url: "/reportgenerator/Services/ReportGeneratorService.asmx/getCategoryReports_",
                data: JSON.stringify({
                    items: {
                        category: $(this).attr("category"),
                        domain: $("#HFdomain").val(),
                        user_code: $("#HFUserCode").val(),
                        codeing: $("#hfcodeing").val()
                    }
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (retObj) {

                    var listDiv = $(".divReportCategory");
                    listDiv.empty();
                    if (retObj.d == null || retObj.d.length == 0) {
                        listDiv.html(resources.notFound);
                    }
                    $.each(retObj.d, function (r, rep) {
                        var Name = '';
                        $.each(rep.Name, function (i, item) {
                            Name = $.trim(item.Value) == '' ? Name : item.Value;
                            if ((resources.lang == 'fa' && item.Name == 'فا') || item.Name == resources.lang) {
                                Name = $.trim(item.Value) == '' ? Name : item.Value;;
                                return false;
                            }
                        });
                        listDiv.append($("<div></div>").addClass("CategorizedReportItem").attr({
                            UID: rep.Id
                        }).html(Name).click(function () {
                            window.open("/reportgenerator/reportviewer.aspx?repId=" + $(this).attr("UID") + "&rnd_=" + getParameterByName("rnd_"));
                        }));
                    })
                    //$("<div></div>").append(listDiv).dialog({
                    //    modal: true,
                    //    resizable: false,
                    //    title: resources.ReportGenerator_report

                    //}).dialog("open");
                    $(".btnReport").find("i").addClass("fas icon-pie-chart").html("");
                    $(".btnReport").removeAttr("loading");
                    OpenMenuQuickBar('divReportCategory');
                    return false;
                }
            });

            }

        })
    }

    //Create Report Button - End 
    ///////////////////////////////////////////////////////////////////////////
    var HelpStorage = { faq: [], help: [], video: [], tour: [] };
    $(".btnHelp").live("click", function (event, arg1) {

        var pagename = $(this).attr('pagename') || location.pathname;

        if (arg1 != showAllHelpItem) {
            $('.help-container:[pagename=' + pagename + ']').remove();
            $('.help-overlay:[pagename=' + pagename + ']').remove();
        }

        if (arg1) {
            showAllHelpItem = true;
        } else {
            showAllHelpItem = false;
        }

       

        var open = function () {
            var cont = $('.help-container:[pagename=' + pagename + ']').show();
            var overlay = $('.help-overlay:[pagename=' + pagename + ']');
            setTimeout(function () {
                cont.addClass('expand');
                overlay.animateCSS('fadeIn');
            }, 10);
        }

        if ($('.help-container:[pagename=' + pagename + ']').length != 0) {
            if (showAllHelpItem) {
                $('.help-container:[pagename=' + pagename + ']').remove();
                $('.help-overlay:[pagename=' + pagename + ']').remove();
            } else {
                open();
                return false;
            }
           
        }

        var HelpOverlay = $('<div>').addClass('help-overlay');
        var HelpContainer = $('<div>').addClass('help-container ' + resources.direction);
        $("#content").prepend(HelpContainer).prepend(HelpOverlay.hide());

        HelpContainer.attr('pagename', pagename);
        HelpOverlay.attr('pagename', pagename);

        open();

        var showDialog = function (html) {
            if ($('.help-ravesh-dialog').length == 0) {
                $('body').append('<div class="help-ravesh-dialog" title="' + resources.help + '"><div class="box"><div class="form"><div class="fields"></div></div></div></div>');
            }
            var dialog = $('.help-ravesh-dialog');
            dialog.dialog({ width: 800, modal: true, minWidth: 650, height: 500, minHeight: 300, open: function () { openDialog($(this)); }, close: function () { dialog.empty(); } });
            dialog.html(html).dialog('option', 'position', 'center');
            dialog.append('<div class="ShareToEditor"><i class="icon-edge-miss"></i></div>');
            dialog.dialog('open');
            return dialog;
        }

        $(".ShareToEditor").live("click", function () {

            shareToEditoFAQ_.val(shareToEditoFAQ_.val() + "</br>" + $(".help-ravesh-dialog").html()).blur();

        });
        /*click overlay hide help*/
        HelpOverlayClose=HelpOverlay.click(function () {
            HelpContainer.removeClass('expand');
            setTimeout(function () { HelpContainer.hide() }, 300);
            HelpOverlay.hide();
        });

        /*create Tab*/
        var createTab = function () {
            var TabWrapper = $('<div>').addClass('help-tab-wrapper');
            var items = {
                Help: $('<i>').addClass('icon-help').attr('title', resources.help).attr('panel', 'help'),
                Video: $('<i>').addClass('icon-video').attr('title', resources.videoHelp).attr('panel', 'video'),
                FAQ: $('<i>').addClass('icon-faq').attr('title', resources.faq).attr('panel', 'faq'),
                Tour: $('<i>').addClass('icon-intro').attr('title', resources.tourHelp).attr('panel', 'tour'),
            }
            $.each(items, function () { TabWrapper.append(this); });
            HelpContainer.append(TabWrapper);
            return items;
        }
        var tabItems = createTab();

        var selectTab = function (tabitem) {
            HelpContainer.find('.help-tab-wrapper .selected').removeClass('selected');
            tabitem.addClass('selected');
            HelpContainer.find('.panel-help').hide();
            HelpContainer.find('.panel-help-' + tabitem.attr('panel')).show();
        }

        /*create panel Help---------------------------------------------------*/
        /*manager*/
        var HelpManager = function () {
            var thisMng = this;

            this.generateSection = function (panel, anim, section, group, groupTitle, groupId) {
                var container = panel.content;
                if (groupTitle) {
                    panel.wrapper.addClass('showtitle');
                    panel.title.html(groupTitle).animateCSS('fadeInDown', { speed: 300 });
                } else {
                    panel.wrapper.removeClass('showtitle');
                }
                var delay = (300 / section.length);
                if (delay < 30) delay = 30;

                /*generate group*/
                var generateGroup = function (item) {
                    var GroupItem = $('<div>').addClass('panel-help-section-item');
                    var bullet = $('<i>').addClass('icon-folder-open th-color right');
                    var title = $('<div>').addClass('title').html(item.hasOwnProperty('isBack') ? '..' : item.Name);
                    GroupItem.append(bullet).append(title);
                    container.append(GroupItem);
                    if (!item.Id_parent) item.Id_parent = 'group';
                    /*click folder*/
                    GroupItem.click(function () {
                        thisMng.get_section_into_group(panel, item.Id, function (items, anim) {
                            if (item.Id == 'group') {
                                thisMng.generateSection(panel, anim, [], items, null, item.Id);
                            } else {
                                generateGroup({ Id: item.Id_parent, Name: groupTitle, isBack: true });
                                thisMng.generateSection(panel, anim, items[1], items[0], item.Name, item.Id);
                            }
                        });
                    });
                }

                if (!group) group = [];
                $.each(group, function (i, item) {
                    if (item.Id != groupId) {
                        generateGroup(item);
                    }
                });

                /*generate section*/
                $.each(section, function (i, item) {
                    var SectionItem = $('<div>').addClass('panel-help-section-item').hide();
                    var bullet = $('<div>').addClass('bullet right');
                    var subject = $('<div>').addClass('question').html(item.Subject);

                    SectionItem.append(bullet).append(subject);
                    container.append(SectionItem);

                    if (anim) {
                        SectionItem.animateCSS('fadeInLeft', { delay: delay * i });
                    } else {
                        SectionItem.show();
                    }
                    /*click item*/
                    SectionItem.click(function () {
                        if (item.Comment) {
                            showDialog(item.Comment);
                        } else {
                            var waiting = $('<div>').addClass('wait-help');
                            var dialog = showDialog(waiting);
                            thisMng.get_section(item.Id, function (sect) {
                                waiting.remove();
                                item.Comment = sect[0].Comment;
                                dialog.html(item.Comment);
                            });
                        }
                    });
                });
            }
            this.get_group = function (panel, callback) {

                  panel.content.find('.panel-help-section-item').remove();
                        panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.help, function (s) { return s.id == 'group' });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val() } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_All_Section_help",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        panel.content.find('.panel-help-section-item').remove();
                        panel.title.hide();
                        var data = (c.d);
                        HelpStorage.help.push({ id: 'group', data: data });
                        callback(data, true);
                    }
                });
            }
            this.get_section_into_group = function (panel, id, callback) {

                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.help, function (s) { return s.id == id });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), id: id } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_all_help_into_section",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        var data = (c.d);
                        HelpStorage.help.push({ id: id, data: data });
                        callback(data, true);
                    }
                });
            }
            this.get_section_search = function (panel, search, callback) {

                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.help, function (s) { return s.id == 'src_' + search });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false, search); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), search: search } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_help_with_Search",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        var data = (c.d);
                        HelpStorage.help.push({ id: 'src_' + search, data: data });
                        callback(data, true, search);
                    }
                });
            }
            this.get_section = function (id, callback) {

                var checkInStorage = $.grep(HelpStorage.help, function (s) { return s.id == 'sec_' + id });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data); return false }

                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), id: id } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_Help_with_Id",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        var data = (c.d);
                        HelpStorage.help.push({ id: 'sec_' + id, data: data });
                        callback(data);
                    }
                });
            }
            this.get_page_section = function (panel, callback) {

                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.help, function (s) { return s.id == pagename });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), pathname: pagename } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_help_with_page",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        var data = (c.d);
                        HelpStorage.help.push({ id: pagename, data: data });
                        callback(data, true);
                    }
                });
            }
        }
        var Help_mng = new HelpManager();
        /*create ui*/
        var createPanelHelp = function () {
            var ele = {
                panel: $('<div>').addClass('panel-help panel-help-help'),
                search: $('<div>').addClass('panel-help-search'),
                wrapper: $('<div>').addClass('panel-help-wrapper panel-help-wrapper-section'),
                title: $('<div>').addClass('panel-help-title th-bgcolor'),
                content: $('<div>').addClass('panel-help-content'),
                footerAll: $('<div>').addClass('panel-help-footer'),
                footerCurrent: $('<div>').addClass('panel-help-footer')
            }
            ele.wrapper.append(ele.title).append(ele.content).append(ele.footerAll).append(ele.footerCurrent)
            ele.panel.append(ele.search).append(ele.wrapper)
            HelpContainer.append(ele.panel);

            /*search panel*/
            var txtSearch_panel = $('<div class="help-text-search"><i class="icon-search"></i><input type="text" placeholder="' + resources.search + '"></div>');
            ele.search.append(txtSearch_panel);

            /*section--------*/
            /*content panel*/
            ele.content.perfectScrollbar({
                wheelSpeed: 40,
                wheelPropagation: true,
                minScrollbarLength: 20
            });

            /*search*/
            var txtSearch = txtSearch_panel.find('input');
            var timerSearch;
            txtSearch.keyup(function (even) {
                clearTimeout(timerSearch);
                if (txtSearch.val().length > 1) {
                    timerSearch = setTimeout(function () {
                        Help_mng.get_section_search(ele, txtSearch.val(), function (items, anim, search) {
                            if (search == txtSearch.val()) {
                                ele.footerAll.show();
                                ele.footerCurrent.hide();
                                Help_mng.generateSection(ele, anim, items);
                            }
                        });
                    }, 500);
                }
            });

            /*footer panel*/
            ele.footerAll.hide()
                         .append('<span class="left">' + resources.back + '</span>')
                         .append('<i class="right icon-double-angle-' + (resources.direction == 'rtl' ? 'r' : 'l') + '"></i>')
                         .click(function () {
                             $(this).hide();
                             ele.footerCurrent.show();
                             txtSearch.val('');
                             Help_mng.get_page_section(ele, function (items, anim) {
                                 Help_mng.generateSection(ele, anim, items);
                             });
                         });

            ele.footerCurrent.show()
                             .append('<span class="right">' + resources.more + '</span>')
                             .append('<i class="left icon-double-angle-' + (resources.direction == 'rtl' ? 'l' : 'r') + '"></i>')
                             .click(function () {
                                 $(this).hide();
                                 ele.footerAll.show();
                                 Help_mng.get_group(ele, function (items, anim) {
                                     Help_mng.generateSection(ele, anim, [], items);
                                 });
                             });

            return ele;
        }
        var panelHelp = createPanelHelp();
        /*method*/
        tabItems.Help.click(function () {
            selectTab($(this));
            if (!$(this).attr('clicked')) {
                $(this).attr('clicked', true);
                
                if (showAllHelpItem) {
                    panelHelp.footerCurrent.click();
                } else {
                    Help_mng.get_page_section(panelHelp, function (items) {
                        Help_mng.generateSection(panelHelp, true, items);
                    });
                }

                
            }
        });
        /*panel Help-----------------------------------------------------------END*/


        /*create panel FAQ-----------------------------------------------------------*/
        /*manager*/
        var FAQManager = function () {
            var thisMng = this;
            var domainName = $("#HelpKnowledgeBaseDomain").val();

            this.generateSection = function (panel, anim, section, group, groupTitle, groupId) {
                var container = panel.content;
                if (groupTitle) {
                    panel.wrapper.addClass('showtitle');
                    panel.title.html(groupTitle).animateCSS('fadeInDown', { speed: 300 });
                } else {
                    panel.wrapper.removeClass('showtitle');
                }
                var delay = (300 / section.length);
                if (delay < 30) delay = 30;

                /*generate group*/
                var generateGroup = function (item) {
                    var GroupItem = $('<div>').addClass('panel-help-section-item');
                    var bullet = $('<i>').addClass('icon-folder-open th-color right');
                    var title = $('<div>').addClass('title').html(item.hasOwnProperty('isBack') ? '..' : item.Name);
                    GroupItem.append(bullet).append(title);
                    container.append(GroupItem);
                    if (!item.Id_parent) item.Id_parent = 'group';
                    /*click folder*/
                    GroupItem.click(function () {
                        thisMng.get_section_into_group(panel, item.Id, function (items, anim) {
                            if (item.Id == 'group') {
                                thisMng.generateSection(panel, anim, [], items, null, item.Id);
                            } else {
                                generateGroup({ Id: item.Id_parent, Name: groupTitle, isBack: true });
                                thisMng.generateSection(panel, anim, items[1], items[0], item.Name, item.Id);
                            }
                        });
                    });
                }

                if (!group) group = [];
                $.each(group, function (i, item) {
                    if (item.Id != groupId) {
                        generateGroup(item);
                    }
                });

                /*generate section*/
                var convertContent = function (content) {
                    content.find('img').each(function (i, img) {
                        var imgWrapper = $('<div>').addClass('help-content-img-wrapper');
                        $(img).after(imgWrapper);
                        $(img).appendTo(imgWrapper);
                        imgWrapper.append('<div class="cover"><i class="icon-zoomin"></i></div>');
                        imgWrapper.click(function (even) {
                            showDialog($(img).clone());
                            event.stopPropagation();
                        });
                    });
                };
                $.each(section, function (i, item) {
                    var SectionItem = $('<div>').addClass('panel-help-section-item').hide();
                    var bullet = $('<div>').addClass('bullet right');
                    var quest = $('<div>').addClass('question').html(item.Question);
                    var answer = $('<div>').addClass('answer').html(item.Answer || '');
                    convertContent(answer);

                    var BtnShowDialog = $('<i>').addClass('show-help-dialog icon-external-link th-color');
                    quest.append(BtnShowDialog);
                    BtnShowDialog.click(function (even) {
                        if (item.Answer) {
                            showDialog(item.Answer);
                        } else {
                            var waiting = $('<div>').addClass('wait-help');
                            var dialog = showDialog(waiting);
                            thisMng.get_section(item.Id, function (sect) {
                                waiting.remove();
                                item.Answer = sect.Answer;
                                answer.html(item.Answer);
                                convertContent(answer);
                                dialog.html(item.Answer);
                            });
                        }
                        event.stopPropagation();
                    });

                    SectionItem.append(bullet).append(quest).append(answer);
                    container.append(SectionItem);

                    if (anim) {
                        SectionItem.animateCSS('fadeInLeft', { delay: delay * i });
                    } else {
                        SectionItem.show();
                    }
                    /*click item*/
                    SectionItem.click(function () {
                        if (SectionItem.hasClass('selected')) {
                            SectionItem.removeClass('selected');
                            answer.slideUp();
                        } else {
                            container.find('.panel-help-section-item.selected .answer').slideUp();
                            container.find('.panel-help-section-item.selected').removeClass('selected');
                            SectionItem.addClass('selected');
                            answer.slideDown();

                            if (item.Answer) {
                                answer.slideDown();
                            } else {
                                var waiting = $('<div>').addClass('wait-help');
                                answer.append(waiting);
                                answer.slideDown();
                                thisMng.get_section(item.Id, function (sect) {
                                    waiting.remove();
                                    item.Answer = sect.Answer;
                                    answer.html(item.Answer);
                                    convertContent(answer);
                                });
                            }
                        }
                    });
                });
            }
            this.get_group = function (panel, callback) {

                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.faq, function (s) { return s.id == 'group' });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), domainName: domainName } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_All_Section_Knowledge",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        var data = JSON.parse(c.d);
                        HelpStorage.faq.push({ id: 'group', data: data });
                        callback(data, true);
                    }
                });
            }
            this.get_section_into_group = function (panel, id, callback) {

                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.faq, function (s) { return s.id == id });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), domainName: domainName, id: id } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_all_Knowledge_into_section",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        var data = JSON.parse(c.d);
                        HelpStorage.faq.push({ id: id, data: data });
                        callback(data, true);
                    }
                });
            }
            this.get_section_search = function (panel, search, callback) {

                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.faq, function (s) { return s.id == 'src_' + search });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false, search); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), domainName: domainName, search: search } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_Knowledge_with_search",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        var data = JSON.parse(c.d);
                        HelpStorage.faq.push({ id: 'src_' + search, data: data });
                        callback(data, true, search);
                    }
                });
            }
            this.get_section = function (id, callback) {

                var checkInStorage = $.grep(HelpStorage.faq, function (s) { return s.id == 'sec_' + id });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data); return false }

                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), domainName: domainName, id: id } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_Knowledge_with_Id",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        var data = JSON.parse(c.d);
                        HelpStorage.faq.push({ id: 'sec_' + id, data: data });
                        callback(data);
                    }
                });
            }
            this.get_page_section = function (panel, callback) {

                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.faq, function (s) { return s.id == pagename });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), domainName: domainName, pathname: pagename } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_Knowledge_with_page",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        var data = JSON.parse(c.d);
                        HelpStorage.faq.push({ id: pagename, data: data });
                        callback(data, true);
                    }
                });
            }
        }
        var FAQ_mng = new FAQManager();
        /*create ui*/
        var createPanelFAQ = function () {
            var ele = {
                panel: $('<div>').addClass('panel-help panel-help-faq'),
                search: $('<div>').addClass('panel-help-search'),
                wrapper: $('<div>').addClass('panel-help-wrapper panel-help-wrapper-section'),
                title: $('<div>').addClass('panel-help-title th-bgcolor'),
                content: $('<div>').addClass('panel-help-content'),
                footerAll: $('<div>').addClass('panel-help-footer'),
                footerCurrent: $('<div>').addClass('panel-help-footer')
            }
            ele.wrapper.append(ele.title).append(ele.content).append(ele.footerAll).append(ele.footerCurrent)
            ele.panel.append(ele.search).append(ele.wrapper)
            HelpContainer.append(ele.panel);

            /*search panel*/
            var txtSearch_panel = $('<div class="help-text-search"><i class="icon-search"></i><input type="text" placeholder="' + resources.search + '"></div>');
            ele.search.append(txtSearch_panel);

            /*section--------*/
            /*content panel*/
            ele.content.perfectScrollbar({
                wheelSpeed: 40,
                wheelPropagation: true,
                minScrollbarLength: 20
            });

            /*search*/
            var txtSearch = txtSearch_panel.find('input');
            var timerSearch;
            txtSearch.keyup(function (even) {
                clearTimeout(timerSearch);
                if (txtSearch.val().length > 1) {
                    timerSearch = setTimeout(function () {
                        FAQ_mng.get_section_search(ele, txtSearch.val(), function (items, anim, search) {
                            if (search == txtSearch.val()) {
                                ele.footerAll.show();
                                ele.footerCurrent.hide();
                                FAQ_mng.generateSection(ele, anim, items);
                            }
                        });
                    }, 500);
                }
            });

            /*footer panel*/
            ele.footerAll.hide()
                         .append('<span class="left">' + resources.back + '</span>')
                         .append('<i class="right icon-double-angle-' + (resources.direction == 'rtl' ? 'r' : 'l') + '"></i>')
                         .click(function () {
                             $(this).hide();
                             ele.footerCurrent.show();
                             txtSearch.val('');
                             FAQ_mng.get_page_section(ele, function (items, anim) {
                                 FAQ_mng.generateSection(ele, anim, items);
                             });
                         });

            ele.footerCurrent.show()
                             .append('<span class="right">' + resources.more + '</span>')
                             .append('<i class="left icon-double-angle-' + (resources.direction == 'rtl' ? 'l' : 'r') + '"></i>')
                             .click(function () {
                                 $(this).hide();
                                 ele.footerAll.show();
                                 FAQ_mng.get_group(ele, function (items, anim) {
                                     FAQ_mng.generateSection(ele, anim, [], items);
                                 });
                             });

            return ele;
        }
        var panelFAQ = createPanelFAQ();
        /*method*/
        tabItems.FAQ.click(function () {
            selectTab($(this));
            if (!$(this).attr('clicked')) {
                $(this).attr('clicked', true);

                if (showAllHelpItem) {
                    panelFAQ.footerCurrent.click();
                } else {
                    FAQ_mng.get_page_section(panelFAQ, function (items) {
                        FAQ_mng.generateSection(panelFAQ, true, items);
                    });
                };
            }
        });
        /*panel FAQ-----------------------------------------------------------END*/

        /*create panel Video---------------------------------------------------*/
        /*manager*/
        var VideoManager = function () {
            var thisMng = this;

            this.generateSection = function (panel, anim, section, group, groupTitle) {
                var container = panel.content;
                if (groupTitle) {
                    panel.wrapper.addClass('showtitle');
                    panel.title.html(groupTitle).animateCSS('fadeInDown', { speed: 300 });
                } else {
                    panel.wrapper.removeClass('showtitle');
                }
                var delay = (300 / section.length);
                if (delay < 30) delay = 30;

                /*generate group*/
                var generateGroup = function (item) {
                    var GroupItem = $('<div>').addClass('panel-help-section-item');
                    var bullet = $('<i>').addClass('icon-folder-open th-color right');
                    var title = $('<div>').addClass('title').html(item.hasOwnProperty('isBack') ? '..' : item.Name);
                    GroupItem.append(bullet).append(title);
                    container.append(GroupItem);
                    if (!item.Id_parent) item.Id_parent = 'group';
                    /*click folder*/
                    GroupItem.click(function () {
                        thisMng.get_section(panel, item.Id, function (items, anim) {
                            if (item.Id == 'group') {
                                thisMng.generateSection(panel, anim, [], items);
                            } else {
                                generateGroup({ Id: item.Id_parent, Name: groupTitle, isBack: true });
                                thisMng.generateSection(panel, anim, items, [], item.Name);
                            }
                        });
                    });
                }

                if (!group) group = [];
                $.each(group, function (i, item) {
                    generateGroup(item);
                });

                /*generate section*/
                $.each(section, function (i, item) {
                    var SectionItem = $('<div>').addClass('panel-help-section-item');
                    var bullet = $('<div>').addClass('bullet right');
                    var title = $('<div>').addClass('question').html(item.title);

                    SectionItem.append(bullet).append(title);
                    container.append(SectionItem);

                    var videoImg = $('<div>').addClass('help-video-screen');
                    videoImg.append('<img src="' + item.picture + '" title="' + item.title + '" alt="' + item.title + '"/>');
                    var videoPlay = $('<div>').addClass('help-video-play');
                    videoImg.append(videoPlay.hide())
                    SectionItem.append(videoImg);

                    if (anim) {
                        videoImg.css('visibility', 'hidden');
                        videoImg.animateCSS('flipInX', {
                            delay: 500 * i,
                            speed: 500,
                            callback: function () {
                                videoPlay.animateCSS('zoomIn');
                            }
                        });
                    } else {
                        videoPlay.animateCSS('zoomIn', { delay: 500 * i, speed: 500 });
                    }

                    /*click item*/
                    SectionItem.click(function () {
                        var dialogplay = $('<div>').addClass('dialog-help-video');
                        dialogplay.append('<video width="570" height="430" controls>' +
                                            '<source src="' + item.filename + '" type="video/mp4">' +
                                          '</video>');
                        showDialog(dialogplay);
                    });
                });
            }
            this.get_group = function (panel, callback) {

                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.video, function (s) { return s.id == 'group' });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/get_videos_group",
                    data: JSON.stringify({}), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        var data = [];
                        if (c.d[0] == 'success') {
                            data = c.d[1];
                        }
                        HelpStorage.video.push({ id: 'group', data: data });
                        callback(data, true);
                    }
                });
            }
            this.get_section = function (panel, id, callback) {
                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.video, function (s) { return s.id == id });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/get_videos",
                    data: JSON.stringify({ id: id }), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        var data = [];
                        if (c.d[0] == 'success') {
                            data = c.d[1];
                        }
                        HelpStorage.video.push({ id: id, data: data });
                        callback(data, true);
                    }
                });
            }
        }
        var Video_mng = new VideoManager();

        /*create ui*/
        var createPanelVideo = function () {
            var ele = {
                panel: $('<div>').addClass('panel-help panel-help-video'),
                wrapper: $('<div>').addClass('panel-help-wrapper panel-help-wrapper-section'),
                title: $('<div>').addClass('panel-help-title th-bgcolor'),
                content: $('<div>').addClass('panel-help-content'),
                footerAll: $('<div>').addClass('panel-help-footer'),
                footerCurrent: $('<div>').addClass('panel-help-footer')
            }
            ele.wrapper.append(ele.title).append(ele.content).append(ele.footerAll).append(ele.footerCurrent)
            ele.panel.append(ele.wrapper)
            HelpContainer.append(ele.panel);

            /*section--------*/
            /*content panel*/
            ele.content.perfectScrollbar({
                wheelSpeed: 40,
                wheelPropagation: true,
                minScrollbarLength: 20
            });

            /*footer panel*/
            ele.footerAll.hide()
                         .append('<span class="left">' + resources.back + '</span>')
                         .append('<i class="right icon-double-angle-' + (resources.direction == 'rtl' ? 'r' : 'l') + '"></i>')
                         .click(function () {
                             $(this).hide();
                             ele.footerCurrent.show();
                             Video_mng.get_section(ele, pagename, function (items, anim) {
                                 Video_mng.generateSection(ele, anim, items);
                             });
                         });

            ele.footerCurrent.show()
                             .append('<span class="right">' + resources.more + '</span>')
                             .append('<i class="left icon-double-angle-' + (resources.direction == 'rtl' ? 'l' : 'r') + '"></i>')
                             .click(function () {
                                 $(this).hide();
                                 ele.footerAll.show();
                                 Video_mng.get_group(ele, function (items, anim) {
                                     Video_mng.generateSection(ele, anim, [], items);
                                 });
                             });

            return ele;
        }
        var panelVideo = createPanelVideo();
        /*method*/
        tabItems.Video.click(function () {
            selectTab($(this));
            if (!$(this).attr('clicked')) {
                $(this).attr('clicked', true);
                if (showAllHelpItem) {
                    panelVideo.footerCurrent.click();
                } else {
                    Video_mng.get_section(panelVideo, pagename, function (items) {
                        Video_mng.generateSection(panelVideo, true, items);
                    });
                };
            }
        });
        /*panel Video-----------------------------------------------------------END*/


        /*create panel Tour-----------------------------------------------------------*/
        /*manager*/
        var TourManager = function () {
            var thisMng = this;
            var domainName = $("#HelpKnowledgeBaseDomain").val();

            this.generateSection = function (panel, anim, section, group, groupTitle, groupId) {
                var container = panel.content;
                if (groupTitle) {
                    panel.wrapper.addClass('showtitle');
                    panel.title.html(groupTitle).animateCSS('fadeInDown', { speed: 300 });
                } else {
                    panel.wrapper.removeClass('showtitle');
                }
                var delay = (300 / section.length);
                if (delay < 30) delay = 30;

                /*generate group*/
                var generateGroup = function (item) {
                    var GroupItem = $('<div>').addClass('panel-help-section-item panel-help-section-section ');
                    var bullet = $('<i>').addClass('icon-folder-open th-color right ');
                    var title = $('<div>').addClass('title').html(item.hasOwnProperty('isBack') ? '..' : item.Name);
                    GroupItem.append(bullet).append(title);
                    container.append(GroupItem);
                    if (!item.Id_parent) item.Id_parent = 'group';
                    /*click folder*/
                    GroupItem.click(function () {
                        thisMng.get_section_into_group(panel, item.Id, function (items, anim) {
                            if (item.Id == 'group') {
                                thisMng.generateSection(panel, anim, [], items, null, item.Id);
                            } else {
                                generateGroup({ Id: item.Id_parent, Name: groupTitle, isBack: true });
                                thisMng.generateSection(panel, anim, items, [item], item.Name, item.Id);
                            }
                        });
                    });
                }

                if (!group) group = [];
                $.each(group, function (i, item) {
                    if (item.Id != groupId) {
                        generateGroup(item);
                    }
                });


                $.each(section, function (i, item) {
                    var SectionItem = $('<div>').addClass('panel-help-section-item').hide();
                    var bullet = $('<div>').addClass('bullet right');
                    var title = $('<div>').addClass('title').html(item.title);
                    var code = item.code;
                    var path_ = item.path.replace("#RND#", $("#HFRnd").val());
                    
                    SectionItem.attr("path", path_).attr("introId", item.introId);


                    SectionItem.append(bullet).append(title);
                    container.append(SectionItem);

                    if (anim) {
                        SectionItem.animateCSS('fadeInLeft', { delay: delay * i });
                    } else {
                        SectionItem.show();
                    }
                    /*click item*/
                    SectionItem.click(function () {
                        if (SectionItem.attr("path") == location.pathname + location.search) {
                            //run Script
                            var code_ = $.grep(HelpStorage.tour[0].data, function (s) { return s.introId == SectionItem.attr("introId") })[0].code;
                            HelpOverlayClose.click();
                            enjoyhint_instance = new EnjoyHint({
                                onEnd: function () {
                                    enjoyhint_instance.setScript("enjoyhint_script_step");/*bara inke error bede  bindig ha bere*/
                                },
                                onSkip: function () {
                                    enjoyhint_instance.setScript("enjoyhint_script_step");/*bara inke error bede  bindig ha bere*/
                                }
                            });
                            enjoyhint_instance.setScript(eval(code_));
                            enjoyhint_instance.runScript();

                        } else {
                            // redirect page
                            Tour_mng.redirectPage(SectionItem.attr("path"), SectionItem.attr("introId"), panel);
                            
                        }
                        
                    });
                });
            }
            this.get_group = function (panel, callback) {

                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.tour, function (s) { return s.id == 'group' });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), domainName: domainName } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_All_Section_Tour",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        panel.content.find('.panel-help-section-item').remove();
                        panel.title.hide();

                        var data = [];
                        if (c.d[0] == 'success') {
                            data = c.d[1];
                        }

                        HelpStorage.tour.push({ id: 'group', data: data });
                        callback(data, true);
                    }
                });
            }
            this.get_section_into_group = function (panel, id, callback) {

                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.tour, function (s) { return s.id == id });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), domainName: domainName, id: id } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_all_Tour_into_section",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        var data = [];
                        if (c.d[0] == 'success') {
                            data = c.d[1];
                        }
                        HelpStorage.tour.push({ id: id, data: data });
                        callback(data, true);
                    }
                });
            }
            this.get_section_search = function (panel, search, callback) {

                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.tour, function (s) { return s.id == 'src_' + search });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false, search); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), domainName: domainName, search: search } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_Tour_with_search",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        var data = [];
                        if (c.d[0] == 'success') {
                            data = c.d[1];
                        }
                        HelpStorage.tour.push({ id: 'src_' + search, data: data });
                        callback(data, true, search);
                    }
                });
            }

            this.get_page_section = function (panel, callback) {

                panel.content.find('.panel-help-section-item').remove();
                panel.title.hide();

                var checkInStorage = $.grep(HelpStorage.tour, function (s) { return s.id == pagename });
                if (checkInStorage.length > 0) { callback(checkInStorage[0].data, false); return false }

                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), domainName: domainName, pathname: pagename } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/Call_get_Tour_with_page",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        var data = [];
                        if (c.d[0] == 'success') {
                            data = c.d[1];
                        }
                        HelpStorage.tour.push({ id: pagename, data: data });
                        callback(data, true);
                    }
                });
            }

            this.redirectPage = function (redirectPage_,introId_, panel, callback) {

                var redirectPage__ = redirectPage_;
                var waiting = $('<div>').addClass('wait-help');
                panel.content.append(waiting);
                var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), domainName: domainName, redirectPage: redirectPage_, introId: introId_ } };
                $.ajax({
                    type: "POST", url: "../WebServices/HelpCrmFarsicom.asmx/redirectPageSetSession_",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        waiting.remove();
                        if (c.d == 'success') {
                            location.href = redirectPage__;
                        }
                    }
                });
            }
        }
        var Tour_mng = new TourManager();
        /*create ui*/
        var createPanelTour = function () {
            var ele = {
                panel: $('<div>').addClass('panel-help panel-help-tour'),
                search: $('<div>').addClass('panel-help-search'),
                wrapper: $('<div>').addClass('panel-help-wrapper panel-help-wrapper-section'),
                title: $('<div>').addClass('panel-help-title th-bgcolor'),
                content: $('<div>').addClass('panel-help-content'),
                footerAll: $('<div>').addClass('panel-help-footer'),
                footerCurrent: $('<div>').addClass('panel-help-footer panel-help-footer-Current')
            }
            ele.wrapper.append(ele.title).append(ele.content).append(ele.footerAll).append(ele.footerCurrent)
            ele.panel.append(ele.search).append(ele.wrapper)
            HelpContainer.append(ele.panel);

            /*search panel*/
            var txtSearch_panel = $('<div class="help-text-search"><i class="icon-search"></i><input type="text" placeholder="' + resources.search + '"></div>');
            ele.search.append(txtSearch_panel);

            /*section--------*/
            /*content panel*/
            ele.content.perfectScrollbar({
                wheelSpeed: 40,
                wheelPropagation: true,
                minScrollbarLength: 20
            });

            /*search*/
            var txtSearch = txtSearch_panel.find('input');
            var timerSearch;
            txtSearch.keyup(function (even) {
                clearTimeout(timerSearch);
                if (txtSearch.val().length > 1) {
                    timerSearch = setTimeout(function () {
                        Tour_mng.get_section_search(ele, txtSearch.val(), function (items, anim, search) {
                            if (search == txtSearch.val()) {
                                ele.footerAll.show();
                                ele.footerCurrent.hide();
                                Tour_mng.generateSection(ele, anim, items);
                            }
                        });
                    }, 500);
                }
            });

            /*footer panel*/
            ele.footerAll.hide()
                         .append('<span class="left">' + resources.back + '</span>')
                         .append('<i class="right icon-double-angle-' + (resources.direction == 'rtl' ? 'r' : 'l') + '"></i>')
                         .click(function () {
                             $(this).hide();
                             ele.footerCurrent.show();
                             txtSearch.val('');
                             Tour_mng.get_page_section(ele, function (items, anim) {
                                 Tour_mng.generateSection(ele, anim, items);
                             });
                         });

            ele.footerCurrent.show()
                             .append('<span class="right">' + resources.more + '</span>')
                             .append('<i class="left icon-double-angle-' + (resources.direction == 'rtl' ? 'l' : 'r') + '"></i>')
                             .click(function () {
                                 $(this).hide();
                                 ele.footerAll.show();
                                 Tour_mng.get_group(ele, function (items, anim) {
                                     Tour_mng.generateSection(ele, anim, [], items);
                                 });
                             });

            return ele;
        }
        var panelTour = createPanelTour();
        /*method*/
        tabItems.Tour.click(function () {
            selectTab($(this));
            if (!$(this).attr('clicked')) {
                $(this).attr('clicked', true);
                if (showAllHelpItem) {
                    panelTour.footerCurrent.click();
                } else {
                    Tour_mng.get_page_section(panelTour, function (items) {
                        Tour_mng.generateSection(panelTour, true, items);
                    });
                }
            }
        });
        /*panel Tour-----------------------------------------------------------END*/


        /*Initial*/
       tabItems.Help.click();

        tabItems.Help.animateCSS('pulse', { delay: 400, speed: 400 });
        panelHelp.search.animateCSS('fadeInDownBig');
        if (showAllHelpItem == false) {
            panelHelp.footerCurrent.animateCSS('fadeInUpBig');
        }
       

    });

});