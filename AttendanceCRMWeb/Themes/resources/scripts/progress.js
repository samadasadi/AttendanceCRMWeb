 
var bar_length = 400; // the bar will be this many pixels long
var bar_height = 5; // the bar will be this many pixels high
var bar_color = "#B3F83D"; // the progress bar color
var bar_background = "white"; // the color of the empty part of bar
var bar_border = "#C2C2C2";  // the color of the bar border
var window_background = "#EAEAEA"; // the color of the pop-up window
var window_border = ""; // the border color of pop-up window
var text_color = "#6EA1FA"; // the color of the percentage text (50%)
var display_close_button = 0; // 1 = on; 0 = off

var wait = 0; 

var more = 0; // Add more to the bar ever second
var doneyet = 0;  // changes to 1 when the DOM is done loading


function setup_bar()
{

	// Add 50 to the window_width so that it can have 25px borders
	window_width = bar_length + 30;
	// Add 50 to window_height so that is can have 25px borders
	window_height = bar_height + 50;
	
	if (document.all) // if IE
	{
		// Internet Explorer makes the bar two pixels too low
		bar_height2 = bar_height - 2; 
		// Internet Explorer makes empty_bar 4 pixels too thin
		bar_width2 = bar_length + 3;
	}
	else
	{
		bar_height2 = bar_height;
		bar_width2 = bar_length + 1;
	}
	
	
	document.write('<div id="DivPass2" style="position: absolute;  width: 100%; height: 100%; z-index: 2000; background-color: #f5f5f5;"><div id="bar_window" style="position: absolute;'
		+ 'top: ' + ((screen.height - window_height)/2) + 'px'
		+ ';left: ' + ((screen.width - window_width)/2) + 'px'
		+ ';background-color: ' + window_background
		+ ';color: ' + text_color
		+ ';" >');
	

	
	/* Now we create the empty part of the progress bar with its
	border */
	document.write('<div id="empty_bar" style="position: absolute;'
		+ 'top: ' + 25 + 'px'
		+ ';left: ' + 25 + 'px'
		+ ';border: 1px solid ' + bar_border
		+ ';background-color: ' + bar_background
		+ ';width: ' + bar_width2 + 'px'
		+ ';height: ' + bar_height + 'px'
		+ ';z-index:20001;">');
	document.write('</div>'); // close DIV for empty_bar
	
	/* Now we create the part that will display the progress bar.
	At first it is the width of 0 because percent is 0. */
	document.write('<div id="bar" style="position: absolute;'
		+ 'top: ' + 26 + 'px'
		+ ';left: ' + 26 + 'px'
		+ ';background-color: ' + bar_color
		+ ';width: ' + 0 + 'px'
		+ ';max-width: ' + bar_width2 + 'px' // Bug fix from Martijn189 on 4/13/10
		+ ';height: ' + bar_height2 + 'px'
		+ ';z-index:20001;">');
	document.write('</div>'); // close DIV for bar
	
	/*  Now we create the text part that will display the percent */
	document.write('<div id="percent" style="position: absolute;'
		+ 'top: ' + 25 + 'px'
		+ ';width: ' + window_width + 'px'
		+ ';text-align: center'
		+ ';vertical-align: middle'
		+ ';color: ' + text_color
		+ ';font-size: 10pt'
		+ ';z-index:20001;left: 0px;">');
	
	document.write('</div>');  // close DIV for percent
	document.write('<div id="percent1" style="position: absolute;'
		+ 'top: ' + 5 + 'px'
		+ ';width: ' +  window_width + 'px'
		+ ';text-align: right'
		+ ';vertical-align: middle'
		+ ';color: ' + text_color
		+ ';font-size: 10pt;float: right;'
		+ ';z-index:20001;left: 0px;">');
	document.write('0%'); // Display 0%
	document.write('</div>');  // close DIV for percent
		document.write('<div id="percent2" style="position: absolute;'
		+ 'top: ' + 5 + 'px'
		+ ';width: ' +  window_width + 'px'
		+ ';text-align: left'
		+ ';vertical-align: middle'
		+ ';color: ' + text_color
		+ ';font-size: 10pt;float: right;'
		+ ';z-index:20001;left: 25px;">');
	document.write('Loading</div>');  // close DIV for percent
	
	document.write('</div></div>'); // close DIV for bar_window
	
	
		
} // end function setup_bar()

