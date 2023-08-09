var resourceSoundRecorder = {};
resourceSoundRecorder['fa'] = {
    ready: 'آماده',
    show_permist_window: 'نمایش پنجره درخواست اجازه',
    recording: 'در حال ضبط صدا',
    stop_recording: 'پایان ضبط صدا',
    no_microphone_found: 'میکروفن پیدا نشد',
    microphone_connected: 'میکروفن متصل میباشد'
}
resourceSoundRecorder['en'] = {
    ready: 'Ready',
    show_permist_window: 'displays asking permission',
    recording: 'Recording',
    stop_recording: 'Stop recording',
    no_microphone_found: 'Mirophone not found',
    microphone_connected: 'Microphone connected'
}
var resSoundRecorder;


(function (global) {
    var Recorder;

    var RECORDED_AUDIO_TYPE = "audio/wav";

    Recorder = {
        recorder: null,
        recorderOriginalWidth: 0,
        recorderOriginalHeight: 0,
        uploadFormId: null,
        uploadFieldName: null,
        isReady: false,

        connect: function (name, attempts) {
            if (navigator.appName.indexOf("Microsoft") != -1) {
                Recorder.recorder = window[name];
            } else {
                Recorder.recorder = document[name];
            }

            if (attempts >= 40) {
                return;
            }

            // flash app needs time to load and initialize
            if (Recorder.recorder && Recorder.recorder.init) {
                Recorder.recorderOriginalWidth = Recorder.recorder.width;
                Recorder.recorderOriginalHeight = Recorder.recorder.height;
                if (Recorder.uploadFormId && $) {
                    var frm = $(Recorder.uploadFormId);
                    Recorder.recorder.init(frm.attr('action').toString(), Recorder.uploadFieldName, frm.serializeArray());
                }
                return;
            }

            setTimeout(function () { Recorder.connect(name, attempts + 1); }, 100);
        },

        playBack: function (name) {
            // TODO: Rename to `playback`
            Recorder.recorder.playBack(name);
        },

        pausePlayBack: function (name) {
            // TODO: Rename to `pausePlayback`
            Recorder.recorder.pausePlayBack(name);
        },

        playBackFrom: function (name, time) {
            // TODO: Rename to `playbackFrom`
            Recorder.recorder.playBackFrom(name, time);
        },

        record: function (name, filename) {
            Recorder.recorder.record(name, filename);
        },

        stopRecording: function () {
            Recorder.recorder.stopRecording();
        },

        stopPlayBack: function () {
            // TODO: Rename to `stopPlayback`
            Recorder.recorder.stopPlayBack();
        },

        observeLevel: function () {
            Recorder.recorder.observeLevel();
        },

        stopObservingLevel: function () {
            Recorder.recorder.stopObservingLevel();
        },

        observeSamples: function () {
            Recorder.recorder.observeSamples();
        },

        stopObservingSamples: function () {
            Recorder.recorder.stopObservingSamples();
        },

        resize: function (width, height) {
            Recorder.recorder.width = width + "px";
            Recorder.recorder.height = height + "px";
        },

        defaultSize: function () {
            Recorder.resize(Recorder.recorderOriginalWidth, Recorder.recorderOriginalHeight);
        },

        show: function () {
            Recorder.recorder.show();
        },

        hide: function () {
            Recorder.recorder.hide();
        },

        duration: function (name) {
            // TODO: rename to `getDuration`
            return Recorder.recorder.duration(name || Recorder.uploadFieldName);
        },

        getBase64: function (name) {
            var data = Recorder.recorder.getBase64(name);
            if (data == "")
                return data;
            else
                return data;
                //return 'data:' + RECORDED_AUDIO_TYPE + ';base64,' + data;
        },

        getBlob: function (name) {
            var base64Data = Recorder.getBase64(name).split(',')[1];
            return base64toBlob(base64Data, RECORDED_AUDIO_TYPE);
        },

        getCurrentTime: function (name) {
            return Recorder.recorder.getCurrentTime(name);
        },

        isMicrophoneAccessible: function () {
            return Recorder.recorder.isMicrophoneAccessible();
        },

        updateForm: function () {
            var frm = $(Recorder.uploadFormId);
            Recorder.recorder.update(frm.serializeArray());
        },

        showPermissionWindow: function (options) {
            Recorder.resize(240, 160);
            // need to wait until app is resized before displaying permissions screen
            var permissionCommand = function () {
                if (options && options.permanent) {
                    Recorder.recorder.permitPermanently();
                } else {
                    Recorder.recorder.permit();
                }
            };
            setTimeout(permissionCommand, 1);
        },

        configure: function (rate, gain, silenceLevel, silenceTimeout) {
            rate = parseInt(rate || 22);
            gain = parseInt(gain || 100);
            silenceLevel = parseInt(silenceLevel || 0);
            silenceTimeout = parseInt(silenceTimeout || 4000);
            switch (rate) {
                case 44:
                case 22:
                case 11:
                case 8:
                case 5:
                    break;
                default:
                    throw ("invalid rate " + rate);
            }

            if (gain < 0 || gain > 100) {
                throw ("invalid gain " + gain);
            }

            if (silenceLevel < 0 || silenceLevel > 100) {
                throw ("invalid silenceLevel " + silenceLevel);
            }

            if (silenceTimeout < -1) {
                throw ("invalid silenceTimeout " + silenceTimeout);
            }

            Recorder.recorder.configure(rate, gain, silenceLevel, silenceTimeout);
        },

        setUseEchoSuppression: function (val) {
            if (typeof (val) != 'boolean') {
                throw ("invalid value for setting echo suppression, val: " + val);
            }

            Recorder.recorder.setUseEchoSuppression(val);
        },

        setLoopBack: function (val) {
            if (typeof (val) != 'boolean') {
                throw ("invalid value for setting loop back, val: " + val);
            }

            Recorder.recorder.setLoopBack(val);
        }
    };

    function base64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }


    global.FWRecorder = Recorder;


})(this);



