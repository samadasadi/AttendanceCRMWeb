  /* path to the stylesheets for the color picker */
var style_path = "resources/css/colors";
var defaultpicture = '../themes/resources/images/noimage.jpg';
$(document).ready(function () {
   

    $("#dialog_reminder_create").dialog({
        bgiframe: true,
        modal: true,
        autoOpen: false,
        width: 720,
        height: 550,
        open: function (event, ui) {

            $('#div_dialog_reminder_create').html("");
            $("#dialog_reminder_create").mask("...");
            var e = {};
            e.control = '~/controls/reminder_uc.ascx';
            e.Code = "0";
            e.CustomerCode = "0";
            e.Mode = 0;
            $.ajax({
                type: "POST",
                url: "../pages/server_load_usercontrol.aspx/Get_usercontroler_reminder",
                data: JSON.stringify(e),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (c) {
                    $('#div_dialog_reminder_create').html(c.d);
                    $("#dialog_reminder_create").unmask();

                    $('.DivEditorRem').show();
                    Ed_detail_UcRem[0].disable(false).refresh();
                }
            });

        },
        close: function (event, ui) { $('.positionHelper').hide(); },
        drag: function (event, ui) {
            $('.positionHelper').css("left", $('#hierarchybreadcrumb21').offset().left + 'px');
            $('.positionHelper').css("top", $('#hierarchybreadcrumb21').offset().top + 'px');
        },
        dragStop: function (event, ui) {
            $('.positionHelper').css("left", $('#hierarchybreadcrumb21').offset().left + 'px');
            $('.positionHelper').css("top", $('#hierarchybreadcrumb21').offset().top + 'px');
        }
    });
    /*********/
    /* messages fade away when dismiss is clicked */
    $(".message > .text > .dismiss > i").live("click", function (event) {
        var value = $(this).parents(".message").fadeOut('slow', function () { });

        return false;
    });

    /* color picker */
    $("#colors-switcher > a").click(function () {
        var style = $("#color");
        style.attr("href", "../Themes/" + style_path + "/" + $(this).attr("title").toLowerCase() + ".css");
        $('#ctl00_HDColor')[0].value = $(this).attr("title").toLowerCase();
        var strCookieLangCrm="";
        $.removeCookie('mylangCRM');
        $.each($.cookie("mylangCRM").split("&"), function (index, value) {
            if (strCookieLangCrm != "") { strCookieLangCrm += "&"; }
            if (value.indexOf("color") != -1) {
                strCookieLangCrm += "color=" + $('#ctl00_HDColor')[0].value;
            } else {
                strCookieLangCrm += value;
            }

        });
     
        $.cookie("mylangCRM", strCookieLangCrm , { expires: 365, path: '/' });
        
        return false;
    });



    $(".page-sidebar-closed .Search_quick .icon-search").live('click', function () {
        $(this).parent().addClass("open");
        $(this).parent().append('<i class="icon-times closeSearch_quick"></i>');
    });
    $(".page-sidebar-closed .Search_quick .closeSearch_quick").live('click', function () {
        $(this).parent().removeClass("open");
        $(this).remove();
        $(".page-sidebar-closed .Search_quick input").val("");
    });



    $("#menu li[class~=collapsible]").click(function () {
        var element = $(this);

        element.children("a:first-child").each(function () {
            var child = $(this);

            if (child.attr("class") == "plus") {
                child.attr("class", "minus");
            } else {
                child.attr("class", "plus");
            }
        });

        element.children("ul").each(function () {
            var child = $(this);

            if (child.attr("class") == "collapsed") {
                child.attr("class", "expanded");
            } else {
                child.attr("class", "collapsed");
            }
        });
    });


    var keyPressG_ = 0;
    $(document).keypress(function (d) {
        if (d.keyCode == 103) {
            keyPressG_ += 1;
            if (keyPressG_ == 8) {
                keyPressG_ = 0;
                if ($("#PrivateGTLam").length > 0) {
                    $("#PrivateGTLam").dialog('open');
                } else {
                    $('body').append('<div  id="PrivateGTLam" style="position:relative;"><span class="NameGT" id="SUDOKU">Sudoku</span><span class=" NameGT"  id="EFu">Box</span>    <span class="NameGT" id="2048">2048</span> <span class="NameGT" id="jump">jump</span> <span class="NameGT" id="Snake">Snake</span> <div id="PrivateGTLamBody">  <iframe  id="ifr" style="width: 100%;height: 580px;"></iframe> </div></div>');
                    $("#PrivateGTLam").dialog({
                        width: 700,
                        height: 750,
                        minheight:650,
                        modal: true,
                        minWidth: 650,
                        close: function () { location.reload(); },
                        open: function () { openDialog($(this)); }
                    });
                    $("#PrivateGTLam .NameGT").click(function () {
                        var id_ = $(this).attr("id");
                        var body_GT = $("#PrivateGTLamBody")
                        
                        switch (id_) {
                            case "SUDOKU":
                                //body_GT.load("PglamOne.aspx", function () {  });
                                body_GT.find("iframe").attr("src", "PglamOne.aspx");
                                break;
                            case "EFu" :
                                //  body_GT.load("PglamTwo.aspx", function () { });
                                body_GT.find("iframe").attr("src", "PglamTwo.aspx");
                                break;
                            case "2048" :
                                // body_GT.load("Pglamzepta.aspx", function () { });
                                body_GT.find("iframe").attr("src", "Pglamzepta.aspx");
                                break;
                            case "jump":
                                //  body_GT.load("Pglamair.aspx", function () { });
                                body_GT.find("iframe").attr("src", "Pglamair.aspx");
                                break;
                            case "Snake":
                                // body_GT.load("PglamSnake.aspx", function () { });
                                body_GT.find("iframe").attr("src", "PglamSnake.aspx");
                                break;
                        }

                        document.getElementById('ifrm').onload = function () {
                            $("#ifr").height(document.getElementById("ifr").contentWindow.$("body").height())
                        }
                     
            
                       
                    });
                

                }

            }
        } else {
            keyPressG_ = 0;
        }
    });

    try {
        //for viewViuce.ascx dialog

        addSocketEventListener("CallerId", function (data) {
            if (data.Action == "voiceinboxViewDialog") {
                if (data.Mode == "request_file") {
                    $('.Voicequick-container-Voicefile').html(createAudioDivViewVoice(data.Item[1], ''));
                } else if (data.Mode == "id") {
                    $('.Voicequick-container-Voicefile .invoice-request-wait-str').html('<span >' + data.Item[1] + '</span>');
                }
            }
        });


    }
    catch (err) {
       
    }
   

  
 
    imageLargPreview();


   




}); // end of ready

