


var allUImenuAs = [];

$.fn.menuA = function(options){
	var caller = this;
	var options = options;
	var m = new menuA(caller, options);	
	allUImenuAs.push(m);
	
	$(this)
	.mousedown(function(){
		if (!m.menuAOpen) { m.showLoading(); };
	})	
	.click(function(){
		if (m.menuAOpen == false) { m.showmenuA(); }
		else { m.kill(); };
		return false;
	});	
};

function menuA(caller, options){
	var menuA = this;
	var caller = $(caller);
	var container = $('<div name="unpanel_menuA_Tree" id="unpanel_menuA_Tree" class="fg-menuA-container ui-widget ui-widget-content ui-corner-all">'+options.content+'</div>');
	
	this.menuAOpen = false;
	this.menuAExists = false;
	
	var options = jQuery.extend({
		content: null,
		width: 270, // width of menuA container, must be set or passed in to calculate widths of child menuAs
		maxHeight: 233, // max height of menuA (if a drilldown: height does not include breadcrumb)
		positionOpts: {
			posX: 'left', 
			posY: 'bottom',
			offsetX: 0,
			offsetY: 0,
			directionH: 'right',
			directionV: 'down', 
			detectH: true, // do horizontal collision detection  
			detectV: true, // do vertical collision detection
			linkToFront: false
		},
		showSpeed: 200, // show/hide speed in milliseconds
		callerOnState: 'ui-state-active', // class to change the appearance of the link/button when the menuA is showing
		loadingState: 'ui-state-loading', // class added to the link/button while the menuA is created
		linkHover: 'ui-state-hover', // class for menuA option hover state
		linkHoverSecondary: 'li-hover', // alternate class, may be used for multi-level menuAs		
	// ----- multi-level menuA defaults -----
		crossSpeed: 200, // cross-fade speed for multi-level menuAs
		crumbDefaultText: 'Please select',
		backLink: true, // in the ipod-style menuA: instead of breadcrumbs, show only a 'back' link
		backLinkText: 'Back',
		flyOut: false, // multi-level menuAs are ipod-style by default; this parameter overrides to make a flyout instead
		flyOutOnState: 'ui-state-default',
		nextmenuALink: 'ui-icon-triangle-1-e', // class to style the link (specifically, a span within the link) used in the multi-level menuA to show the next level
		topLinkText: 'All',
		nextCrumbLink: 'ui-icon-carat-1-e'	
	}, options);
	
	var killAllmenuAs = function(){
		$.each(allUImenuAs, function(i){
			if (allUImenuAs[i].menuAOpen) { };	
		});
	};
	
	this.kill = function(){
		caller
			.removeClass(options.loadingState)
			.removeClass('fg-menuA-open')
			.removeClass(options.callerOnState);	
		container.find('li').removeClass(options.linkHoverSecondary).find('a').removeClass(options.linkHover);		
		if (options.flyOutOnState) { container.find('li a').removeClass(options.flyOutOnState); };	
		if (options.callerOnState) { 	caller.removeClass(options.callerOnState); };			
		if (container.is('.fg-menuA-ipod')) { menuA.resetDrilldownmenuA(); };
		if (container.is('.fg-menuA-flyout')) { menuA.resetFlyoutmenuA(); };	
		container.parent().hide();	
		menuA.menuAOpen = false;
		$(document).unbind('click', killAllmenuAs);
		$(document).unbind('keydown');
	};
	
	this.showLoading = function(){
		caller.addClass(options.loadingState);
	};

	this.showmenuA = function(){
		killAllmenuAs();
		if (!menuA.menuAExists) { menuA.create() };
		caller
			.addClass('fg-menuA-open')
			.addClass(options.callerOnState);
	//container.parent().show().click(function(){ menuA.kill(); return false; });
			container.parent().show().click(function(e){
		var clik_helper;
		clik_helper=true;
 var aat = $(e.target.id);

	
		if (aat.selector=='unpanel_menuA_Tree')
		{
	
		
		}else{ menuA.kill(); return false; }
		
		});
   

		
		container.hide().slideDown(options.showSpeed).find('.fg-menuA:eq(0)');
		menuA.menuAOpen = true;
		caller.removeClass(options.loadingState);
		$(document).click(killAllmenuAs);
		
		// assign key events
		$(document).keydown(function(event){
			var e;
			if (event.which !="") { e = event.which; }
			else if (event.charCode != "") { e = event.charCode; }
			else if (event.keyCode != "") { e = event.keyCode; }
			
			var menuAType = ($(event.target).parents('div').is('.fg-menuA-flyout')) ? 'flyout' : 'ipod' ;
			
			switch(e) {
				case 37: // left arrow 
					if (menuAType == 'flyout') {
						$(event.target).trigger('mouseout');
						if ($('.'+options.flyOutOnState).size() > 0) { $('.'+options.flyOutOnState).trigger('mouseover'); };
					};
					
					if (menuAType == 'ipod') {
						$(event.target).trigger('mouseout');
						if ($('.fg-menuA-footer').find('a').size() > 0) { $('.fg-menuA-footer').find('a').trigger('click'); };
						if ($('.fg-menuA-header').find('a').size() > 0) { $('.fg-menuA-current-crumb').prev().find('a').trigger('click'); };
						if ($('.fg-menuA-current').prev().is('.fg-menuA-indicator')) {
							$('.fg-menuA-current').prev().trigger('mouseover');							
						};						
					};
					return false;
					break;
					
				case 38: // up arrow 
					if ($(event.target).is('.' + options.linkHover)) {	
						var prevLink = $(event.target).parent().prev().find('a:eq(0)');						
						if (prevLink.size() > 0) {
							$(event.target).trigger('mouseout');
							prevLink.trigger('mouseover');
						};						
					}
					else { container.find('a:eq(0)').trigger('mouseover'); }
					return false;
					break;
					
				case 39: // right arrow 
					if ($(event.target).is('.fg-menuA-indicator')) {						
						if (menuAType == 'flyout') {
							$(event.target).next().find('a:eq(0)').trigger('mouseover');
						}
						else if (menuAType == 'ipod') {
							$(event.target).trigger('click');						
							setTimeout(function(){
								$(event.target).next().find('a:eq(0)').trigger('mouseover');
							}, options.crossSpeed);
						};				
					}; 
					return false;
					break;
					
				case 40: // down arrow 
					if ($(event.target).is('.' + options.linkHover)) {
						var nextLink = $(event.target).parent().next().find('a:eq(0)');						
						if (nextLink.size() > 0) {							
							$(event.target).trigger('mouseout');
							nextLink.trigger('mouseover');
						};				
					}
					else { container.find('a:eq(0)').trigger('mouseover'); }		
					return false;						
					break;
					
				case 27: // escape
					killAllmenuAs();
					break;
					
				case 13: // enter
					if ($(event.target).is('.fg-menuA-indicator') && menuAType == 'ipod') {							
						$(event.target).trigger('click');						
						setTimeout(function(){
							$(event.target).next().find('a:eq(0)').trigger('mouseover');
						}, options.crossSpeed);					
					}; 
					break;
			};			
		});
	};
	
	this.create = function(){	
		container.css({ width: options.width }).appendTo('body').find('ul:first').not('.fg-menuA-breadcrumb').addClass('fg-menuA');
		container.find('ul, li a').addClass('ui-corner-all');
		
		// aria roles & attributes
		container.find('ul').attr('role', 'menuA').eq(0).attr('aria-activedescendant','active-menuAitem').attr('aria-labelledby', caller.attr('id'));
		container.find('li').attr('role', 'menuAitem');
		container.find('li:has(ul)').attr('aria-haspopup', 'true').find('ul').attr('aria-expanded', 'false');
		container.find('a').attr('tabindex', '-1');
		
		// when there are multiple levels of hierarchy, create flyout or drilldown menuA
		if (container.find('ul').size() > 1) {
			if (options.flyOut) { menuA.flyout(container, options); }
			else { menuA.drilldown(container, options); }	
		}
		else {
			container.find('a').click(function(){
				menuA.chooseItem(this);
				return false;
			});
		};	
		
		if (options.linkHover) {
			var allLinks = container.find('.fg-menuA li a');
			allLinks.hover(
				function(){
					var menuAitem = $(this);
					$('.'+options.linkHover).removeClass(options.linkHover).blur().parent().removeAttr('id');
					$(this).addClass(options.linkHover).focus().parent().attr('id','active-menuAitem');
				},
				function(){
					$(this).removeClass(options.linkHover).blur().parent().removeAttr('id');
				}
			);
		};
		
		if (options.linkHoverSecondary) {
			container.find('.fg-menuA li').hover(
				function(){
					$(this).siblings('li').removeClass(options.linkHoverSecondary);
					if (options.flyOutOnState) { $(this).siblings('li').find('a').removeClass(options.flyOutOnState); }
					$(this).addClass(options.linkHoverSecondary);
				},
				function(){ $(this).removeClass(options.linkHoverSecondary); }
			);
		};	
		
		menuA.setPosition(container, caller, options);
		menuA.menuAExists = true;
	};
	
	this.chooseItem = function(item){
		menuA.kill();
		// edit this for your own custom function/callback:
		if (item.name=='select1')
		{
			$('#hierarchybreadcrumb1').text( item.title );	
		}
		else
		if (item.name=='select1_Server')
		{
			$('#ctl00_ContentHolder_hierarchybreadcrumb1').text( item.title );	
		}
		else
		if ( item.name=='select2')
		{
			$('#hierarchybreadcrumb2').text( item.title);	
		}
		else
		if ( item.name=='select2_Server')
		{
			$('#ctl00_ContentHolder_hierarchybreadcrumb2').text( item.title);	
		}
		else
		if ( item.name=='select3')
		{
			$('#hierarchybreadcrumb3').text( item.title);	
		}
		else
		if ( item.name=='select3_Server')
		{
			$('#ctl00_ContentHolder_hierarchybreadcrumb3').text( item.title);	
		}
		
		else
		if ( item.name=='select4')
		{
			$('#hierarchybreadcrumb4').text( item.title);	
		}
		else
		if ( item.name=='select4_Server')
		{
			$('#ctl00_ContentHolder_hierarchybreadcrumb4').text( item.title);	
		}
		else
		if ( item.name=='select5')
		{
			$('#hierarchybreadcrumb5').text( item.title);	
		}
		
		else
		if ( item.name=='select5_Server')
		{
	
			$('#ctl00_ContentHolder_hierarchybreadcrumb5').text( item.title);	
		}
		
		else
		if ( item.name=='select6')
		{
			$('#hierarchybreadcrumb6').text( item.title);	
		}
	
	};
};

