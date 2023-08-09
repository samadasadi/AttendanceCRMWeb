
(function ($) {

    function formatCurrencyMask(input, isBlur) {
        var inputVal = input.val();
        if (inputVal === "") { return; }

        var numberWithCommas = true; // جدا کنده 3 تایی داشته باشد
        var numberOfDecimal = 0;// دو رقم اعشار داشته باشد - اگر صفر باشد اعشاری نمیشود

        var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
        var arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
        for (var i = 0; i < 10; i++) {
            inputVal = inputVal.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }

        var formatNumber = function (n) { //1000000 to 1,234,567
            if (numberWithCommas)
                return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            else
                return n.replace(/\D/g, "");
        }

        var orginalLen = inputVal.length;
        var caretPosition = input.attr("selectionStart");

        if (numberOfDecimal > 0) {
            // check for decimal
            if (inputVal.indexOf(".") >= 0) {
                var decimalPosition = inputVal.indexOf(".");

                var leftSide = inputVal.substring(0, decimalPosition);
                var rightSide = inputVal.substring(decimalPosition);

                leftSide = formatNumber(leftSide);

                rightSide = formatNumber(rightSide);

                if (isBlur) rightSide += ('0').repeat(numberOfDecimal);

                rightSide = rightSide.substring(0, numberOfDecimal);

                inputVal = leftSide + "." + rightSide;

            } else {
                inputVal = formatNumber(inputVal);
                if (isBlur) inputVal += '.' + ('0').repeat(numberOfDecimal);
            }
        } else {
            inputVal = formatNumber(inputVal);
        }

        input.val(inputVal);
    }

    $.fn.extend({
        setMask: function (options) {
            this.keyup(function () {
                formatCurrencyMask($(this), false);
            });

            this.blur(function () {
                formatCurrencyMask($(this), true);
            });
        },
        unsetMask: function () {
            this.unbind();
        }
    });
})(jQuery);