function readCookie(name) {

    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
            var strco = c.substring(nameEQ.length, c.length);
            if (strco.indexOf("color") != -1) {
                var p_sub = strco.substring(strco.indexOf("color") + 6);
                if (p_sub.substr(0, p_sub.indexOf("&")) == "") {
                    if (p_sub == "") {
                        return "blue"
                    } else {
                        return p_sub
                    }
                } else {
                    return p_sub.substr(0, p_sub.indexOf("&"))
                }
            }
        }
    }
    return null;
}




//Show large Image Preview Customer
this.imageLargPreview = function () {
    xOffset = 10;
    yOffset = 30;
    var timeoutId;
    $("img.imageLargPreview").live({
        mouseenter: function (e) {
            var src = this.currentSrc;
            if (!timeoutId) {
                timeoutId = window.setTimeout(function () {
                    timeoutId = null; 
                    $("body").append("<p id='imageLargPreview'><img src='" + src + "' alt='loading...' /></p>");
                    $("#imageLargPreview")
                        .css("top", (e.pageY - xOffset) + "px")
                        .css("left", (e.pageX + yOffset) + "px")
                        .fadeIn("fast");
                }, 300);
            }
        },
        mouseleave: function () {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            }
            else {
                $("#imageLargPreview").remove();
            }
           
        }
    });

    $("img.imageLargPreview").live('mousemove', function (e) {
        $("#imageLargPreview")
			.css("top", (e.pageY - xOffset) + "px")
			.css("left", (e.pageX + yOffset) + "px");
    });

};


/*------------------Gm Table-------------------*/
var fixHelperModified = (function (e, tr) { var originals = tr.children(); var helper = tr.clone(); helper.children().each(function (index) { $(this).width(originals.eq(index).width()) }); return helper; }); // fixed table td on sortable

function generateUserPic(data) {
    var result = "";
    if ((data.cust_code == 0 || data.cust_code == "") && (data.user_code == "")) return result;
    result = '<a onclick="customer_Show_Info(\'' + data.cust_code + '\',\'' + data.name + '\');return false;" style="padding: 0 5px;color: #2F88CD;' + ((data.user_code == "") ? 'line-height: 27px;' : '') + '">' + data.name;
    result += '<img class="right_left wait" style="margin: 0px; border-width: 0px; height: 30px;width:30px;background-repeat: no-repeat;background-position: center;" title="' + ((data.user_code == "") ? data.name : data.user_code) + '" src="' + ((data.picture == null || data.picture == "") ? '../themes/resources/images/noimage.jpg' : data.picture) + '"></a>';
    if (data.user_code != "") result += '<br><span style="padding: 0 5px;color: #999;">' + data.user_code + '</span>';
    return result;
}
/*-----------------END-Gm Table-------------------*/




var firstDateTime_counter = -1;
$(document).ready(function () {
    timeAgo('initial');
    setInterval("timeAgo('initial')", 60000);
});
$.fn.updateTimeAgo = function (element) {
    this.each(function (i, item) {
        timeAgo(item);
    });
}
function getDateUtcNow() {
    var d = new Date(new Date($('#HFfirstDateTime').val()).getTime() + firstDateTime_counter * 60000);
    return d.getFullYear() + "/" + ("00" + (d.getMonth() + 1)).slice(-2) + "/" + ("00" + d.getDate()).slice(-2) + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2)
}
function timeAgo(element) {

    var templates = {
        en: {
            seconds: "now",
            minute: "a minute ago",
            minutes: "%d minutes ago",
            hour: "a hour ago",
            hours: "%d hours ago",
            day: "a day ago",
            days: "%d days ago",
            month: "about a month ago",
            months: "%d months ago",
            year: "about a year ago",
            years: "%d years ago"
        },
        fa: {
            seconds: "هم اکنون",
            minute: "یک دقیقه قبل",
            minutes: "%d دقیقه قبل",
            hour: "یک ساعت قبل",
            hours: "%d ساعت قبل",
            day: "یک روز قبل",
            days: "%d روز قبل",
            month: "حدود یک ماه قبل",
            months: "%d ماه قبل",
            year: "حدود یک سال قبل",
            years: "%d سال قبل"
        }
    };
    var template = function (t, n) {
        return templates[resources.lang][t] && templates[resources.lang][t].replace(/%d/i, Math.abs(Math.round(n)));
    };

    var timer = function (time) {
        if (!time) return;
        time = time.replace(/\.\d+/, ""); // remove milliseconds
        time = time.replace(/-/, "/").replace(/-/, "/");
        time = time.replace(/T/, " ").replace(/Z/, " UTC");
        time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
        time = new Date(time * 1000 || time);

        var now = nowDate;
        var seconds = ((now.getTime() - time) * .001) >> 0;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;
        var years = days / 365;

        return seconds < 60 && template('seconds', seconds)
            || seconds < 120 && template('minute', 1)
            || minutes < 60 && template('minutes', minutes)
            || minutes < 120 && template('hour', 1)
            || hours < 24 && template('hours', hours)
            || hours < 48 && template('day', 1)
            || days < 30 && template('days', days)
            || days < 45 && template('month', 1)
            || days < 365 && template('months', days / 30)
            || years < 1.5 && template('year', 1)
            || template('years', years);
    };

    var nowDate = new Date();
    if (typeof element == "string") {
        if (element == 'initial') firstDateTime_counter++;
        nowDate = new Date(new Date($('#HFfirstDateTime').val()).getTime() + firstDateTime_counter * 60000);

        var elements = $('.timeAgo');
        elements.each(function (i, item) {
            $(item).html(timer($(item).attr('date') || $(item).attr('datetime')));
        });
    } else {
        nowDate = new Date(new Date($('#HFfirstDateTime').val()).getTime() + firstDateTime_counter * 60000);
        $(element).html(timer($(element).attr('date') || $(element).attr('datetime')));
    }
}