menuA.prototype.flyout = function(container, options) {
	var menuA = this;
	
	this.resetFlyoutmenuA = function(){
		var allLists = container.find('ul ul');
		allLists.removeClass('ui-widget-content').hide();	
	};
	
	container.addClass('fg-menuA-flyout').find('li:has(ul)').each(function(){
		var linkWidth = container.width();
		var showTimer, hideTimer;
		var allSubLists = $(this).find('ul');		
		
		allSubLists.css({ left: linkWidth, width: linkWidth }).hide();
			
		$(this).find('a:eq(0)').addClass('fg-menuA-indicator').html('<span>' + $(this).find('a:eq(0)').text() + '</span><span class="ui-icon '+options.nextmenuALink+'"></span>').hover(
			function(){
				clearTimeout(hideTimer);
				var subList = $(this).next();
				if (!fitVertical(subList, $(this).offset().top)) { subList.css({ top: 'auto', bottom: 0 }); };
				if (!fitHorizontal(subList, $(this).offset().left + 100)) { subList.css({ left: 'auto', right: linkWidth, 'z-index': 999 }); };
				showTimer = setTimeout(function(){
					subList.addClass('ui-widget-content').show(options.showSpeed).attr('aria-expanded', 'true');	
				}, 300);	
			},
			function(){
				clearTimeout(showTimer);
				var subList = $(this).next();
				hideTimer = setTimeout(function(){
					subList.removeClass('ui-widget-content').hide(options.showSpeed).attr('aria-expanded', 'false');
				}, 400);	
			}
		);

		$(this).find('ul a').hover(
			function(){
				clearTimeout(hideTimer);
				if ($(this).parents('ul').prev().is('a.fg-menuA-indicator')) {
					$(this).parents('ul').prev().addClass(options.flyOutOnState);
				}
			},
			function(){
				hideTimer = setTimeout(function(){
					allSubLists.hide(options.showSpeed);
					container.find(options.flyOutOnState).removeClass(options.flyOutOnState);
				}, 500);	
			}
		);	
	});
	
	container.find('a').click(function(){
		menuA.chooseItem(this);
		return false;
	});
};