/*----------------------------------  Handling FWR events ------------------------------------------*/

var timerSoundRecorder;
window.fwr_event_handler = function fwr_event_handler(a, b, c, d) {
    //console.log({ a: a, b: b, c: c, d: d });

    var getTime = function (intsec) {
        intsec = Math.ceil(intsec);
        var minuts = Math.floor(intsec / 60);
        var second = intsec % 60;
        return (minuts.toString().length == 1 ? '0' + minuts.toString() : minuts) + ':' + (second.toString().length == 1 ? '0' + second.toString() : second);
    }

    var name, $controls;
    switch (arguments[0]) {
        case "ready":
            $('.soundrecorder-message').text(resSoundRecorder.ready);

            //   FWRecorder.uploadFormId = "#uploadForm";
            //   FWRecorder.uploadFieldName = "upload_file[filename]";
            FWRecorder.connect("recorderApp", 0);
            FWRecorder.recorderOriginalWidth = arguments[1];
            FWRecorder.recorderOriginalHeight = arguments[2];

            break;

        case "no_microphone_found":
            $('.soundrecorder-message').text(resSoundRecorder.no_microphone_found);
            break;

        case "microphone_user_request":
            $('.soundrecorder-message').text(resSoundRecorder.show_permist_window);
            $('#recorderApp').addClass("floating");
            FWRecorder.showPermissionWindow();
            break;

        case "microphone_connected":
            FWRecorder.isReady = true;
            $('.soundrecorder-message').text(resSoundRecorder.microphone_connected);
            FWRecorder.configure(8);
            // FWRecorder.setLoopBack(true);
            break;

        case "permission_panel_closed":
            FWRecorder.defaultSize();
            $('#recorderApp').removeClass("floating");
            break;

        case "microphone_activity":

            break;

        case "recording":
            var filename = arguments[1];
            $('[filename=' + filename + ']').attr('record', '1');

            var BtnRecord = $('[filename=' + filename + '] .soundrecorder-record-button');
            BtnRecord.removeClass('record').addClass('stop');

            $('[filename=' + filename + '] .soundrecorder-message').text(resSoundRecorder.recording);
            $('[filename=' + filename + '] .v-line').remove();
            FWRecorder.observeLevel();

            var intSec = 0;
            var setTimerRecord = function () {
                intSec++;
                $('[filename=' + filename + '] .soundrecorder-time').text(getTime(intSec));
            }
            setTimerRecord();
            clearInterval(timerSoundRecorder);
            timerSoundRecorder = setInterval(function () { setTimerRecord(); }, 1000);

            break;

        case "recording_stopped":
            var filename = arguments[1];
            $('[record=1] .soundrecorder-visualization:first .bg-line').css('width', 0);
            $('[filename=' + filename + ']').attr('record', '0');

            var BtnRecord = $('[filename=' + filename + '] .soundrecorder-record-button');
            BtnRecord.addClass('record').removeClass('stop');

            $('[filename=' + filename + '] .soundrecorder-message').text(resSoundRecorder.stop_recording);

            $('[filename=' + filename + '] .soundrecorder-time').text(getTime(arguments[2]));

            FWRecorder.stopObservingLevel();

            clearInterval(timerSoundRecorder);

            break;

        case "microphone_level":
            var range = arguments[1] * 30;
            var visual = $('[record=1] .soundrecorder-visualization:first');
            var visualBar = $('<div>').addClass('v-line').css({ 'height': range, 'left': visual.find('.v-line').length + 1, top: (40 - range) / 2 });
            visual.find('.bg-line').css('width', range * 2 + '%');
            visual.append(visualBar);
            break;

        case "observing_level":

            break;

        case "observing_level_stopped":

            break;

        case "playing":
            var filename = arguments[1];
            var BtnPlay = $('[filename=' + filename + '] .soundrecorder-play-button');
            BtnPlay.removeClass('play').addClass('stop');

            break;

        case "playback_started":

            break;

        case "stopped":
            var filename = arguments[1];
            var BtnPlay = $('[filename=' + filename + '] .soundrecorder-play-button');
            BtnPlay.removeClass('stop').addClass('play');

            break;

        case "playing_paused":

            break;

        case "save_pressed":

            break;

        case "saving":

            break;

        case "saved":

            break;

        case "save_failed":

            break;

        case "save_progress":

            break;
    }
};