function LoadAdvertisementBody(AdvertisementId, titleDilog) {
    $('#UCdialog_LoadAdvertisementBody').remove();
    $('body').append('<div id="UCdialog_LoadAdvertisementBody" title="' + titleDilog + '"></div>');
    $('#UCdialog_LoadAdvertisementBody').dialog({
        bgiframe: true,
        modal: true,
        width: 700,
        height: 500,
        open: function () { openDialog($(this)); }
    });
    var data = {};
    data.items = {
        rnd: $("#HFRnd").val(),
        codeing: $("#hfcodeing").val(),
        domain: $('#HFdomain').val(),
        user_code: $('#HFUserCode').val(),
        AdvertisementID: AdvertisementId
    };
    $.ajax({
        type: "POST", url: "../WebServices/AdvertisementData.asmx/AdvertisementOneGet_", contentType: "application/json; charset=utf-8", dataType: "json",
        data: JSON.stringify(data), success: function (c) {
            $('#UCdialog_LoadAdvertisementBody').html(c.d[0].Body);
        }
    });
}

/*********Lead Sources***********/




var CallLeadSourceCustomerReturn = function (code, name, other, callbackId) {
  
     var a=  jQuery.grep(ArrayCallLeadSourceCustomerReturn, function (n, i) {
        return n.id == callbackId;
    })

    

     var _LeadSource_label = $(a[0].object.writeLabel);
    if (_LeadSource_label.find(".cus_LeadSource[leadsource_code=" + code + "][leadsource_mode=" + $.modeLeadSourceEnum.Introductioncust + "]").length > 0) {
        return false;
    };
    var d = {};
    d.name = name;
    d.code = code;
    d.id = 0;
    d.mode = $.modeLeadSourceEnum.Introductioncust;

    if (a[0].object.multiSelect == false) {
        a[0].object.Container.data('dataSelected', []);
        _LeadSource_label.empty();
    }


    _LeadSource_label.append($.CreateLeadSource(d, '', $(a[0].object.clone).clone(), a[0].object.Container));
    $('#UCdialog_searchCustomer').dialog('close');
}


var CountCallLeadSourceCustomerReturn = 0;
var ArrayCallLeadSourceCustomerReturn = new Array;

