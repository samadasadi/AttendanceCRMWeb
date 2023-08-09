/// <reference path="NotificationCenter.js" />
var notiCenter = new NotificationCenter($("#HFlang").val(), $("#HFTimeZone").val());

var NOTIFICATION_TYPE = {
    CallerId: 1, Payments: 2, Invoice: 3,
    Email: 5, Sms: 6, PublicChat: 7,
    Comment: 8, Reminder: 9, Cartabl: 10,
    Chat: 11, FarsicomInformation: 12,
    Workflow: 1001, Form: 1002, Customer: 1003
}

function CreateNotification(data) {
    if (data.ExtraData != '') data.ExtraData = JSON.parse(data.ExtraData);

    var noti = notiCenter.createNoti()
        .setId(data.Id)
        .setMode(data.Mode)
        .setTitle(data.Title)
        .setDetail(data.Description)
        .setDate(data.NotificationDateTime)
        .setPicture(data.Picture)
        .setViewed(data.Viewed)
        .setLableColor(data.Color)
        .setSoundId(data.Sound)
        .setAllowBrowserNotification(data.BrowserNotification);

    noti.data = data;

    switch (data.Mode) {
        case NOTIFICATION_TYPE.Chat:
            var isWatchingChat = chatCenter.isWatchingChat(data.LinkCode) && !document.hidden;
            noti.setNoNeedShow(isWatchingChat);
            noti.setOnClickListener(function () {
                chatCenter.showChatBox(data.LinkCode);
                return false;
            });
            break;

        case NOTIFICATION_TYPE.CallerId:

            noti.setExtraId(data.Mode + ',' + data.ExtraData.Tranno);

            if (data.CustomerCode != 0) {

                if (data.ExtraData.group != undefined) {
                    $.each(data.ExtraData.groups, function (g, group) {
                        if (g < 2) { noti.addButton(group); } else { noti.addButton('...'); return false; }
                    });
                };

                //noti.setOnClickListener(function () {
                //    customer_Show_Info(data.CustomerCode, data.Title);
                //});

                //noti.addButton(resources.logcustomer, function () {
                //    LogUC(data.CustomerCode);
                //});

                //noti.addButton(resources.form, function () {
                //    new RaveshFormUtility.FormGridMini("", {
                //        custCode: data.CustomerCode,
                //        custName: data.Title,
                //        showDialog: true
                //    });
                //    return false;
                //});


            } else {

                noti.addButton(resources.newcustomer, function () {
                    var dataSend = { tel: data.ExtraData.Number, mode: data.ExtraData.Mode, user: data.ExtraData.UserCode, savelog: true, tranno: data.ExtraData.Tranno };
                    customer_create_quick('', 'Inserted_customer_callerid', 'tel=' + data.ExtraData.Number);
                    $('#UCdialog_customer_create_quick').data('ivr', dataSend);
                    return false;
                });
            };
            break;

        case NOTIFICATION_TYPE.Payments:



            $.each(data.ExtraData.Id, function (i, code) {
                if (data.ExtraData.mode == 4) {
                    noti.addButton(resources.ReportGenerator_view + ' ' + resources.form, function () {
                        showFormInfo(code);
                    });

                } else if (data.ExtraData.mode == 1) {

                    noti.addButton(resources.ReportGenerator_view + ' ' + resources.store.cap_factor, function () {
                        showfactorInfo(code, '');
                    });
                }
            });

            if (data.CustomerCode != 0) {
                noti.addButton(resources.ReportGenerator_view + ' ' + resources.customer, function () {
                    customer_Show_Info(data.CustomerCode, '');
                });
            };


            break;


        case NOTIFICATION_TYPE.Invoice:
            noti.setOnClickListener(function () {

                var urlFacType = (data.ExtraData.type == 2) ? "type=pre&" : "";
                window.open('Store_FactorSales.aspx?' + urlFacType + 'FactorID=' + data.LinkCode + '&rnd_=' + $("#ctl00_txtRnd").val(), '_blank');
               // window.location.replace('Store_FactorSales.aspx?' + urlFacType + 'FactorID=' + data.LinkCode + '&rnd_=' + $("#ctl00_txtRnd").val());
              
            });
            break;

        case NOTIFICATION_TYPE.Email:

            CreateEmailNotificationContent(noti, data);



            break;

        case NOTIFICATION_TYPE.Sms:

            CreateSmsNotificationContent(noti, data);

            break;

        case NOTIFICATION_TYPE.PublicChat:

            if (window.chatList) {
                var isWatchingChat = chatList.getSelectedUserId() == data.LinkCode && !document.hidden;
                noti.setNoNeedShow(isWatchingChat);
                noti.setOnClickListener(function () {
                    chatList.showChatBox(data.LinkCode);
                });
                noti.addButton(resources.chat, function () {
                    chatList.showChatBox(data.LinkCode);
                });
            } else {
                noti.addButton(resources.chat, "/pages/chat.aspx?rnd_=" + $("#HFRnd").val(), true);
            }
            break;


        case NOTIFICATION_TYPE.Comment:


            switch (data.ExtraData.CommentType) {
                case 1:
                    noti.addButton(resources.ReportGenerator_view + ' ' + resources.sale, function () {
                        showSaleInfo(data.ExtraData.Id);
                    });
                    break;
                case 2:
                    noti.addButton(resources.ReportGenerator_view + ' ' + resources.customer, function () {
                        customer_Show_Info(data.ExtraData.Id, '');
                    });
                    break;
                case 3:
                    // code block
                    break;
                case 4:
                    noti.addButton(resources.ReportGenerator_view + ' ' + resources.form, function () {
                        showFormInfo(data.ExtraData.Id);
                    });
                    break;
                case 5:
                    noti.addButton(resources.ReportGenerator_view + ' ' + resources.ticket, function () {
                        show_ticket(data.ExtraData.Id, data.ExtraData.Id); return false;
                    });
                    break;
                default:
                    // code block
            };
            var a = noti.addButton(resources.ReportGenerator_view + ' ' + resources.comments, function (a, b) {
                var d_ = $('<div>').attr('id', 'notificationCmment' + data.Id).appendTo('body');
                d_.commentComponent({
                    mode: data.ExtraData.CommentType,
                    width: 580,
                    height: 310,
                    maxDataLoad: 3,
                    expand: false,
                    editable: true,
                    removeable: true,
                    changeOnlyMaster: false,
                    textHeightGrowDuble: true,
                    openDialog: true,
                    dialogTitle: ''
                });
                d_.commentComponent("setCode", data.ExtraData.Id, '');
            });

            break;

        case NOTIFICATION_TYPE.Cartabl:
            try {
                if (!data.firstCreate) {
                    data.firstCreate = true;
                    var_refresh = 0;
                    init_calendar(true, 0, 1);
                } 
            }
            catch (err) {

            }

            break;
        case NOTIFICATION_TYPE.Reminder:

            if (data.ExtraData.Type == "CUSTOMER") {

                noti.addButton(data.ExtraData.linkTitle, function () {
                    customer_Show_Info(data.ExtraData.LinkId, data.ExtraData.linkTitle);
                });

            } else if (data.ExtraData.Type == "FORM") {

                noti.addButton(data.ExtraData.linkTitle, function () {
                    showFormInfo(data.ExtraData.LinkId);
                });

            } else if (data.ExtraData.Type == "SALE") {

                noti.addButton(data.ExtraData.linkTitle, function () {
                    showSaleInfo(data.ExtraData.LinkId);
                });

            }


            break;
    }

    return noti;
}


