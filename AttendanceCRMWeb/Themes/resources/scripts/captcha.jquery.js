﻿jQuery.QapTcha = {
	build : function(options) {
        if (options=="fa"){
	        var defaults = {txtLock : 'برای ثبت اطلاعات قفل را به راست بکشید',txtUnlock : 'اکنون می توانید اطلاعات خود را ثبت کنید'};   
		}else{
            var defaults = {txtLock : 'For registration information, right down to the lock',txtUnlock : 'Now you can register your information.'}; 
        }
		if(this.length>0)
		return jQuery(this).each(function(i) {
			/** Vars **/
			var 
				opts = $.extend(defaults, options),      
				$this = $(this),
				form = $('form').has($this),
				Clr = jQuery('<div>',{'class':'clr'}),
				bgSlider = jQuery('<div>',{id:'bgSlider'}),
				Slider = jQuery('<div>',{id:'Slider'}),
				Icons = jQuery('<div>',{id:'Icons'}),
				TxtStatus = jQuery('<div>',{id:'TxtStatus','class':'dropError',text:opts.txtLock}),
				inputQapTcha = jQuery('<input>',{name:'iQapTcha',value:generatePass(),type:'hidden'});
			
			/** Disabled submit button **/
			form.find('input[type=\'submit\']').attr('disabled','disabled');
			
			/** Construct DOM **/
		    bgSlider.appendTo($this);
		    Icons.insertAfter(bgSlider);
		    Clr.insertAfter(Icons);
		    TxtStatus.insertAfter(Clr);
		    inputQapTcha.appendTo($this);
		    Slider.appendTo(bgSlider);
	        $this.show();
			
			Slider.draggable({ 
				containment: bgSlider,
				axis:'x',
				stop: function(event,ui){
					if(ui.position.left > 113)
					{
					
						
					            Slider.draggable('disable').css('cursor','default');
								//inputQapTcha.val("");
								TxtStatus.text(opts.txtUnlock).addClass('dropSuccess').removeClass('dropError');
								Icons.css('background-position', '-16px 0');
					            form.find('input[type=\'submit\']').removeAttr('disabled');
					            
					            
						
					}
				}
			});
			
			function generatePass() {
		        var chars = 'azertyupqsdfghjkmwxcvbn23456789AZERTYUPQSDFGHJKMWXCVBN';
		        var pass = '';
		        for(i=0;i<10;i++){
		            var wpos = Math.round(Math.random()*chars.length);
		            pass += chars.substring(wpos,wpos+1);
		        }
		        return pass;
		    }
			
		});
	}
}; jQuery.fn.QapTcha = jQuery.QapTcha.build;