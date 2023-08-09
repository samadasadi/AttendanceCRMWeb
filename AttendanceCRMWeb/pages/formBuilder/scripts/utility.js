function CreateFormUtility() {

    this.getQueryStrings = function (name, url) {
        if (!url) url = window.location.href; else url = url;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    this.numberLocalize = function (text, lang) {
        if (lang == null) lang = $('#HFlang').val();
        if (lang == null || lang == "en") return text;
        var str = text.toString();
        var persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        for (var i = 0; i <= 9; i++) str = str.replace(new RegExp(i, "g"), persian[i]);
        return str;
    }

    this.randomId = function (prefix) {
        return (prefix ? prefix : 'id') + Math.random().toString(36).substr(2, 10);
    }

    this.isInteger = function (text) {
        return !isNaN(parseInt(text)) && isFinite(text);
    }

    this.spiltWithComma = function (text) {
        if (text != undefined && text != null) {
            text = text.toString();
            var scale = '';
            if (text.indexOf(".") != -1) {
                scale = text.substr(text.indexOf("."), text.length);
                text = text.substr(0, text.indexOf("."));
            }
            text = text.replace(/,/gi, '');
            var result = text.substr(0, text.length % 3);
            text = text.substr(text.length % 3, text.length);
            for (i = 0; i < text.length; i = i + 3) result += ',' + text.substr(i, 3);
            if (result.charAt(0) == ",") result = result.substr(1, result.length);
            return result + scale;
        } else {
            return '';
        }
    }

    this.convertGregorianToJalali = function (date) {
        if (date == null || date == '') return '';
        var mDate = new JalaliDate(new Date(date));
        return mDate.getFullDate();
    }

    this.convertGregorianToJalaliObj = function (date) {
        if (date == null || date == '') return '';
        return new JalaliDate(new Date(date));
    }

    this.convertJalaliToGregorian = function (jalaliStr) {
        var jalaliDate = this.convertStrToJalali(jalaliStr);
        if (jalaliDate == null || jalaliDate == '') return '';
        return jalaliDate.getFullDateGregorian();
    }

    this.convertStrToJalali = function (jalaliStr) {
        if (jalaliStr == null || jalaliStr == '') return '';
        var arrDate = jalaliStr.split('/');
        return new JalaliDate(parseInt(arrDate[0]), parseInt(arrDate[1]) - 1, parseInt(arrDate[2]));
    }

    this.getCurrentDate = function (lang) {
        if (lang == 'fa') {
            var today = new JalaliDate();
            return today.getFullDate();
        } else {
            var today = new Date();
            var padNumber = function (num) { var number = parseInt(num); return number < 10 ? '0' + number : number.toString(); }
            return padNumber(today.getMonth() + 1) + "/" + padNumber(today.getDate()) + "/" + today.getFullYear();
        }
    }

    this.getCurrentDateStr = function (lang) {
        if ((lang == null && $('#HFlang').val() == 'fa') || lang == 'fa') {
            moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });
            return moment().format('dddd jD jMMMM jYYYY');
        } else {
            moment.locale('en');
            return moment().format('dddd, MMMM D, YYYY');
        }
    }

    this.convertDate = function (date, lang, addedMinuts) {
        if (addedMinuts == null) addedMinuts = parseInt($('#HFTimeZone').val()) || 0;
        if ((lang == null && $('#HFlang').val() == 'fa') || lang == 'fa') {
            moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });
        } else {
            moment.locale('en');
        }
        var mDate = moment(date, 'MM/DD/YYYY HH:mm').add(addedMinuts, 'm');
        //if (mDate.isDST()) mDate.add(60, 'm');
        return mDate;
    }

    this.getCurrentTime = function () {
        var padNumber = function (number) { return parseInt(number) < 10 && parseInt(number) >= 0 ? '0' + number.toString() : number.toString(); }
        var d = new Date();
        h = d.getHours();
        m = d.getMinutes();
        return padNumber(h) + ':' + padNumber(m);
    }

    this.shuffleArray = function (array_) {
        var arr = $.extend(true, [], array_)
        var currentIndex = arr.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = temporaryValue;
        }
        return arr;
    }

    this.loadMap = function (listener) {
        var win = window;
        if (win.frmViewMapLoader == null) {
            win.frmViewMapArrayLoader = new Array();

            /*
            win.frmViewMapLoader = function (callback) {
                if (typeof google === 'object' && typeof google.maps === 'object') {
                    callback();
                } else {
                    if (!win.frmViewMapIsLoading) {
                        win.frmViewMapIsLoading = true;
                        win.frmViewMapArrayLoader.push(callback);
                        $.getScript('https://maps.google.com/maps/api/js?key=AIzaSyAWEAOmd1yaWqrv-joWDcZk7z8-kBEjnYs&sensor=false&libraries=places', function () {
                            $.each(win.frmViewMapArrayLoader, function (l, loaderItem) {
                                loaderItem();
                            });
                        });
                    } else {
                        win.frmViewMapArrayLoader.push(callback);
                    }
                }
            }*/

            win.frmViewMapLoader = function (callback) {
                if (typeof window.L === 'object' && window.L.map) {
                    callback();
                } else {
                    if (!win.frmViewMapIsLoading) {
                        win.frmViewMapIsLoading = true;
                        win.frmViewMapArrayLoader.push(callback);
                        $('head').append('<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" type="text/css" />');
                        $.getScript('https://unpkg.com/leaflet@1.7.1/dist/leaflet.js', function () {
                            $.each(win.frmViewMapArrayLoader, function (l, loaderItem) {
                                loaderItem();
                            });
                        });
                    } else {
                        win.frmViewMapArrayLoader.push(callback);
                    }
                }
            }
        }

        win.frmViewMapLoader(function () {
            listener();
        });
    }

    this.postExtra = function (url, data, callback) {
        var e = { token: [$('#HFdomain').val(), $('#HFUserCode').val(), $('#HFcodeDU').val()], data: data };
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(e),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (c) {
                if (callback) callback(c.d.status == 1, c.d.message, c.d.data);
            },
            error: function (c) {
                if (callback) callback(false, '', '');
            }
        });
    }

    this.post = function (url, data, callback) {
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function (c) {
                if (callback) callback(c.status == 1, c.message, c.data);
            },
            error: function (c) {
                if (callback) callback(false, '', '');
            }
        });
    }

    this.postForm = function (url, data, callback, onProgress) {

        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var response = JSON.parse(request.responseText);
                if (callback) callback(response.status == 1, response.message, response.data);
            }
        }

        request.upload.onprogress = function (ev) {
            if (ev.lengthComputable) {
                var percent = parseInt((ev.loaded / ev.total) * 100);
                if (onProgress) onProgress(percent);
            }
        }

        request.addEventListener('error', function () {
            if (callback) callback(false, '', '');
        });

        request.open('POST', url);
        request.send(data);

    }
}
var FormUtility = new CreateFormUtility();
