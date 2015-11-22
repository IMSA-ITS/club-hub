var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-55205533-9']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

(function() {
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        Date.prototype.getMonthName = function() {
                return months[ this.getMonth() ];
        };
        Date.prototype.getDayName = function() {
                return days[ this.getDay() ];
        };
})();

$( document ).ready(function(){     
    
        var imp;
        var counter = 1;
        var colors = ["rgb(255,85,85)", "rgb(85,153,255)", "rgb(15,207,77)"];
        
        var ThisRatio = $(window).width()/$(window).height();
        
        //Load presentation js before running everything.
        $.getScript("/clubhub/present/meta/impress.js", function(){
            
            imp = impress();
        
            function humanReadable(word)
            {
                var dictionary = { 
                    "data-date": "Date",
                    "data-time": "Time",
                    "data-host": "Host",
                    "data-genloc": "General Location",
                    "1501":"1501",
                    "1502":"1502",
                    "1503":"1503",
                    "1504":"1504",
                    "1505":"1505",
                    "1506":"1506",
                    "1507":"1507",
                    "1508":"1508",
                    "awing":"A-Wing Classrooms",
                    "bwing":"B-Wing Classrooms",
                    "acpit":"AC Pit",
                    "msarea":"Math/Study Area",
                    "tvpit":"TV Pit",
                    "irc":"IRC",
                    "sodexo":"Sodexo",
                    "oldcafe":"Old Cafe",
                    "science":"Science Atrium",
                    "music":"Music Wing",
                    "union":"Student Union",
                    "lecture":"Lecture Hall",
                    "auditorium":"Auditorium",
                    "mgym":"Main Gym",
                    "wgym":"West Gym",
                    "outside":"Outside",
                    "other":"Other"
                };
                if(word in dictionary)
                {
                return dictionary[word];
                }
                else return word;
            }
            
            $("#clear-filters").hide();
            $("#filterlist").hide();
            
            function sortByDate(dateArray1, dateArray2)
            {
                    //dateArray in form [day, month, year]
                    //console.log(dateArray1, dateArray2);
                    var greater = false;
                    if(dateArray1[2] > dateArray2[2])
                    {
                            greater = true;
                    }
                    else if(dateArray1[2] == dateArray2[2])
                    {
                            if(dateArray1[1] > dateArray2[1])
                            {
                                    greater = true;
                            }
                            else if(dateArray1[1] == dateArray2[1])
                            {
                                    if(dateArray1[0] >= dateArray2[0])
                                    {
                                            greater = true;
                                    }
                            }
                    }
                    
                    if(greater)
                    {
                            return 1;
                    }
                    else
                    {
                            return -1;
                    }
            }
            
            function sortPostersByDate(PosterArray1, PosterArray2)
            {
                    
                    dateArray1 = [PosterArray1[5], PosterArray1[4], PosterArray1[3]];
                    dateArray2 = [PosterArray2[5], PosterArray2[4], PosterArray2[3]];
                    
                    return(sortByDate(dateArray1, dateArray2));
            }
            
            function pad(n, width, z) {
                    z = z || '0';
                    n = n + '';
                    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            }
            
            function urlify(text) {
                    var urlRegex = /(https?:\/\/[^\s]+)/g;
                    return text.replace(urlRegex, function(url) {
                            return '<a href="' + url + '">' + url + '</a>';
                    })
            }
            
            function tConvert (time) {
                // Check correct time format and split into components
                time = time.toString ().match (/^([01]*\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

                if (time.length > 1) { // If time format correct
                    time = time.slice (1);  // Remove full string match value
                    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
                    time[0] = +time[0] % 12 || 12; // Adjust hours
                }
                return time.join (''); // return adjusted time or original string
            }

            function getParameterByName(name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }
            
            var PosterSpreadsheetKey = "1IDfn6Pl87E1hTDtZFuYswUJrESCIwYtn0QGgvN6ZsQs";
            var PosterFolderKey = "0B_vROCev3947fkNNdlVVUGpHVDgtSHNUZURtbS1wMXBfZlpJQkhaZ1JHcW8wbmxZcnEzbTQ";
            $.getJSON("https://spreadsheets.google.com/feeds/list/"+PosterSpreadsheetKey+"/od6/public/values?alt=json", function(data){
                    
                    //default view
                    var defaultview = "week";
                    
                    var posters = data.feed.entry;
                    var ToBePosted = [];
                    
                    d = new Date();
                    var TodayDay = d.getDate();
                    var TodayMonth = d.getMonth()+1;
                    var TodayYear = d.getFullYear();
                    
                    var ThisGroup = getParameterByName("group").toLowerCase();
                    
                    if(ThisGroup!="")
                    {
                        console.log("This display is set to show posters in group ["+ThisGroup+"].");
                    }
                    else
                    {
                        console.log("This display is set to show ALL posters.");
                    }
                    
                    
                    $(posters).each(function(index){
                            var HostName = posters[index].gsx$hostname.$t;
                            var EventName = posters[index].gsx$eventname.$t;
                            var EventDesc = posters[index].gsx$eventdesc.$t;
                            var EventDate = posters[index].gsx$eventdate.$t;
                            var EventTime = posters[index].gsx$eventtime.$t;
                            var EventGenLoc = posters[index].gsx$eventgenerallocation.$t;
                            var EventLoc = posters[index].gsx$eventloc.$t;
                            var PosterID = posters[index].gsx$posterid.$t;
                            var PosterExists = posters[index].gsx$posterexists.$t;
                            var Approved = posters[index].gsx$approved.$t;
                            var DisplayOpts = posters[index].gsx$options.$t;
                            var DisplayGroup = posters[index].gsx$group.$t;
                            
                            if(EventLoc == "")
                            {
                                EventLoc = humanReadable(EventGenLoc);
                            }
                            
                            var splitdate = EventDate.split("/");
                            var EventDateMonth = pad(splitdate[0], 2);
                            var EventDateDay = pad(splitdate[1], 2);
                            var EventDateYear = splitdate[2];
                            
                            if(sortByDate([parseInt(EventDateDay), parseInt(EventDateMonth), parseInt(EventDateYear)], [TodayDay, TodayMonth, TodayYear])==1 && Approved.toLowerCase() == "y" && DisplayOpts.search("noposter")==-1 && (DisplayGroup.search(ThisGroup)!=-1 || DisplayGroup == "" || ThisGroup == ""))
                            {
                                    ToBePosted.push([HostName, EventName, EventDesc, EventDateYear, EventDateMonth, EventDateDay, PosterID, EventTime, EventGenLoc, EventLoc, EventDate, PosterExists, DisplayOpts]);
                            }
                            
                    });
                    
                    //Sort posters in chronological order
                    ToBePosted.sort(sortPostersByDate);
                    //console.log(ToBePosted);
                    
                    var datelist = [];
                    var clublist = [];
                    var weeklist = [];
                    var filterlist = {};
                    
                    var tag = "happy"
                    
                    $(ToBePosted).each(function(index){
                            
                            var PosterExists = ToBePosted[index][11];
                            
                            var namedate = new Date(ToBePosted[index][4]+"/"+ToBePosted[index][5]+"/"+ToBePosted[index][3]);
                            if(PosterExists=="TRUE")
                            {
                                if(ToBePosted[index][12].search("fullposter")!=-1)
                                {
                                    var postercode = "<img class=\"fullposter\" src=\"https://googledrive.com/host/"+PosterFolderKey+"/"+ToBePosted[index][6]+"\">";
                                }
                                else
                                {
                                    var postercode = "<img class=\"poster\" src=\"https://googledrive.com/host/"+PosterFolderKey+"/"+ToBePosted[index][6]+"\">";
                                }
                                var detailexpand = "";
                            }
                            else
                            {
                                var postercode = "";
                                var detailexpand = "style=\"width: 90%\"";
                            }
                            
                            if(ToBePosted[index][12].search("fullposter")!=-1)
                            {
                                $("#impress").append("<div class=\"step\" data-x=\""+Math.round(Math.cos(index+1)*500*(index+1))+"\" data-y=\""+Math.round(Math.cos(index+1)*500*(index+1))+"\" data-z=\""+((index+1)*1500)+"\"><div class=\"clubcard\"><span class=\"helper\"></span>"+postercode+"</div></div>");
                                
                            }
                            else
                            {
                                $("#impress").append("<div class=\"step\" data-x=\""+Math.round(Math.cos(index+1)*500*(index+1))+"\" data-y=\""+Math.round(Math.cos(index+1)*500*(index+1))+"\" data-z=\""+((index+1)*1500)+"\"><div class=\"clubcard\"><h1 class=\"title\">"+ToBePosted[index][1]+"</h1><h3 class=\"host\">"+ToBePosted[index][0]+"</h3><h3 class=\"logis\">"+namedate.getDayName()+", "+ToBePosted[index][10]+"<br />"+tConvert(ToBePosted[index][7])+"<br />"+ToBePosted[index][9]+"</h3><p class=\"detail\" "+detailexpand+">"+urlify(ToBePosted[index][2])+"</p>"+postercode+"</div></div>");
                            }
                    }).promise().done(function(){
                            $("#impress").append("<div class=\"step\" data-x=\"0\" data-y=\"0\" data-z=\""+(ToBePosted.length+1)*1500+"\" data-transition-duration=\"5000\"><div class=\"clubcard\"><div class=\"centered\"><img id=\"gifofthemoment\" src=\"https://googledrive.com/host/0B_vROCev3947WXV6TnZBMFNPbWM/"+Math.ceil(Math.random()*20)+".gif\"></div></div></div>");
                            imp.init();                                
                            $(".poster").css("max-height", $("html").height()*.75);
                            $(".clubcard").css("width", $("html").width());
                            $(".clubcard").css("height", $("html").height());
                            $("#gifofthemoment").css("height", $("html").height());
                            
                            $(".fullposter").load(function(){
                                   
                                    var poster = $(this);
                                    console.log(poster.width()/poster.height()+" "+ThisRatio);
                                    if(poster.width()/poster.height() > ThisRatio)
                                    {
                                        $(poster).addClass("fullposter-wide");
                                    }
                                    else
                                    {
                                        $(poster).addClass("fullposter-tall");
                                    }
                            });
                    });
                    
                    document.addEventListener('impress:stepenter', function(e){
                        if(counter > ToBePosted.length+2)
                        {
                            $.ajax({
                                    url: window.location.protocol + "//" + window.location.host + "/clubhub/present/?rand=" + Math.floor((1 + Math.random()) * 0x10000),
                                    type: "HEAD",
                                    timeout: 1000,
                                    success: function (response) {
                                            console.log("Updating...");
                                            document.location.href="/clubhub/present/?group="+ThisGroup;
                                    },
                                    error: function(error) {
                                        console.log("Offline.")
                                        $("#timer").css("backgroundColor", "rgb(255,200,200)");
                                    }
                            });
                        }
                        if (typeof timing !== 'undefined') clearInterval(timing);
                        var duration = (e.target.getAttribute('data-transition-duration') ? e.target.getAttribute('data-transition-duration') : 10000);
                        timing = setInterval(imp.next, duration);
                        $("#timerstat").css("backgroundColor", colors[counter%3]);
                        $("#timerstat").animate({width: "100%"}, duration, "linear", function(){
                            $(this).css("float", "right").animate({width: "0%"}, 200, function(){
                                $(this).css("float", "none");
                            });
                        });
                        counter++;
                    });
                    
                    $("#table").tablesorter({
                            headers: {
                                1: { sorter: false },
                                4: { sorter: false }
                            },
                            textExtraction: function(contents){
                                if($(contents).hasClass("date"))
                                {
                                    return $(contents).attr("data-date");
                                }
                                else if($(contents).hasClass("time"))
                                {
                                    return $(contents).attr("data-time");
                                }
                                else if($(contents).hasClass("remindme"))
                                {
                                    return $("a", $(contents)).html();
                                }
                                else
                                {
                                    return contents.innerHTML;
                                }
                            }
                    });
                    
                    $(".description").readmore({
                        speed: 200,
                        moreLink: '<a href="#">Show more</a>',
                        lessLink: '<a href="#">Show less</a>',
                        blockCSS: 'display: block; width: 100%;'
                    });
                    

            });
            
            $(".fancybox").fancybox({
                    beforeLoad: function() {
                        this.title = $(this.element).attr('caption');
                    },
                    type: "image",
                    openEffect: "elastic",
                    closeEffect: "fade",
                    helpers: {
                    overlay: {
                        locked: false
                    }
                    }
            });
            
            $(".css-button-link").click(function(){
                window.open($(this).attr("data-link"));
            });
            
            $("#table tbody tr").each(function(){
                console.log("HO!!");
                $('html, body').animate({
                    scrollTop: $(this).offset().top
                }, 500);
                console.log("HEY!");
            });

        });
});
