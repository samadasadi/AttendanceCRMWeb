	function printPage(d,table,check) 
{
var Browser = navigator.appName;
var Net = Browser.indexOf("Netscape");
var Micro = Browser.indexOf("Microsoft");
var sStart = "<html><head>";
var w = window.open('about:blank','printWin','width=660,height=440,scrollbars=yes');
var wdoc = w.document;
wdoc.open();
wdoc.writeln(  "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">");
wdoc.writeln(  "</head><body style=\"background-image:none;background-color:white;\">");
wdoc.writeln(  "<div style=\"direction: "+d+"; margin: 10px\">" );
wdoc.writeln("<table id='tbl'><tbody>")
var table = document.getElementById (table);
var count=table.rows.length;
for (i=1; i<count; i++)
{
if (document.getElementById(check+i).checked==true)
{
wdoc.writeln(  "<tr>" );
var countcell=table.rows[1].cells.length;
for (j=1;j<countcell;j++)
{
wdoc.writeln(  "<td style='width: 50%;'>" );

	if(Net >= 0) {
        wdoc.writeln(  table.rows[i].cells[j].textContent );
	}
 
	if(Micro >= 0) {
		   wdoc.writeln(  table.rows[i].cells[j].innerText );
	}
	
wdoc.writeln(  "</td>" );
}
wdoc.writeln(  "</tr>" );
}
}
wdoc.writeln("  </tbody></table>")
wdoc.writeln(  "</div>" );
wdoc.writeln(  "</body></html>");
wdoc.close();
w.print();
}
function printPageGrid(d,table,check,title_) 
{
var Browser = navigator.appName;
var Net = Browser.indexOf("Netscape");
var Micro = Browser.indexOf("Microsoft");
var cellnumberall;
var sStart = "<html><head>";
var w = window.open('about:blank','printWin','width=660,height=440,scrollbars=yes');
var wdoc = w.document;
wdoc.open();
wdoc.writeln(  "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">");
wdoc.writeln("<style  type='text/css'>table, th, td {border: 1px solid #D8D8D8;}</style></head><body style=\"background-image:none;background-color:white;\">");
wdoc.writeln(  "<div style=\"direction: "+d+"; margin: 10px\">" );
wdoc.writeln("<table id='tbl' style='width: 100%;text-align: center;border-collapse:collapse;'><caption>" + title_ + "</caption><tbody>")
var table = document.getElementById (table);
var count = table.rows.length;
for (j = 1; j < table.rows[0].cells.length-4; j++) {
    wdoc.writeln("<th>");
    wdoc.writeln(table.rows[0].cells[j].textContent);
    wdoc.writeln("</th>");
}
for (i=1; i<count; i++)
{
 if (document.getElementById(check+i) != null){
        if (document.getElementById(check+i).checked==true)
        {
        wdoc.writeln(  "<tr>" );
        cellnumberall=table.rows[1].cells.length-4;
        var countcell=table.rows[i].cells.length-4;
        for (j=1;j<countcell;j++)
        {
        if (cellnumberall==countcell){
        wdoc.writeln(  "<td>" );


	        if(Net >= 0) {
                wdoc.writeln(  table.rows[i].cells[j].textContent );
	        }
         
	        if(Micro >= 0) {
		           wdoc.writeln(  table.rows[i].cells[j].innerText );
	        }
        	

        wdoc.writeln(  "</td>" );}
        }
        wdoc.writeln(  "</tr>" );
        }
        }
        }
wdoc.writeln("  </tbody></table>")
wdoc.writeln(  "</div>" );
wdoc.writeln(  "</body></html>");
wdoc.close();
w.print();
}