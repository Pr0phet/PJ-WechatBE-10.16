window.onload=function(){
	getch();
}
function getch(){
        var h=document.body.clientHeight;
        var tb=document.getElementById("table-box");
        
        tb.style.height=h-40+'px';
}
window.onresize=getch;