var cal_array = [], calnames_array=[];

$( document ).ready( function(){	
	//iOS font compatability
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                $("body").css({"font-family":"\"Avenir Next\", sans-serif"});
                $("h1, h2").css({"font-family":"\"Avenir Black\", sans-serif"});
        }		
	$("#footer").append("<footer><p><a href=\"/\"><img class=\"footer-logo\" src=\"/media/IMSA_Undefined_Logo_White.png\" alt=\"#undefined\"></a>&nbsp;&nbsp;&nbsp;Copyright &copy; The #Undefined Project 2015</p></footer>");
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}