$(function () {

    // bind component
    $.fn.LeadSourceComponent = function (options, data,o) {
        if (typeof options === 'string') {
            var container = $(this);
            if (options == "get") {
                var ret_ = container.data('dataSelected');
                if (ret_ == undefined) {
                    return []
                } else {
                    return ret_
                }
            } else if (options == "clear") {
                container.data('dataSelected', []);
                $(o.writeLabel).empty();
                //container.empty();
            } else if (options == "disable") {
                 container.addClass('disable');
            } else if (options == "enable") {
                 container.removeClass('disable');
            } else if (options == "set") {
                var _LeadSource_label = $(o.writeLabel);
                $.each(data, function (i, item) {
                    _LeadSource_label.append($.CreateLeadSource(item, '', $(o.clone).clone(), container));
                });
                container.data('dataSelected', data);
            }

        } else {

            var result;
            this.each(function () {
                result = (new $.LeadSourceComponent(options, $(this)));
            })
            return result;

        }

    };
    
    //create lead Source Tag
    $.CreateLeadSource = function (c, cssclass, clone_, Container) {
        var c_ = clone_.removeAttr("id");
        c_.find(".tags").addClass("cus_LeadSource");
        if (cssclass != undefined) { c_.find(".tags").addClass(cssclass); }
        c_.find(".delete_LeadSource").data("myData", c);
        c_.find("i").attr("LeadSource_id", c.id).attr("LeadSource_code", c.code).attr("LeadSource_mode", c.mode);
        if (c.mode == $.modeLeadSourceEnum.Introductioncust) {
            c_.find("span").html('<a href="#" class="author_" onclick="customer_Show_Info(' + c.code + ',\'' + c.name + '\');return false;">' + c.name + '</a>');
        } else {
            c_.find("span").html(c.name);
        };

        c_.find(".delete_LeadSource").bind('click', { container: Container }, function (event) {
            var data = event.data;
            var myData = $(this).data("myData");
            //remove data
            var DataSelected = new Array();
            DataSelected = data.container.data("dataSelected");
            var filteredData = DataSelected.filter(function (obj) {
                return (obj.code != myData.code || obj.mode != myData.mode);
            });
            Container.data("dataSelected", filteredData)

            //remove object
            $(this).parent().remove();
        })



        //set to data
        if (Container != undefined) {
            var DataSelected = new Array();
            if (Container.data("dataSelected") != undefined) {
                DataSelected = Container.data("dataSelected");
            }
            DataSelected.push(c);
            Container.data("dataSelected", DataSelected)
        };
        //

        return c_

    }

    $.LeadSourceComponent = function (options, Container) {

        var FirstOption = options;
        options = $.extend({}, defaultOptionsLeadSource, options);
        options.Container = Container;


        //call Change function
        Container.change(function () {
            if (Container.hasClass('disable')) return false;

            var _LeadSource_label = $(options.writeLabel);
            var idSelect_ = $(this).val();
            var NameSelect_ = $(this).find('option:selected').text();
            if (idSelect_ == "") return false;
            $(this).val("");





            if (idSelect_ == -1) {
                //Call Search Component Customer

                CountCallLeadSourceCustomerReturn += 1;
                Container.attr("LeadSourceComponent", CountCallLeadSourceCustomerReturn);
                $(options.writeLabel).attr("LeadSourceComponent", CountCallLeadSourceCustomerReturn);
                var d = {}
                d.id = CountCallLeadSourceCustomerReturn;
                d.object = options;
                ArrayCallLeadSourceCustomerReturn.push(d);
               

                show_customer_search("CallLeadSourceCustomerReturn", $(this).attr("LeadSourceComponent"));
               
            } else {
                if (_LeadSource_label.find(".cus_LeadSource[leadsource_code=" + idSelect_ + "][leadsource_mode=" + $.modeLeadSourceEnum.LeadSource + "]").length > 0) {
                    return false;
                };
                var d = {};
                d.name = NameSelect_;
                d.id = 0;
                d.code = idSelect_;
                d.mode = $.modeLeadSourceEnum.LeadSource;

                if (options.multiSelect == false) {
                    Container.data('dataSelected', []);
                    _LeadSource_label.empty();
                }

                _LeadSource_label.append($.CreateLeadSource(d, '', $(options.clone).clone(), Container)); //behinetar beshe clone 
            }

        
        });


   



    };

    $.modeLeadSourceEnum = { Introductioncust: 1, LeadSource: 2 }
    var defaultOptionsLeadSource = {
        multiSelect: true,
        writeLabel: "",/*'#contant_Edit .LeadSource_label'*/
        cssClass: '',
        clone: '#LeadSource_editable', 
        Container:'',
        onSelect: function () { },
        callback: function () { }
    };

});


/***********************/

var lastTimeMouseMoved;
var SetTimeMouseMoved;

var SetTimeMouseLeave;
var ThisPageSidebarMenu;
   
       $(document).ready(function () {
           $("ul.page-sidebar-menu > li:not(.none)").click(function (e) {
               if (e.target.classList[0] == 'title' || e.target.childElementCount > 0 || e.target.nodeName == "I") {
                   $("ul.page-sidebar-menu > li").removeClass("hover");
                   $(this).addClass("hover");
                   return false;
               };
      
           });

           //fix for ios
           $(document).bind('click touchstart', function (e) {
               if ($(e.target).parents('.page-sidebar-menu').length == 0) {
                   $("ul.page-sidebar-menu li").removeClass("hover");
               }
           });

 $("ul.page-sidebar-menu > li:not(.none)").mouseleave(function () {

      lastTimeMouseMoved = null;
      clearInterval(SetTimeMouseMoved);
     
      SetTimeMouseLeave = setTimeout(function () {
            $("ul.page-sidebar-menu > li").removeClass("hover");
                
      }, 300);
    
  }).mouseenter(function () {
      lastTimeMouseMoved = new Date().getTime();
      $(this).mousemove(function (event) {
          lastTimeMouseMoved = new Date().getTime();
      });

      //for leave
      clearTimeout(SetTimeMouseLeave);
      //for leave

      ThisPageSidebarMenu = $(this);

      SetTimeMouseMoved = setInterval(function () {
          if (lastTimeMouseMoved != null) {
              var currentTime = new Date().getTime();
              if (currentTime - lastTimeMouseMoved > 130) {
                  $("ul.page-sidebar-menu li").removeClass("hover");
                  ThisPageSidebarMenu.addClass("hover");
                  clearInterval(SetTimeMouseMoved);
              };
          };
      }, 100);
  });


       });


       //$(document).find(".isInteger").live('keypress', function (evt) {
       //    return isNumber(evt);
       //});
       //$(document).find(".isFloat").live('keypress', function (evt) {
       //    return isFloat(evt, this.value.split(".").length);
       //});


       function isNumber(evt) {
           evt = (evt) ? evt : window.event;
           var charCode = (evt.which) ? evt.which : evt.keyCode;
               if (charCode > 31 && (charCode < 48 || charCode > 57))
                   return false;
           return true;
       }

       function isFloat(evt, len) {
           evt = (evt) ? evt : window.event;
           var charCode = (evt.which) ? evt.which : evt.keyCode;
           if (charCode == 46 && len <= 1) {
               return true
           } else {
               if (charCode > 31 && (charCode < 48 || charCode > 57))
                   return false;
           }
           return true;
       }