notiCenter.setOnCloseNotiListener(function (arrNoti) {
    var e = new Array();
    $.each(arrNoti, function (n, noti) {
        var item = noti.data;
        if (item.ExtraData != '') item.ExtraData = JSON.stringify(item.ExtraData);
        if (noti.getId() > 0 && !noti.allowDelete()) {//display in center is true
            CreateNotification(item)
                  .closeAfterClick(false)
                  .showPinButton(item.Pin)
                  .showSettingButton(item.Mode, item.ModeTitle)
                  .showInNotiCenter(true);
            notiCenter.addBadge(1);
            notiCenter.hideEmptyMessage();
        }

        var d = {};
        d.id = noti.getId();
        d.viewed = noti.getViewed();
        d.delete = noti.allowDelete();
        if (!d.delete && !d.viewed) return;
        e.push(d);
    });
    if (e.length == 0) return false;

    //FormUtility.postExtra('../WebServices/NotificationCenterService.asmx/SetViewedOrRemoveNotification', { centerId: notiCenter.getCenterId(), e: e },
    //    function (isSuccess, message, data) {
    //        if (!isSuccess) {
    //            RaveshUI.errorToast("error", message)
    //        }
    //    }
    //);
    //FormUtility.postExtra('/NotificationCenterService/SetViewedOrRemoveNotification', { centerId: notiCenter.getCenterId(), e: e },
    //    function (data) {
    //        //if (!isSuccess) {
    //        //    RaveshUI.errorToast("error", message)
    //        //}
    //    }
    //);
});