function progress_bar()
{

/* the following document element retreives the number of
images on the HTML document */
var image_count = document.getElementsByTagName("img").length;

/* the following variable gets an array of all the images
in the document */
var image_array = document.getElementsByTagName("img");

/* Each part of the progress bar will be bar_length divided by
image_count rounded. For example: If there are 5 images and
the total bar_length is 300 then each bar_part will be 60 */
var bar_part = Math.round(bar_length / image_count);

/* To display the correct percentage, bar_perc is 100 divided
by the number of images on the page rounded */
var bar_perc = Math.round(100 / image_count);
	
	var new_width = 0; // Will become new width of progress bar
	var j = 0;  // count how many images are complete
	var percent = 0; // Add up the percentage
	
	for (var i = 0; i < image_count; i++)
	{
		/* The javascript variable 'complete' when used on an
		image element retrieves whether an image is done
		loading or not.  It returns true or flase */
		if (image_array[i].complete)
		{
			percent = percent + bar_perc;
			new_width = new_width + bar_part;
			j++;
		}
	}
	
	// If the new_width is not growing because an image is still
	// loading then we want to make the bar go up 1% every 1 second
	// as long as it has not reached the next bar_part
	 if (new_width <= parseFloat(document.getElementById('bar').style.width)
		&& new_width < (j*bar_part + bar_part))
	{
		more = more + .50;
		new_width = new_width + Math.round(more);	 
		percent = percent + Math.round(more);
	}
	else
		more = 0;  // reset more if we loaded next image 
	
	// The is so the percentage can never go past 100
	if (percent > 100) { percent = 100; } // Bug fix from Martijn189 on 4/13/10
	
	// Write the new percent in the progress bar window
	document.getElementById('percent1').innerHTML = percent + '%';
	// Make the width of the bar wider so that it matches the percent
	document.getElementById('bar').style.width = new_width + 'px';
	
	//checkstate(); // need for safari
	//document.getElementById('bar').innerHTML = document.readyState;
	
	/* If all the images have not loaded then call this
	function again in 500ms.  There must be at least one
	image in the document or the progress bar window
	never closes */
	if (j < image_count || j == 0 || doneyet == 0)
		setTimeout('progress_bar();', 500); 
	else // if done then close the progress bar pop-up window
		setTimeout('close_bar();', 500); // in half a second
} // end function progress_bar()




function close_bar()
{
	//if done then close the progress bar pop-up window
	document.getElementById('bar_window').style.visibility = 'hidden';
	document.getElementById('DivPass2').style.visibility = 'hidden';

}  // end function close_bar()




// If IE
if(document.readyState)	
{
	document.onreadystatechange=checkstate;
}
else if (document.addEventListener) // if Mozilla or Netscape
{
	document.addEventListener("DOMContentLoaded", saydone, false);
}

	
function checkstate()
{
	// Besides IE, Safari also can use document.readyState
	// but Safari does not support onreadystatechange, so
	// we will keep calling this function with progress_bar().
	
	// Check to see if document is not "complete" but
	// is loaded enough to be "interactive"
	if (document.readyState=="complete" ||
		document.readyState=="complete")
		doneyet = 1;

} // end function checkstate()

function saydone()
{
	doneyet = 1;
}  // end function saydone()


setTimeout('saydone();', wait);
var author_value = getQuerystring('first_');
if (author_value=="1")
{

// for other browsers that don't have DOM complete variables
setTimeout('saydone();', wait);
setup_bar(); // call the function setup_bar() first
progress_bar(); // then call the progress_bar() function

}

function getQuerystring(key, default_)
{
  if (default_==null) default_=""; 
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}