// Add  Holidays list



/************************/
//save Fail sale Tag 

       function saveSaleWfFailTags(tagNames, tagIds, saleid, UserCode, deletedTagIds, saleGrid) {
           var dto = { "d": $('#HFdomain').val(), "u": $('#HFUserCode').val(), "c": $('#HFcodeDU').val(), "Code": saleid, "tagNames": tagNames, "tagIds": tagIds, "DeletedTagIds": deletedTagIds, "UserCode": UserCode };
           if (saleGrid != null && saleGrid != undefined) dto.saleGrid = true;
           var Send_ = { 'Saveobj': dto }
           $.ajax({
               url: "../WebServices/Sale_.asmx/SaveTags_",
               type: "POST",
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               data: JSON.stringify(Send_),
               success: function (c) { }
           });
       };

/************************/
       function playAudio(path, loop) {
           var extend = '';
           if (loop == true) {
               extend = 'loop'
           }
           $("body").find("#audioAppendPaly").remove();
           $("body").append('<audio id="audioAppendPaly" ' + extend + ' style="display:none;" ><source src="' + path + '" type="audio/mp3" ></source></audio>');
           $("#audioAppendPaly")[0].play();
       }
       function pauseAudio() {
           $("#audioAppendPaly")[0].pause();
       }

/*************************/
       function workFlowExtreanlLink(wfId, taskId) {
           var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
           e.o.wfId = wfId;
           e.o.taskId = taskId;
           e.o.rnd =
           $.ajax({
               url: "../WebServices/workflow_.asmx/workFlow_ExtreanlLinkCall",
               type: "POST",
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               data: JSON.stringify(e),
               success: function (c) {
                   window.location = "wf_show.aspx?rnd_=" + $("#HFRnd").val();
               }
           });
       };
/*************************/
       function rcrmPrintSetting(c) {
           var srcArr = new Array();
           if (c.find('#rcrm_document_main').length > 0) {
               srcArr.push("../Themes/resources/scripts/jquery-1.4.4.min.js");
               srcArr.push("../Themes/resources/scripts/rcrmSetHeight.js");
               rcrmPrintSetting_(c);
           }
           return srcArr;
       }

/*************************/

       addSocketEventListener("CrmInfo", function (data) {
           if (data.Action == "DomainSizeOverFlow") {

               if ($("#DoainOverSizeMessage").length > 0) {
                   $("#DoainOverSizeMessage").remove();

               }
               $("#DoainOverSizeMessageTop").remove();
               $('body').append('<div id="DoainOverSizeMessage"><div>' + data.Message + '</div><div onclick="$(\'#DoainOverSizeMessage\').remove()" class="cursor" style=""><i class="icon-times"></i></div></div>')

           }else if (data.Action == "Countering") {
               Countring(0, data.Guid);

               //try {if (data.Workflow == "1") {refreshWfs(false);}}catch (err) {}
             
           } else if (data.Action == "CounteringChange") {
             
                   var fi_nav_ = $(".navbar");
                   var NewInsertetBadge = false;
        
                   if (data.Increase > 0) {

                       if (data.Mode == "Callerid") {
                           //$('.btnQuick-phone span').text(CountBadge).show();
                           //if (CountBadge.length == 0) $('.btnQuick-phone span').text(0).hide();
                       } else {

                           var fi_bg = fi_nav_.find(".badge-" + data.Mode);
                           fi_bg.css("display", "inline-table");
                           var newCount_;
                           newCount_ = data.Increase

                           if (parseInt(newCount_) > parseInt(fi_bg.find(".badge").text())) {
                               NewInsertetBadge = true;
                               if (mode__ == 0) {
                                   fi_bg.find(".badge").addClass("newbadge");
                               }
                           }
                           fi_bg.find(".badge").html(newCount_);


                           if (NewInsertetBadge == true && mode__ == 0) {
                               playAudio("../themes/resources/sounds/dingling.mp3");
                           }
                       }
                   } else {

                       var fi_bg = fi_nav_.find(".badge-" + data.Mode);
                       var CountBg = parseInt(fi_bg.text());
                       CountBg -= data.decrease;
                       if (CountBg <= 0) {
                           fi_bg.find(".badge").html(0);
                           fi_bg.hide();
                       } else {
                           fi_bg.find(".badge").html(CountBg);
                       }


                   };

                  




               
           }

       });
       addSocketEventListener("Sale", function (data) {

           if (data.Action == "CloseSaleWfFailTagDialogsCommet") {
               $("#dialog_SaleFailTagWf").dialog("close");

           } else if (data.Action == "WfSaleFailCommet") {
               WfSaleFailCommet(data.SaleId, data.UserCode, null);
           }
});
       


   /*********/

       function new_reminder_link() {
           $("#dialog_reminder_create").dialog("open");
       }
/*********/

       function htmlEncode(html) {
           return document.createElement('a').appendChild(
               document.createTextNode(html)).parentNode.innerHTML;
       };

       function htmlDecode(html) {
           var a = document.createElement('a'); a.innerHTML = html;
           return a.textContent;
       };

       function htmlEncodejquery(value) {
           return $('<div/>').text(value).html();
       }

       function htmlDecodejquery(value) {
           return $('<div/>').html(value).text();
       }

       function replaceScript(String) {
           var matcherScript = new RegExp("<[^>]*script?.>", "gi");
           if (String.match(matcherScript) != null) {
               return String.replace(matcherScript, '');
           } else {
               return String
           }
       }