menuA.prototype.drilldown = function(container, options) {
	var menuA = this;	
	var topList = container.find('.fg-menuA');	
	var breadcrumb = $('<ul class="fg-menuA-breadcrumb ui-widget-header ui-corner-all ui-helper-clearfix"></ul>');
	var crumbDefaultHeader = $('<li class="fg-menuA-breadcrumb-text">'+options.crumbDefaultText+'</li>');
	var firstCrumbText = (options.backLink) ? options.backLinkText : options.topLinkText;
	var firstCrumbClass = (options.backLink) ? 'fg-menuA-prev-list' : 'fg-menuA-all-lists';
	var firstCrumbLinkClass = (options.backLink) ? 'ui-state-default ui-corner-all' : '';
	var firstCrumbIcon = (options.backLink) ? '<span class="ui-icon ui-icon-triangle-1-w"></span>' : '';
	var firstCrumb = $('<li class="'+firstCrumbClass+'"><a href="#" class="'+firstCrumbLinkClass+'">'+firstCrumbIcon+firstCrumbText+'</a></li>');
	
	container.addClass('fg-menuA-ipod');
	
	if (options.backLink) { breadcrumb.addClass('fg-menuA-footer').appendTo(container).hide(); }
	else { breadcrumb.addClass('fg-menuA-header').prependTo(container); };
	breadcrumb.append(crumbDefaultHeader);
	
	var checkmenuAHeight = function(el){
		if (el.height() > options.maxHeight) { $('[name=unpanel_menuA_Tree]').height(el.height()+50); };	
		el.css({ height: el.height() });
	};
	// scroll mikhorad
//		var checkmenuAHeight = function(el){
//		if (el.height() > options.maxHeight) { el.addClass('fg-menuA-scroll') };	
//		el.css({ height: options.maxHeight });
//	};
//	
	var resetChildmenuA = function(el){ el.removeClass('fg-menuA-scroll').removeClass('fg-menuA-current').height('auto'); };
	
	this.resetDrilldownmenuA = function(){
		$('.fg-menuA-current').removeClass('fg-menuA-current');
		topList.animate({ left: 0 }, options.crossSpeed, function(){
			$(this).find('ul').each(function(){
				$(this).hide();
				resetChildmenuA($(this));				
			});
			topList.addClass('fg-menuA-current');			
		});		
		$('.fg-menuA-all-lists').find('span').remove();	
		breadcrumb.empty().append(crumbDefaultHeader);		
		$('.fg-menuA-footer').empty().hide();	
		checkmenuAHeight(topList);		
	};
	
	topList
		.addClass('fg-menuA-content fg-menuA-current ui-widget-content ui-helper-clearfix')
		.css({ width: container.width() })
		.find('ul')
			.css({ width: container.width(), left: container.width() })
			.addClass('ui-widget-content')
			.hide();		
	checkmenuAHeight(topList);	
	
	topList.find('a').each(function(){
		// if the link opens a child menuA:
		if ($(this).next().is('ul')) {
			$(this)
				.addClass('fg-menuA-indicator')
				.each(function(){ $(this).html('<span>' + $(this).text() + '</span><span class="ui-icon '+options.nextmenuALink+'"></span>'); })
				.click(function(){ // ----- show the next menuA			
					var nextList = $(this).next();
		    		var parentUl = $(this).parents('ul:eq(0)');   		
		    		var parentLeft = (parentUl.is('.fg-menuA-content')) ? 0 : parseFloat(topList.css('left'));    		
		    		var nextLeftVal = Math.round(parentLeft - parseFloat(container.width()));
		    		var footer = $('.fg-menuA-footer');
		    		
		    		// show next menuA   		
		    		resetChildmenuA(parentUl);
		    		checkmenuAHeight(nextList);
					topList.animate({ left: nextLeftVal }, options.crossSpeed);						
		    		nextList.show().addClass('fg-menuA-current').attr('aria-expanded', 'true');    
		    		
		    		var setPrevmenuA = function(backlink){
		    			var b = backlink;
		    			var c = $('.fg-menuA-current');
			    		var prevList = c.parents('ul:eq(0)');
			    		c.hide().attr('aria-expanded', 'false');
		    			resetChildmenuA(c);
		    			checkmenuAHeight(prevList);
			    		prevList.addClass('fg-menuA-current').attr('aria-expanded', 'true');
			    		if (prevList.hasClass('fg-menuA-content')) { b.remove(); footer.hide(); };
		    		};		
		
					// initialize "back" link
					if (options.backLink) {
						if (footer.find('a').size() == 0) {
							footer.show();
							$('<a href="#"><span class="ui-icon ui-icon-triangle-1-w"></span> <span>Back</span></a>')
								.appendTo(footer)
								.click(function(){ // ----- show the previous menuA
									var b = $(this);
						    		var prevLeftVal = parseFloat(topList.css('left')) + container.width();		    						    		
						    		topList.animate({ left: prevLeftVal },  options.crossSpeed, function(){
						    			setPrevmenuA(b);
						    		});			
									return false;
								});
						}
					}
					// or initialize top breadcrumb
		    		else { 
		    			if (breadcrumb.find('li').size() == 1){				
							breadcrumb.empty().append(firstCrumb);
							firstCrumb.find('a').click(function(){
								menuA.resetDrilldownmenuA();
								return false;
							});
						}
						$('.fg-menuA-current-crumb').removeClass('fg-menuA-current-crumb');
						var crumbText = $(this).find('span:eq(0)').text();
						var newCrumb = $('<li class="fg-menuA-current-crumb"><a href="javascript://" class="fg-menuA-crumb">'+crumbText+'</a></li>');	
						newCrumb
							.appendTo(breadcrumb)
							.find('a').click(function(){
								if ($(this).parent().is('.fg-menuA-current-crumb')){
									menuA.chooseItem(this);
								}
								else {
									var newLeftVal = - ($('.fg-menuA-current').parents('ul').size() - 1) * 270;
									topList.animate({ left: newLeftVal }, options.crossSpeed, function(){
										setPrevmenuA();
									});
								
									// make this the current crumb, delete all breadcrumbs after this one, and navigate to the relevant menuA
									$(this).parent().addClass('fg-menuA-current-crumb').find('span').remove();
									$(this).parent().nextAll().remove();									
								};
								return false;
							});
						newCrumb.prev().append(' <span class="ui-icon '+options.nextCrumbLink+'"></span>');
		    		};			
		    		return false;    		
    			});
		}
		// if the link is a leaf node (doesn't open a child menuA)
		else {
			$(this).click(function(){
			if (this.name=='select1' || this.name=='select1_Server' || this.name=='select2_Server' || this.name=='select2' || this.name=='select3' || this.name=='select3_Server' || this.name=='select4' || this.name=='select4_Server' ||  this.name=='select5' ||  this.name=='select5_Server' || this.name=='select6')
			{
		    menuA.chooseItem(this);
			menuA.kill();
			}
				//menuA.chooseItem(this);
				return false;
			});
		};
	});
};