notiCenter.setOnChangeSettingListener(function (setting) {
    FormUtility.postExtra('../WebServices/NotificationCenterService.asmx/SetSetting', { centerId: notiCenter.getCenterId(), mode: setting.mode, key: setting.key, value: setting.value },
       function (isSuccess, message, data) {
           if (!isSuccess) {
               RaveshUI.errorToast("error", message)
           }
       }
    );
});


notiCenter.setOnRequestGetNotiListener(function (mode) {
    notiCenter.showLoading();
    FormUtility.postExtra('../WebServices/NotificationCenterService.asmx/GetNotification', { centerId: notiCenter.getCenterId(), mode: mode },
          function (isSuccess, message, data) {
              if (isSuccess) {
                  notiCenter.hideLoading();
                  if (data.length == 0) {
                      notiCenter.showEmptyMessage();
                  } else {
                      $.each(data, function (i, item) {
                          CreateNotification(item)
                              .closeAfterClick(false)
                              .showPinButton(item.Pin)
                              .showSettingButton(item.Mode, item.ModeTitle)
                              .showInNotiCenter();
                      });
                  }
              }
          }
    );
});

notiCenter.setOnRequestGetModuleSettingListener(function (callback) {
    notiCenter.showLoading();
    FormUtility.postExtra('../WebServices/NotificationCenterService.asmx/GetSetting', { centerId: notiCenter.getCenterId() },
         function (isSuccess, message, data) {
             notiCenter.hideLoading();
             if (isSuccess) {
                 $.each(data, function (i, item) {
                     item.icon = GetNotificationModuleIcon(item.Mode);
                     notiCenter.addModuleSetting(item);
                 });
             }
         }
   );
});

notiCenter.setOnClearNotiListener(function (mode) {
    notiCenter.showLoading();
    FormUtility.postExtra('../WebServices/NotificationCenterService.asmx/ClearNotification', { centerId: notiCenter.getCenterId(), mode: mode },
        function (isSuccess, message, data) {
            notiCenter.hideLoading();
            if (isSuccess) {
                notiCenter.showEmptyMessage();
            }
        }
    );
});

notiCenter.setOnPinNotiListener(function (id, enable) {
    FormUtility.postExtra('../WebServices/NotificationCenterService.asmx/SetPinNotification', { centerId: notiCenter.getCenterId(), id: id, enable: enable },
         function (isSuccess, message, data) {
             if (!isSuccess) {
                 RaveshUI.errorToast("error", message)
             }
         }
   );
})

notiCenter.addCategory(0, resources.all, 'icon-bell-o');
notiCenter.addCategory(1, resources.calleriid,'icon-phone');
notiCenter.addCategory(2, resources.payment, 'icon-usd-circle');
notiCenter.addCategory(3, resources.accounting, 'icon-donate');
notiCenter.addCategory(5, resources.email, 'icon-envelope');
notiCenter.addCategory(6, resources.sms, 'icon-comment-dots');
notiCenter.addCategory(8, resources.comments, 'icon-comment-alt-lines');
notiCenter.addCategory(9, resources.Reminder, 'icon-list-alt');

notiCenter.setBadge(parseInt($('.btnQuick-notificationCenter span').text()) || 0, $('.btnQuick-notificationCenter span').hasClass('isImportant'));
notiCenter.setOnChangeBadgeListener(function (count, isImportant) {
    $('.btnQuick-notificationCenter span').text(count).toggle(count > 0).toggleClass('isImportant', isImportant);
})

addSocketEventListener("NotificationEvent", function (data) {
    if (data.Action == "delete") {
        if (notiCenter.getCenterId() != data.centerId) {
            if (notiCenter.getNotiById(data.Id) != null) notiCenter.getNotiById(data.Id).close(true);
        }

    } else if (data.Action == "changeCenter") {
        if (notiCenter.getCenterId() != data.centerId) notiCenter.reset();

    } else if (data.Action == "badge") {
        notiCenter.setBadge(data.BadgeCount, data.isImportant == 1);
    };
});

addSocketEventListener("Notification", function (data, counter) {
    var noti = CreateNotification(data);
    if (counter != 1) noti.setAllowBrowserNotification(false).setSoundId(0);
    noti.showInPage();
});