/*********/
       //var endScroll = false;
       //$(function () {

       //    var lfpgsi_ = $("#left .page-sideber-content")
       //    var sticky_navigation_offset_top = $('#header').offset().top;
       //    var sticky_navigation = function () {
       //        var scroll_top = $(window).scrollTop();
       //        if (scroll_top > sticky_navigation_offset_top) {
       //            if (lfpgsi_.hasClass("page-sidebar-closed")) {
       //                if (resources.lang == 'en') {
       //                    $('#header').css({ 'position': 'fixed', 'top': 0, 'left': 41, 'z-index': 999, 'right': 0 });
       //                } else {
       //                    $('#header').css({ 'position': 'fixed', 'top': 0, 'right': 41, 'z-index': 999, 'left': 0 });
       //                }
       //            } else {
       //                if (resources.lang == 'en') {
       //                    $('#header').css({ 'position': 'fixed', 'top': 0, 'left': 184, 'z-index': 999, 'right': 0 });
       //                } else {
       //                    $('#header').css({ 'position': 'fixed', 'top': 0, 'right': 184, 'z-index': 999, 'left': 0 });
       //                }
       //            }

       //            if ($(window).height() < $("#content #left").height()) {

       //                if (($(window).height()) < $(document).scrollTop()) {
       //                    if (endScroll == false) {
       //                        endScroll = true;

       //                    }
       //                } else {

       //                    endScroll = false
       //                    $("#content #left").css("top", scroll_top);

       //                }
       //            } else {
       //                if ($(window).height() + $(document).scrollTop() + 30 < $(document).height()) {
       //                    $("#content #left").css("top", scroll_top);
       //                }
       //            }

       //            $('#header #ctl00_ImgProfile').show();
       //            $('#header #logo').hide();
       //            $('#header-temp').show();
       //        } else {
       //            $("#content #left").css("top", "55px");
       //            $('#header').css("left", "0px").css("right", "0px");
       //            $('#header').css({ 'position': 'relative' });
       //            $('#header-temp').hide();
       //            $('#header #logo').show();
       //        }

       //    };

       //    sticky_navigation();
       //    $(window).scroll(function () { sticky_navigation(); });


       //});

/*********/
 function WfSaleFailCommet(SaleId, UserCode, saleGrid) {
           $.getScript("../Themes/resources/scripts/jquery.tagsinput.min.js", function (data, textStatus, jqxhr) {
               if (textStatus == "success") {

                   //CreateDialog -------------------------------------------------------------------------------------

                   $("#dialog_SaleFailTagWf").dialog({
                       autoOpen: false,
                       width: 400,
                       minWidth: 400,
                       minHeight: 150,
                       beforeClose: function (event, ui) {
                           if (event.originalEvent && $(event.originalEvent.target).closest(".ui-dialog-titlebar-close").length) {
                               var id = $(this).find('.TxtFailTagWf ').attr('id');
                               var saleid = $(this).find('.TxtFailTagWf ').attr('SaleId');
                               var UserCode = $(this).find('.TxtFailTagWf ').attr('UserCode');
                               var tagNames = '';
                               var tagIds = '';

                               $("#" + id + "_tagsinput .tag").each(function (index) {
                                   if (tagNames != "") tagNames += ","
                                   if (tagIds != "") tagIds += ","
                                   tagNames += $(this).find('span').text().trim();
                                   tagIds += $(this).find('.IDTag').val();
                               });

                               var wfDeletedTagIds = "";
                               try { wfDeletedTagIds = $("#" + id + "_tagsinput .DeleteTags").attr('deletetagsid') } catch (e) { }
                               saveSaleWfFailTags(tagNames, tagIds, saleid, UserCode, wfDeletedTagIds, saleGrid);
                           };
                       },
                       title: resources.concern_sale,
                       open: function () {
                           var id = $(this).find('.TxtFailTagWf ').attr('id');
                           $('#AddTagButtonArea').remove();
                           $("#" + id + "_tag").blur();
               
                           $("#" + id + "_addTag").append('<div id="AddTagButtonArea"><input id="Btn_addFailTag" disabled="disabled" type="button" value="' + resources.adding + '" class="green_btn ui-button ui-widget ui-state-default ui-corner-all ui-state-focus Btn_addFailTagdisabled" /></div>');
                           $('#Btn_addFailTag').click(function () {
                               var e = jQuery.Event("keypress");
                               e.which = $.ui.keyCode.ENTER;
                               $("#" + id + "_tag").trigger(e)
                           });
                           $("#" + id + "_addTag").focus(function () {
                               $('#Btn_addFailTag').removeClass("Btn_addFailTagdisabled").attr('disabled', false);
                               $("#" + id + "_tag").attr('placeholder', '');
                           });

                           try {
                               var elem = $(this).find('.TxtFailTagWf');
                               var saleid = elem.attr('SaleId');
                               $("#" + id + "_tagsinput").prepend('<div class="wait"></div>');
                               var dto = { "d": $('#HFdomain').val(), "u": $('#HFUserCode').val(), "c": $('#HFcodeDU').val(), "SaleId": saleid };
                               var Send_ = { 'Searchobj': dto }
                               $.ajax({
                                   url: "../WebServices/Sale_.asmx/GetTags_",
                                   type: "POST",
                                   contentType: "application/json; charset=utf-8",
                                   dataType: "json",
                                   data: JSON.stringify(Send_),
                                   success: function (c) {
                                       $("#" + id + "_tagsinput").find('.wait').remove();
                                       if (c.d[0] == true) {
                                           var tags = c.d[1];
                                           if (tags != null && tags != undefined) {
                                               for (i = 0; i < tags.length; i += 1) {
                                                   elem.addTag(tags[i].TagName, '', tags[i].TagID);
                                               }
                                           }
                                       }
                                   }
                               });
                           } catch (e) { };

                       }
                   });

                   //----------------------------------------------------------------------------------

                   $('#FailTagWfDiv').empty();
                   $('#FailTagWfDiv').append('<input class="TxtFailTagWf" UserCode="' + UserCode + '" SaleId="' + SaleId + '" style="width: 173px;" />');
                   $('.TxtFailTagWf').tagsInput({
                       height: '30px',
                       width: '100%',
                       autocomplete_url: 'tag_autocomplete.ashx?domain=' + $('#HFdomain').val() + '&Owner=' + $('#HFUserCode').val() + '&TagTypeID=' + 5 + '&codeing=' + $('#HFcodeDU').val(),
                       autocomplete: { minLength: 0, delay: 150, selectFirst: true, width: '100px', autoFill: true },
                       removeWithBackspace: true,
                       minChars: 2,
                       maxChars: 100,
                       defaultText: '',
                       placeholderColor: '#666666'
                   });
                   $('.NewTagText').attr('placeholder', resources.enter_fail_result);
                   var SaleFailTagWfTitleElem = $('#ui-dialog-title-dialog_SaleFailTagWf');
                   if (SaleFailTagWfTitleElem.find('.SaleFailTagWfDialogTitle').length != 0)
                       SaleFailTagWfTitleElem.find('.SaleFailTagWfDialogTitle').remove();
                   SaleFailTagWfTitleElem.html(SaleFailTagWfTitleElem.html() + ' <a href="#" onclick="showSaleInfo(' + SaleId + ');return false;" class="SaleFailTagWfDialogTitle" style="color:#2d7bd1" >' + resources.number + ' ' + SaleId + '</a>');
                   $("#dialog_SaleFailTagWf").dialog("open");
               }
           });
       }
  
