﻿ /* http://keith-wood.name/calendars.html
   Farsi/Persian localisation for Gregorian/Julian calendars for jQuery.
   Javad Mowlanezhad -- jmowla@gmail.com */
(function($) {
	$.calendars.calendars.gregorian.prototype.regional['fa'] = {
		name: 'Gregorian',
		epochs: ['BCE', 'CE'],
		monthNames: ['فروردين','ارديبهشت','خرداد','تير','مرداد','شهريور',
		'مهر','آبان','آذر','دي','بهمن','اسفند'],
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		dayNames: ['يکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'],
		dayNamesShort: ['ي','د','س','چ','پ','ج', 'ش'],
		dayNamesMin: ['ي','د','س','چ','پ','ج', 'ش'],
		dateFormat: 'dd/mm/YYYY',
		firstDay: 6,
		isRTL: true
	};
	if ($.calendars.calendars.julian) {
		$.calendars.calendars.julian.prototype.regional['fa'] =
			$.calendars.calendars.gregorian.prototype.regional['fa'];
	}
})(jQuery);
