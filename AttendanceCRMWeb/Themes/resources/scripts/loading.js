
var LoadBar = function(){
	this.value = 0;
	this.sources = Array();
	this.sourcesDB = Array();
	this.totalFiles = 0;
	this.loadedFiles = 0;
};
//Show the loading bar interface
LoadBar.prototype.show = function() {
	this.locate();
	document.getElementById("loadingZone").style.display = "block";
};
//Hide the loading bar interface
LoadBar.prototype.hide = function() {
	document.getElementById("loadingZone").style.display = "none";
};
//Add all scripts to the DOM
LoadBar.prototype.run = function(){
	this.show();
	var i;
	for (i=0; i<this.sourcesDB.length; i++){
		var source = this.sourcesDB[i];
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "../Themes/resources/scripts/" + source
		head.appendChild(script);
	}	
};
//Center in the screen remember it from old tutorials? ;)
LoadBar.prototype.locate = function(){
	var loadingZone = document.getElementById("loadingZone");
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	var popupHeight = loadingZone.clientHeight;
	var popupWidth = loadingZone.clientWidth;
	loadingZone.style.position = "absolute";
	loadingZone.style.top = parseInt(windowHeight/2-popupHeight/2) + "px";
	loadingZone.style.left = parseInt(windowWidth/2-popupWidth/2) + "px";
};
//Set the value position of the bar (Only 0-100 values are allowed)
LoadBar.prototype.setValue = function(value){
	if(value >= 0 && value <= 100){
		document.getElementById("progressBar").style.width = value + "%";
		
		document.getElementById("infoProgress").innerHTML = parseInt(value) + "%";
	}
};
//Set the bottom text value
LoadBar.prototype.setAction = function(action){

	//document.getElementById("infoLoading").innerHTML = action;
};
//Add the specified script to the list
LoadBar.prototype.addScript = function(source){
	this.totalFiles++;
	this.sources[source] = source;
	this.sourcesDB.push(source);
};
//Called when a script is loaded. Increment the progress value and check if all files are loaded
LoadBar.prototype.loaded = function(file) {
	this.loadedFiles++;
	delete this.sources[file];
	var pc = (this.loadedFiles * 100) / this.totalFiles;
	this.setValue(pc);
	this.setAction(file + " loaded");
	//Are all files loaded?
	if(this.loadedFiles == this.totalFiles){
		setTimeout("myBar.hide()");
		//load the reset button to try one more time!
		document.getElementById("restart").style.display = "block";
	}
};
//Global var to reference from other scripts
var myBar = new LoadBar();

//Checking resize window to recenter :)
window.onresize = function(){
	myBar.locate();
};
//Called on body load

//Called on body load
start = function(){

	myBar.addScript("jquery-1.4.4.min.js");
	myBar.addScript("jquery-ui-1.8.custom.min.js");
	myBar.addScript("jquery.flot.min.js");
//	myBar.addScript("jquery.tinymce.js");
	myBar.addScript("smooth.js");
	myBar.addScript("smooth.menu.js");
	myBar.addScript("smooth.table.js");
	myBar.addScript("jquery.ui.core.js");
	myBar.addScript("jquery.ui.datepicker-cc.js");
	myBar.addScript("smooth.form.js");
	myBar.addScript("smooth.dialog.js");
    myBar.addScript("smooth.autocomplete.js");
myBar.addScript("jquery.loadmask.js");
  myBar.addScript("jquery.dropdawn.js?v=1.1");             
	myBar.run();
};


////Called on click reset button
//restart = function(){
//	window.location.reload();
//};
////-----------------------------------
//var JS_START_TIME=(new Date).getTime(),GLOBALS=top.GLOBALS;
//if("Y8M4VH4wdAY.en."!=GLOBALS[4])top.location.replace(top.location.href.split("#")[0]);
//function _B_log(imp,opt_val){var p="imp="+imp;

//if(arguments.length>1)p+="&val="+opt_val;
//_B_logImg_("jsle",p)}var loadTimes=[GLOBALS[0],GLOBALS[1],JS_START_TIME];
//function _B_record(){loadTimes.push((new Date).getTime())}var _B_thumbStyle_;
//function _B_prog(pct){top["pr"]=pct;
//if(_B_thumbStyle_===undefined){var thumb=top.document.getElementById("lpt");
//_B_thumbStyle_=thumb?thumb.style:null}if(_B_thumbStyle_){_B_thumbStyle_.width=Math.round(pct*0.99)+"%";

//if(pct==100)_B_thumbStyle_=null}}function _B_err(e){var state=loadTimes.join("-");

//_B_logImg_("jserr","jsstate="+encodeURIComponent(state)+"&jsmsg="+encodeURIComponent(e));
//_B_handleError(e)}function _B_handleError(e){throw e;
//}function _B_logImg_(v,p){(new Image).src="?ui=2&view="+v+"&"+p+"&ik="+GLOBALS[9]+"&random="+(new Date).getTime()}window.onerror=function(message,url,line){_B_err(message)};_B_prog(1);