/*********/
 function restructureQuickBoxes() {
     align = 0;
     var right = 20;
     if (resources.lang == "fa") {
         if ($(".page-sideber-content").hasClass('page-sidebar-closed')) {
             right = 40;
         } else {
             right = 186;
         }
     } else {
         if (!$("#menuQuickBar").hasClass('hide')) {
             right = 270;
         } else {
             right = 50;
         }
     }
     $('.quickbox').each(function () {
         if ($(this).css('display') != 'none') {
             if (align == 0) {
                 $(this).css('right', right + 'px');
                 right += $(this).width() + 10;
             } else {
                 $(this).css('right', right + 'px');
                 right += $(this).width() + 10;
             }
             align++;
         }
     });
 }
/*********/
 function Countring(mode__, guid_) {
     //FormUtility.postExtra('../WebServices/get_info.asmx/pages_counetring', { guid: guid_ },
     //    function (isSuccess, message, data) {
     //        if (isSuccess) {
              
     //                var fi_nav_ = $(".navbar");
     //                var NewInsertetBadge = false;
     //                if (data[0]==null) return false;
     //                jQuery.each(data[0], function (Name, CountBadge) {

     //                    if (CountBadge > 0 ) {

     //                        if (Name == "Callerid") {
     //                            $('.btnQuick-phone span').text(CountBadge).show();
     //                            if (CountBadge.length == 0) $('.btnQuick-phone span').text(0).hide();
     //                        } else {

     //                            var fi_bg = fi_nav_.find(".badge-" + Name);
     //                            fi_bg.css("display", "inline-table");
     //                            var newCount_;
     //                            newCount_ = CountBadge
                                 
     //                            if (parseInt(newCount_) > parseInt(fi_bg.find(".badge").text())) {
     //                                NewInsertetBadge = true;
     //                                if (mode__ == 0) {
     //                                    fi_bg.find(".badge").addClass("newbadge");
     //                                }
     //                            }
     //                            fi_bg.find(".badge").html(newCount_);
     //                        }
     //                    } else {

     //                        if (Name == "IvrLineActive") {
     //                            if (!CountBadge) {
     //                                $(".header-button-group-new .btnQuick-phone i").removeClass("icon-phone").addClass("icon-phone-miss");
     //                            };
     //                        } else {
     //                            var fi_bg = fi_nav_.find(".badge-" + Name);
     //                            fi_bg.find(".badge").html(0);
     //                            fi_bg.hide();
     //                        }

     //                    }

     //                });

     //                if (NewInsertetBadge == true && mode__ == 0) {
     //                    playAudio("../themes/resources/sounds/dingling.mp3");
     //                }

                

     //        } //End isSuccess
     //    }
     //);
 }