addSocketEventListener("NotificationUpdate", function (data) {
    var noti = notiCenter.getNotiById(data.Id);
    if (!noti) {
        noti = notiCenter.getNotiByExtraId(data.LinkCode);
        if (!noti) return false;
    }
    if (data.ExtraData != '') data.ExtraData = JSON.parse(data.ExtraData);

    if (data.NotificationMode == NOTIFICATION_TYPE.Email) { CreateEmailNotificationContent(noti, data); };
    if (data.NotificationMode == NOTIFICATION_TYPE.Sms) { CreateSmsNotificationContent(noti, data); };

});

function GetNotificationModuleIcon(mode) {
    switch (mode) {
        case NOTIFICATION_TYPE.CallerId: return 'icon-phone';
        case NOTIFICATION_TYPE.Payments: return 'icon-donate';
        case NOTIFICATION_TYPE.Invoice: return 'icon-usd-circle';
        case NOTIFICATION_TYPE.Email: return 'icon-envelope';
        case NOTIFICATION_TYPE.Sms: return 'icon-comment-dots';
        case NOTIFICATION_TYPE.PublicChat: return 'icon-comment-alt-lines';
        case NOTIFICATION_TYPE.Comment: return 'icon-comment';
        case NOTIFICATION_TYPE.Cartabl: return 'icon-inbox';
        case NOTIFICATION_TYPE.Chat: return 'icon-comment-alt-lines';
        case NOTIFICATION_TYPE.Workflow: return 'icon-workflow';
        case NOTIFICATION_TYPE.Form: return 'icon-list-alt';
        case NOTIFICATION_TYPE.Customer: return 'icon-user-circle';
    }
    return 'icon-bell-o';
}

function CreateEmailNotificationContent(noti, data) {
    noti.setExtraId(data.LinkCode);
    var description = data.Description + '\n '
    var progress=0;
    if (data.ExtraData != null) {
        if (data.ExtraData.Send != 0) { description += data.ExtraData.Send + ' ' + resources.smsStatus[1] + ' ' }
        if (data.ExtraData.NotSend != 0) { description += data.ExtraData.Send + ' ' + resources.smsStatus[2] + ' ' }
        if (data.ExtraData.CountAll > 1) {
            if (data.ExtraData.Send != 0 || data.ExtraData.NotSend != 0) {
                description += ' ' + resources.from + ' ';
                description += data.ExtraData.CountAll + ' ' + resources.email;
            }
        }
         progress = Math.floor((data.ExtraData.Send + data.ExtraData.NotSend) * 100 / data.ExtraData.CountAll);
        if (progress == 100 && data.ExtraData.NotSend > 0 && ((data.Status == 4 || data.Status == 5) || data.Status == undefined)) {
            noti.addButton(resources.send_again_notsended, function () {
                sendAgainEmail(data.LinkCode);
            });
        }
    };

   
    noti.setTitle(data.Title).setDetail(description).setProgress(progress);
  
    // تغییر در صفحه مدیریت
    try {
        $("[id=email_sc_" + pId.replace("_", "") + "]").find(".mode_").html(data.Title).css("background-color", "#AAA");
    } catch (e) { }
};

function CreateSmsNotificationContent(noti, data) {
    noti.setExtraId(data.LinkCode);
    var description = data.Description + '\n '
    var progress = 0;
    if (data.ExtraData != null) {
        if (data.ExtraData.Send != 0) { description += data.ExtraData.Send + ' ' + resources.smsStatus[1] + ' ' }
        if (data.ExtraData.NotSend != 0) { description += data.ExtraData.Send + ' ' + resources.smsStatus[2] + ' ' }
        if (data.ExtraData.CountAll > 1) {
            if (data.ExtraData.Send != 0 || data.ExtraData.NotSend != 0) { description += ' ' + resources.from + ' '; }
            description += data.ExtraData.CountAll + ' ' + resources.sms;
        }
         progress = Math.floor(data.ExtraData.Send * 100 / data.ExtraData.CountAll);
    }

    noti.setTitle(data.Title).setDetail(description).setProgress(progress);

    if (data.SmsEndStatus != undefined) {
        noti.clearButtons();
        $.each(data.SmsEndStatus, function (i, item) {
            noti.addButton(i + " " + item);
        });
    };

    // تغییر در صفحه مدیریت

    try {
        $("[SMSPackId=" + data.SMSId + "]").find(".SMSPackElementStatus").html(status.Status);
    } catch (e) { }
    try {
        $("[id$=\"_lblAmount\"]").html(retObj.d[3]);
    } catch (e) { };
};