/* menuA.prototype.setPosition parameters (defaults noted with *):
	referrer = the link (or other element) used to show the overlaid object 
	settings = can override the defaults:
		- posX/Y: where the top left corner of the object should be positioned in relation to its referrer.
				X: left*, center, right
				Y: top, center, bottom*
		- offsetX/Y: the number of pixels to be offset from the x or y position.  Can be a positive or negative number.
		- directionH/V: where the entire menuA should appear in relation to its referrer.
				Horizontal: left*, right
				Vertical: up, down*
		- detectH/V: detect the viewport horizontally / vertically
		- linkToFront: copy the menuA link and place it on top of the menuA (visual effect to make it look like it overlaps the object) */

menuA.prototype.setPosition = function(widget, caller, options) { 
	var el = widget;
	var referrer = caller;
	var dims = {
		refX: referrer.offset().left,
		refY: referrer.offset().top,
		refW: referrer.getTotalWidth(),
		refH: referrer.getTotalHeight()
	};	
	var options = options;
	var xVal, yVal;
	
	var helper = $('<div id="positionHelper" class="positionHelper"></div>');
	helper.css({ position: 'absolute', left: dims.refX, top: dims.refY, width: dims.refW, height: dims.refH });
	el.wrap(helper);
	
	// get X pos
	switch(options.positionOpts.posX) {
		case 'left': 	xVal = -44; 
			break;				
		case 'center': xVal = dims.refW / 2;
			break;				
		case 'right': xVal = dims.refW;
			break;
	};
	
	// get Y pos
	switch(options.positionOpts.posY) {
		case 'top': 	yVal = 0;
			break;				
		case 'center': yVal = dims.refH / 2;
			break;				
		case 'bottom': yVal = dims.refH;
			break;
	};
	
	// add the offsets (zero by default)
	xVal += options.positionOpts.offsetX;
	yVal += options.positionOpts.offsetY;
	
	// position the object vertically
	if (options.positionOpts.directionV == 'up') {
		el.css({ top: 'auto', bottom: yVal });
		if (options.positionOpts.detectV && !fitVertical(el)) {
			el.css({ bottom: 'auto', top: yVal });
		}
	} 
	else {
		el.css({ bottom: 'auto', top: yVal });
		if (options.positionOpts.detectV && !fitVertical(el)) {
			el.css({ top: 'auto', bottom: yVal });
		}
	};
	
	// and horizontally
	if (options.positionOpts.directionH == 'left') {
		el.css({ left: 'auto', right: xVal });
		if (options.positionOpts.detectH && !fitHorizontal(el)) {
			el.css({ right: 'auto', left: xVal });
		}
	} 
	else {
		el.css({ right: 'auto', left: xVal });
		if (options.positionOpts.detectH && !fitHorizontal(el)) {
			el.css({ left: 'auto', right: xVal });
		}
	};
	
	// if specified, clone the referring element and position it so that it appears on top of the menuA
	if (options.positionOpts.linkToFront) {
		referrer.clone().addClass('linkClone').css({
			position: 'absolute', 
			top: 0, 
			right: 'auto', 
			bottom: 'auto', 
			left: 0, 
			width: referrer.width(), 
			height: referrer.height()
		}).insertAfter(el);
	};
};