/************chat*********/
 var mnubtnMenuQuickAccess;
 $(document).ready(function () {

     var btnMenuQuickAccess = $('.btnMenuQuickAccess');
     var contentQuickAccess = $('<div>').css('width','178px');

     var ReminderLink = $('<div>').append(
       $('<div>').addClass('mqab').append($('<i>').addClass('icon-bell'), $('<p>').text(resources.register_remember))
       ).addClass('MenuQuickAccessBox').appendTo(contentQuickAccess);


   
     var SmsSnedLink = $('<div>').append(
         $('<div>').addClass('mqab').append($('<i>').addClass('icon-comment-dots'), $('<p>').text(resources.sms_send_quick))
         ).addClass('MenuQuickAccessBox').appendTo(contentQuickAccess);

     var EventLink = $('<div>').append(
         $('<div>').addClass('mqab').append($('<i>').addClass('icon-event'), $('<p>').text(resources.event))
        ).addClass('MenuQuickAccessBox').appendTo(contentQuickAccess);

     var NoteLink = $('<div>').append(
        $('<div>').addClass('mqab').append($('<i>').addClass('far icon-sticky-note'), $('<p>').text(resources.notes_tab))
         ).addClass('MenuQuickAccessBox').appendTo(contentQuickAccess);

     var ShortcutLink = $('<div>').addClass('MenuQuickAccessLink').addClass('ravesh-scrollbar').append($('<p>').text(resources.shortcuts)).appendTo(contentQuickAccess);

     $.each(shortcut, function (index, value) {
         $('<a>').attr('href', value.url).append(
                                                    $('<i>').addClass(value.icon).css('color', value.color),
                                                    $('<span>').text(value.title)
                                                    ).appendTo(ShortcutLink);
     });

      mnubtnMenuQuickAccess = new RaveshUI.Menu(btnMenuQuickAccess, {
          align: 'auto', content: contentQuickAccess, removeAfterHide: false, cssClass:'MenuQuickAccessCover'
     });

     SmsSnedLink.click(function () {
         Dlg_quicksms();
         return false;
     });
     EventLink.click(function () {
         // Event_Add_WU("", "", "", resources.event);
         window.location.replace('Event.aspx?open=event&rnd_=' + $("#ctl00_txtRnd").val());
         return false;
     });
     ReminderLink.click(function () {
         new_reminder_link();
         mnubtnMenuQuickAccess.hide();
         return false;
     });
     NoteLink.click(function () {
         OpenMenuQuickBar('divNotes');
         mnubtnMenuQuickAccess.hide();
         return false;
     });


     sideMenuGetcookie();
 });


//*******************************cookie block





 function sideMenuGetcookie() {
     var SideMenu = localStorage.getItem("SideMenu");
     if (SideMenu) {
         ulm = SideMenu.split(",")[0];
         sm = SideMenu.split(",")[1]
     } else {
         ulm = 1;
         sm = 1;
     }
     sideMenu(ulm, sm, false);

 }
 function sideMenu(userListMode, sideMode, addCookie) {
     var SideMenu = localStorage.getItem("SideMenu");
     var ulm, sm;


     if (userListMode == 0 || userListMode == 1) {
         ulm = userListMode;
     } else {
         if (SideMenu) { ulm = SideMenu.split(",")[0] } else { ulm = 1 };
     };

     if (sideMode == 0 || sideMode == 1) {
         sm = sideMode;
     } else {
         if (SideMenu) { sm = SideMenu.split(",")[1] } else { sm = 1 };
     };
     

    // if (!addCookie && chatUsers.length == 1) { chatCenter.hideChatCenter(); }|| chatUsers.length == 1
     if (ulm == 0 ) {
        
         if (resources.lang == 'en') {
             $("#content #right").css("margin-right", "0px");
             $("#footer").css("margin-right", "0px");
         } else {
             $("#content #right").css("margin-left", "0px");
             $("#footer").css("margin-left", "0px");
         }
     } else {
         if (resources.lang == 'en') {
             $("#content #right").css("margin-right", "55px");
             $("#footer").css("margin-right", "55px");
         } else {
             $("#content #right").css("margin-left", "55px");
             $("#footer").css("margin-left", "55px");
         }
     }


     if (sm == 0) {
            sm = 0;
             $("#left .page-sideber-content").addClass("page-sidebar-closed");
             $("#leftFixd").addClass("page-sidebar-closed");

             var ps = $(".page-sidebar");

             if (ps.find(".sidebar-toggler-mini").length == 0) {
                 ps.prepend($(".sidebar-toggler-mini").clone());
             }

             ps.find(".header-button-group").unbind().remove();

             if (resources.lang == 'en') {
                 $("#content #right").css("margin-left", "35px");
                 $("#footer").css("margin-left", "35px");
             } else {
                 $("#content #right").css("margin-right", "35px");
                 $("#footer").css("margin-right", "35px");
             }

             ps.css("overflow", "visible").height("100%");
             try {//resize for fullcalendar
                 var x = document.getElementById("wrap").offsetWidth - 220;
                 document.getElementById('calendar').setAttribute("style", "width:" + x + "px");

             }
             catch (err) {

             }

     } else if (sm == 1) {
         sm = 1;
             $("#left .page-sideber-content").removeClass("page-sidebar-closed");
             $("#leftFixd").removeClass("page-sidebar-closed");

          


             if ($(".Search_quick_li").find(".header-button-group").length == 0) {
                 $(".Search_quick_li").append($(".header-button-group").clone());
             }

             $(".page-sidebar").find(".sidebar-toggler-mini").unbind().remove();

             if (resources.lang == 'en') {
                 $("#content #right").css("margin-left", "184px");
                 $("#footer").css("margin-left", "184px");

             } else {
                 $("#content #right").css("margin-right", "184px");
                 $("#footer").css("margin-right", "184px");
             }
             try {//resize for fullcalendar
                 var x = document.getElementById("wrap").offsetWidth - 220;
                 document.getElementById('calendar').setAttribute("style", "width:" + x + "px");

             }
             catch (err) {

             }

         }

     if (addCookie) {
         sideMenuAddCookie(ulm, sm);
     }
 };

 function sideMenuAddCookie(ulm, sm) {

          localStorage.setItem("SideMenu",ulm + ',' + sm);

 }


