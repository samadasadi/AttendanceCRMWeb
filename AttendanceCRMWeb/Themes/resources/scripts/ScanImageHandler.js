/// <reference path="jquery-1.4.4.min.js" />

function ScanImageCenter(lang, timeZoneAddedMinuts) {
    var that = this;
    var userListManager = new UserListManager();

    var onRequestScanImage = function (deviceId, message, action, callback) { }
    that.setOnRequestScanImage = function (listener) { onRequestScanImage = listener }

    that.receiveFingerPrintImage = userListManager.receiveFingerPrintImage;
    that.setViewRvgImage = userListManager.setViewRvgImage;
    that.setViewScannerList = userListManager.setViewScannerList;
    that.setSearchPatient = userListManager.setSearchPatient;
    that.setAttendanceLog = userListManager.setAttendanceLog;


    function UserListManager() {
        var self = this;

        self.receiveFingerPrintImage = function (data) {
            $("#scanfinger").attr("src", "data:image/bmp;base64," + data);
            $("#Image").val(data);
        }
        self.setViewRvgImage = function (data) {
            window.imageEditor.loadImageFromURL("data:image/bmp;base64," + data, 'My sample image');
            $("#Image").val(data);
        }
        self.setViewScannerList = function (data) {

            //if (data.length > 0) {
            if (data) {
                var respion = "";
                $.each(data, function (i, iem) {
                    respion += "<option value='" + iem.Value + "'>" + iem.Data + "</option>";
                });
                $("#cboScannerName").append(respion);
            }
        }
        self.setSearchPatient = function (id) {

            if (id == "00000000-0000-0000-0000-000000000001") {
                AlertDialog("دستگاه اثر انگشت متصل نیست", "خطا", "error");
                return;
            }
            if (id == "00000000-0000-0000-0000-000000000002") {
                AlertDialog("ارتباط با دیتابیس برقرار نشد لطفا از بخش تنظیمات اطلاعات ارتباط با دیتا بیس را وارد نمایید", "خطا", "error");
                return;
            }
            if (id == "00000000-0000-0000-0000-000000000000") {
                AlertDialog("اثر انگشت شما یافت نشد", "خطا");
            }
            else {
                $.post("/Admin/CustomerInfo/SearchPatiantById?Id=" + id + "&SelectCount=" + $('#SelectCount').val() + "&page=" + 1,
                    function (result) {
                        MinaDent.SearchModal.RefreshGridHtml(result);
                    });
            }
        }
        self.setAttendanceLog = function (id, msg) {

            if (id == "00000000-0000-0000-0000-000000000000") {
                if (msg == "R")
                    AlertDialog("لطفا یک دقیقه صبر نمایید", "خطا");
                else
                    AlertDialog("اثر انگشت شما یافت نشد", "خطا");
            }
            else {
                AlertDialog(msg, "موفق");
            }
        }

    }


    $("#scanPatient").click(function () {
        var _device = $("#FingerPrintDevice").val();
        onRequestScanImage(_device, "RegisterEmployee", 0, function (res) { });
    });


    //$("#ScannerPic").click(function () {

    //    var x = document.getElementById("divPictureBox");
    //    x.style.display = "block";
    //    var _device = $("#ScannerAppDevice").val();

    //    onRequestScanImage(_device, "ScannerPic" + "," + $("#cboScannerName").val() + "," + $("#FormmatSave").val(), 1, function (res) { });

    //});


    that.RequestScanImage = function(deviceId, message, action, callback) {
        onRequestScanImage(deviceId, message, action, callback);
    }


    $("#btnSearchFinger").click(function () {

        //_server.server.Scan("SearchPatient", "");

        //var _device = $("#ScannerAppDevice").val();
        onRequestScanImage("0", "SearchPatient", 3, function (res) { });

    });


    $("#scanEmployee").click(function () {
        //if (_isCallerActiv == "1") {
        //    if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.disconnected) {
        //        StartHubConnection();
        //    }
        //    var _device = $("#FingerPrintDevice").val();
        //    _server.server.Scan("RegisterEmployee", _device);
        //}
        //else {
        //    AlertDialog("امکان ارتباط با سخت افزار برای شما فعال نشده است", "خطا", "error", "center");
        //}
        var _device = $("#FingerPrintDevice").val();
        onRequestScanImage(_device, "RegisterEmployee", 0, function (res) { });

    });


}
var scanImageCenter = new ScanImageCenter($("#HFlang").val(), $("#HFTimeZone").val());
scanImageCenter.setOnRequestScanImage(function (deviceId, message, action, callback) {

    postScanCommand('ScannerDeviceCommand', {
        toId: deviceId,
        message: message,
        fromId: $('#HFUser_id').val(),
        action: action
    },
        function (result) {
            callback(true, result);
        }
    );
});
addSocketEventListener('ImageScanning', function (socketData, tabNum) {
    var ACTION_TYPE = { SCAN_FINGERPRINT: 0, SCAN_RVG: 1, SCAN_LIST: 2, SCAN_SEARCH_PATIENT: 3, SCAN_ATTENDANCE: 4 };
    var action = socketData[0];
    var data = socketData[1];
    switch (action) {
        case ACTION_TYPE.SCAN_FINGERPRINT:
            scanImageCenter.receiveFingerPrintImage(data);
            break;
        case ACTION_TYPE.SCAN_RVG:
            scanImageCenter.setViewRvgImage(data);
            break;
        case ACTION_TYPE.SCAN_LIST:
            scanImageCenter.setViewScannerList(data);
            break;
        case ACTION_TYPE.SCAN_SEARCH_PATIENT:
            scanImageCenter.setSearchPatient(data);
            break;
        case ACTION_TYPE.SCAN_ATTENDANCE:
            scanImageCenter.setAttendanceLog(data[0], data[1]);
            break;
    }
});
function postScanCommand(methodName, data, callback, onProgress) {

    //var url = '/' + $('#HFdomain').val() + '/chat/' + methodName;
    var url = '/SocketHandler/' + methodName;
    var formData = new FormData();
    formData.append("token", [$('#HFdomain').val(), $('#HFUserCode').val(), $('#HFcodeDU').val()]);//test
    for (var key in data) {
        formData.append(key, data[key]);
    }

    //way 2
    AjaxCallAction('POST', url, data, true, callback, false);
    //AjaxChat('POST', url, formData, true, callback);

}





