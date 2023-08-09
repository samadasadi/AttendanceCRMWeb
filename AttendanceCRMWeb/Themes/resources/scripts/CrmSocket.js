
function initWenSocket() {
    //var wsUri = $("#HFServerurl").val().replace("http", "ws") + "/pages/SocketHandler.ashx?d=" + $("#HFdomain").val() + "&u=" + $("#HFUserCode").val() + "&c=" + $("#hfcodeing").val()
    //var wsUri = window.location.origin.replace("http", "ws") + "/pages/SocketHandler.ashx?d=" + $("#HFdomain").val() + "&u=" + $("#HFUserCode").val() + "&c=" + $("#hfcodeing").val()
    var wsUri = window.location.origin.replace("http", "ws") + "/SocketHandler/SocketHandler?d=" + $("#HFdomain").val() + "&u=" + $("#HFUserCode").val() + "&c=" + $("#HFUser_id").val()
    //var wsUri = window.location.origin.replace("http", "ws") + "/api/SocketHandle/SocketHandler?d=" + $("#HFdomain").val() + "&u=" + $("#HFUserCode").val() + "&c=" + $("#HFUser_id").val()
    websocket = new WebSocket(wsUri);
    websocket.onopen = function (evt) { onOpenWebsocket(evt) };
    websocket.onclose = function (evt) { onCloseWebsocket(evt) };
    websocket.onmessage = function (evt) { onMessageWebsocket(evt) };
    websocket.onerror = function (evt) { onErrorWebsocket(evt) };
}
$(function () { initWenSocket(); });

function onOpenWebsocket(evt) {
    doSend("WebSocket");
}

//when call Disconnect
function onCloseWebsocket(evt) {
    setTimeout(initWenSocket, 5000);
}

//When Recived Message
function onMessageWebsocket(evt) {
    var receivedData = JSON.parse(evt.data)
    $.each(arrSocketEventListener, function (c, channel) {
        if (channel[0] == receivedData.channel) channel[1](receivedData.data, receivedData.counter);
    });
}

function onErrorWebsocket(evt) {

}

function doSend(message) {
    websocket.send(message);
}

var arrSocketEventListener = [];
function addSocketEventListener(channel, callback) {
    if (jQuery.grep(arrSocketEventListener, function (a) { return a[0] == channel }).length == 0)
    arrSocketEventListener.push([channel, callback]);
}