/* Utilities to sort and find viewport dimensions */

function sortBigToSmall(a, b) { return b - a; };

jQuery.fn.getTotalWidth = function(){
	return $(this).width() + parseInt($(this).css('paddingRight')) + parseInt($(this).css('paddingLeft')) + parseInt($(this).css('borderRightWidth')) + parseInt($(this).css('borderLeftWidth'));
};

jQuery.fn.getTotalHeight = function(){
	return $(this).height() + parseInt($(this).css('paddingTop')) + parseInt($(this).css('paddingBottom')) + parseInt($(this).css('borderTopWidth')) + parseInt($(this).css('borderBottomWidth'));
};

function getScrollTop(){
	return self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
};

function getScrollLeft(){
	return self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
};

function getWindowHeight(){
	var de = document.documentElement;
	return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
};

function getWindowWidth(){
	var de = document.documentElement;
	return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
};

/* Utilities to test whether an element will fit in the viewport
	Parameters:
	el = element to position, required
	leftOffset / topOffset = optional parameter if the offset cannot be calculated (i.e., if the object is in the DOM but is set to display: 'none') */
	
function fitHorizontal(el, leftOffset){
	var leftVal = parseInt(leftOffset) || $(el).offset().left;
	return (leftVal + $(el).width() <= getWindowWidth() + getScrollLeft() && leftVal - getScrollLeft() >= 0);
};

