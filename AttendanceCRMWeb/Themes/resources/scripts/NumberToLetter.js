
var s_0_9 = new Array('صفر', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه');
var s_10_19 = new Array('ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده');
var s_20_90 = new Array('بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود');
var s_100_900 = new Array('صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد');
var s_Parts = new Array('هزار', 'میلیون', 'میلیارد', 'تريليون');
var splitter = " و ";
var veryBig = "تعریف نشده";
var negative = "منفی";

function getPart(numberIn3) {
    if (numberIn3.length > 3) {
        return "";
    }

    var number = numberIn3.toString();

    switch (number.length) {
        case 1:
            number = "00" + number;
            break;
        case 2:
            number = "0" + number;
            break;
    }

    var outString = "";

    var n1 = parseInt(number.substr(0, 1));
    var n2 = parseInt(number.substr(1, 1));
    var n3 = parseInt(number.substr(2, 1));

    if (n1 != 0) {
        switch (n2) {
            case 0:
                if (n3 != 0) {
                    outString = s_100_900[n1 - 1] + splitter + s_0_9[n3];
                }
                else {
                    outString = s_100_900[n1 - 1];
                };
                break;
            case 1:
                outString = s_100_900[n1 - 1] + splitter + s_10_19[n3];
                break;
            default:
                if (n3 != 0) {
                    outString = s_100_900[n1 - 1] + splitter + s_20_90[n2 - 2] + splitter + s_0_9[n3];
                }
                else {
                    outString = s_100_900[n1 - 1] + splitter + s_20_90[n2 - 2];
                }
        }
    }
    else {
        switch (n2) {
            case 0:
                if (n3 != 0) {
                    outString = s_0_9[n3];
                }
                else {
                    outString = "";
                }
                break;
            case 1:
                outString = s_10_19[n3];
                break;
            default:
                if (n3 != 0) {
                    outString = s_20_90[n2 - 2] + splitter + s_0_9[n3];
                }
                else {
                    outString = s_20_90[n2 - 2];
                }
        }
    };

    return outString;
}
 
function convertFarsi(inputNumber) {
    inputNumber = inputNumber.toString();
    var tempNumber = Math.abs(inputNumber).toString();

    if (tempNumber.length == 0) {
        return "";
    }

    if (tempNumber == 0)
        return s_0_9[0];

    var partCount = Math.ceil((parseInt(tempNumber).toString().length / 3), 1);

    if (s_Parts.length < partCount)
        return veryBig;

    var partFullString = new Array();

    for (var i = 0; i < partCount; i++) {
        var numberLength3;

        var lengthToSelectFirtPart;
        if (i == 0) {
            lengthToSelectFirtPart = tempNumber.length - ((partCount - 1) * 3);
            numberLength3 = tempNumber.substr((i * 3), lengthToSelectFirtPart);
        }
        else {
            numberLength3 = tempNumber.substr(lengthToSelectFirtPart + ((i - 1) * 3), 3);
        }

        var partInWord = getPart(numberLength3);

        var partIndex = (partCount - 2 - i);
        var partPreFix = s_Parts[partIndex];

        if (i == partCount - 1) {
            partPreFix = "";
        }

        if (i == 0) {
            if (partInWord != "") {
                partFullString[i] = partInWord + " " + partPreFix;
            }
            else {
                partFullString[i] = "";
            }
        }
        else {
            if (partFullString[i - 1] != "") {
                if (partInWord != "") {
                    partFullString[i] = splitter + partInWord + " " + partPreFix;
                }
                else {
                    partFullString[i] = "";
                }
            }
            else {
                if (partInWord != "") {
                    partFullString[i] = splitter + partInWord + " " + partPreFix;
                }
                else {
                    partFullString[i] = "";
                }
            }
        }
    }

    var outString = "";

    for (var i = 0; i < partFullString.length; i++) {
        outString += partFullString[i];
    }

    if (inputNumber.substr(0, 1) == "-") {
        outString = negative + " " + outString;
    }

    return outString;
}


/*_________________________________________________________________________________________________________________*/


var lt20 = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"],
    tens = ["", "ten", "twenty", "thirty", "fourty", "fifty", "sixty", "seventy", "eightty", "ninety"],
    scales = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion"],
    max = scales.length * 3;

function convertEnglish(val) {
    var len;
    val = val.toString();
    // special cases
    if (val[0] === "-") { return "negative " + convert(val.slice(1)); }
    if (val === "0") { return "zero"; }

    val = trim_zeros(val);
    len = val.length;

    // general cases
    if (len < max) { return convert_lt_max(val); }
    if (len >= max) { return convert_max(val); }
}

function convert_max(val) {
    return split_rl(val, max)
        .map(function (val, i, arr) {
            if (i < arr.length - 1) {
                return convert_lt_max(val) + " " + scales.slice(-1);
            }
            return convert_lt_max(val);
        })
        .join(" ");
}

function convert_lt_max(val) {
    var l = val.length;
    if (l < 4) {
        return convert_lt1000(val).trim();
    } else {
        return split_rl(val, 3)
            .map(convert_lt1000)
            .reverse()
            .map(with_scale)
            .reverse()
            .join(" ")
            .trim();
    }
}

function convert_lt1000(val) {
    var rem, l;

    val = trim_zeros(val);
    l = val.length;

    if (l === 0) { return ""; }
    if (l < 3) { return convert_lt100(val); }
    if (l === 3) { //less than 1000
        rem = val.slice(1);
        if (rem) {
            return lt20[val[0]] + " hundred " + convert_lt1000(rem);
        } else {
            return lt20[val[0]] + " hundred";
        }
    }
}

function convert_lt100(val) {
    if (is_lt20(val)) { // less than 20
        return lt20[val];
    } else if (val[1] === "0") {
        return tens[val[0]];
    } else {
        return tens[val[0]] + "-" + lt20[val[1]];
    }
}


function split_rl(str, n) {
    // takes a string 'str' and an integer 'n'. Splits 'str' into
    // groups of 'n' chars and returns the result as an array. Works
    // from right to left.
    if (str) {
        return Array.prototype.concat
            .apply(split_rl(str.slice(0, (-n)), n), [str.slice(-n)]);
    } else {
        return [];
    }
}

function with_scale(str, i) {
    var scale;
    if (str && i > (-1)) {
        scale = scales[i];
        if (scale !== undefined) {
            return str.trim() + " " + scale;
        } else {
            return convert(str.trim());
        }
    } else {
        return "";
    }
}

function trim_zeros(val) {
    return val.replace(/^0*/, "");
}

function is_lt20(val) {
    return parseInt(val, 10) < 20;
}

/*------------------------------------*/

function convertNumberToString(inputNumber, lanq) {
    switch (lanq) {
        case 'fa':
            return convertFarsi(inputNumber);
        case 'en':
            return convertEnglish(inputNumber);
    }
}