

; (function($) {
  

	$.fn.extend({
	        msDropDown: function(options)
	        {
	            return this.each(function()
	            {
	               $(this).data('dd', "DD");
	            });
	        }
	    });
		   
})(jQuery);


// change dropdawn(jqurey) when dropdown orginal cheange with javascript
function ddl_select_with_javascript(ddlname, value) {
    try {
        var e = document.getElementById(ddlname);

        var name = document.getElementById(ddlname).id;
        var elemowner = document.getElementById(name + '_child');
        for (i = 0; i < elemowner.childElementCount; i++) {
            elemowner.childNodes[i].className = 'enabled';
        }
        var ddl_title = document.getElementById(name + '_title');
        ddl_title.childNodes[1].innerText = value;


        var ddl_msa = document.getElementById(name + '_msa_' + e.selectedIndex);
        ddl_msa.className = 'selected enabled'
    } catch (e) { }
}