function fitVertical(el, topOffset){
	var topVal = parseInt(topOffset) || $(el).offset().top;
	return (topVal + $(el).height() <= getWindowHeight() + getScrollTop() && topVal - getScrollTop() >= 0);
};


Number.prototype.pxToEm = String.prototype.pxToEm = function(settings){
	//set defaults
	settings = jQuery.extend({
		scope: 'body',
		reverse: false
	}, settings);
	
	var pxVal = (this == '') ? 0 : parseFloat(this);
	var scopeVal;
	var getWindowWidth = function(){
		var de = document.documentElement;
		return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
	};	
	
	/* When a percentage-based font-size is set on the body, IE returns that percent of the window width as the font-size. 
		For example, if the body font-size is 62.5% and the window width is 1000px, IE will return 625px as the font-size. 	
		When this happens, we calculate the correct body font-size (%) and multiply it by 16 (the standard browser font size) 
		to get an accurate em value. */
				
	if (settings.scope == 'body' && $.browser.msie && (parseFloat($('body').css('font-size')) / getWindowWidth()).toFixed(1) > 0.0) {
		var calcFontSize = function(){		
			return (parseFloat($('body').css('font-size'))/getWindowWidth()).toFixed(3) * 16;
		};
		scopeVal = calcFontSize();
	}
	else { scopeVal = parseFloat(jQuery(settings.scope).css("font-size")); };
			
	var result = (settings.reverse == true) ? (pxVal * scopeVal).toFixed(2) + 'px' : (pxVal / scopeVal).toFixed(2) + 'em';
	return result;
};

