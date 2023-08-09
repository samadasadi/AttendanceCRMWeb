var Comet = function () {
    var ArrFnListener = new Array();
    var ArrFnListenerChannel = new Array();
    var started = false;
    var setChannels = false;
    var UseComet = ($('#HFUseComet').val() == "true") ? true : false;
    this.start = function (data) {
        waitrequest(null);
    }
    waitrequest = function (data) {
        if (data && data.length != null) {
            $.each(ArrFnListener, function (i, item) {
                var request = $.grep(data, function (e) { return e.Channel == item.channel; });
                if (request.length != 0) item.callback(request);
            });
            $.each(ArrFnListenerChannel, function (i, item) {
                var request = $.grep(data, function (e) { return e.Channel == item.channel; });
                if (request.length != 0) item.callback(request);
            });
        }
        $.ajax({
            url: '../pages/comet.ashx?d=' + $('#HFdomain').val() + '&u=' + $('#HFUserCode').val() + '&c=' + $('#HFcodeDU').val() + '&clientId=' + clientId + '&comet=' + $('#HFUseComet').val(),
            dataType: "json",
            cache: false,
            success: function (c) {
                started = true;
                if (UseComet) waitrequest(c); else setTimeout(function () { waitrequest(c); }, 1000);
            },
            error: function (c) {
                if (UseComet) waitrequest(c); else setTimeout(function () { waitrequest(c); }, 1000);
            },
        });
    };
    var updatechannel_ = function () {
        if (!started) { setTimeout(function () { updatechannel_(); started = true; }, 500); return false; }
        var arrChannel = new Array();
        $.each(ArrFnListenerChannel, function (i, item) { if (arrChannel.indexOf(item.channel)) arrChannel.push(item.channel); });
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.channels = arrChannel;
        e.o.clientId = clientId;
        $.ajax({
            type: "POST", url: "../pages/server.aspx/update_channels",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                setChannels = true;
            }
        });
    };
    this.updatechannel = function () {
        updatechannel_();
    };
    this.addListener = function (channel, callback) {
        ArrFnListener.push({ channel: channel, callback: callback });
    }
    this.addListenerChannel = function (channel, callback) {
        ArrFnListenerChannel.push({ channel: channel, callback: callback });
    }
    this.ExistsChannels = function (channels) {
        if (typeof channels === 'string') {
            return ($.grep(ArrFnListenerChannel, function (s) { return s.channel == channels }).length == 0) ? false : true;
        } else if (typeof channels === '[object Array]') {
            $.each(channels, function (i, item) {
                if ($.grep(ArrFnListenerChannel, function (s) { return s.channel == item }).length == 0) return false; else return true;
            });
        }
        return false;
    };
    this.checkStarted = started;
    this.checkSetChannels = function () { return setChannels };
}