$(function () {
    $.SoundRecorder = function (options, Container) {
        var FirstOption = options;
        options = $.extend({}, defaultOptions, options);

        resSoundRecorder = resourceSoundRecorder[options.lang];

        /*------------------------create element-------------------------*/
        var num = $('.soundrecorder-container').length + 1;
        var filename = 'audio_' + num;
        var soundContainer = $(
        '<div class="soundrecorder-container" id="soundrecorder-container-' + num + '" filename="' + filename + '">' +
        '    <div class="soundrecorder-margin">' +
        '        <div class="soundrecorder-buttons">' +
        '            <div class="soundrecorder-record-button record"></div>' +
        '            <div class="soundrecorder-play-button play"></div>' +
        '        </div>' +
        '        <div class="soundrecorder-data">' +
        '            <div class="soundrecorder-visualization">' +
        '                <div class="bg-line"></div>' +
        '                <div class="h-line"></div>' +
        '            </div>' +
        '            <div class="soundrecorder-message"></div>' +
        '            <div class="soundrecorder-time">00:00</div>' +
        '        </div>' +
        '    </div>' +
        '</div>');
        Container.append(soundContainer);
        var BtnRecord = soundContainer.find('.soundrecorder-record-button');
        var BtnPlay = soundContainer.find('.soundrecorder-play-button');

        BtnRecord.click(function () {
            if (BtnRecord.hasClass('record')) {
                FWRecorder.record(filename, filename + '.wav');
            } else {
                FWRecorder.stopRecording(filename);
            }
        });

        BtnPlay.click(function () {
            if (BtnPlay.hasClass('play')) {
                FWRecorder.playBack(filename);
            } else {
                FWRecorder.stopPlayBack();
            }
        });

        if (num == 1) {
            //  Embedding flash object ---------------------------------------------------------------------------------------------
            $('body').prepend('<div class="soundrecorder-flashcontent"><object type="application/x-shockwave-flash" id="recorderApp" name="recorderApp" data="../Themes/resources/sounds/recorder.swf" width="24px" height="24px" class="" style="visibility: visible;"><param name="flashvars" value="upload_image=../Themes/resources/images/switch.png"></object></div>');
            //  swfobject.embedSWF("recorder.swf", "recorderApp", 24, 24, "11.0.0", "",
            //     { 'upload_image': 'images/upload.png' }, {}, { 'id': "recorderApp", 'name': "recorderApp" });
        }

    }

    $.fn.SoundRecorder = function (options, values) {
        if (typeof options === 'string') {
            var filename = $(this).find('.soundrecorder-container').attr('filename');
            if (options == "get") {
                return FWRecorder.getBase64(filename);
            } else if (options == "set") {

            }
        } else {
            return this.each(function () {
                (new $.SoundRecorder(options, $(this)));
            })
        }
    }

    var defaultOptions = {
        lang: 'fa'
    };

});