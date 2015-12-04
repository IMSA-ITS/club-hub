//present/clubwall.js - The Club Hub Automatic Slideshow Generator
//Copyright (c) 2015 George Moe - See LICENSE for more details.

//Event tracking with Google Analytics. Change to your own tracking code.
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-55205533-9']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

//Define some additions to Date objects to get the day of the week and the month of the year.
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

//The main code
$( document ).ready(function(){     
    
        var imp;
        var counter = 1;
        var colors = ["rgb(255,85,85)", "rgb(85,153,255)", "rgb(15,207,77)"];
        
        var ThisRatio = $(window).width()/$(window).height();
        
        //Load presentation js before running everything.
        $.getScript("/clubhub/present/meta/impress.js", function(){
            
            imp = impress();
        
            //A dictionary to convert internal codes to human-readable words.
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
            
            //Hide filter labels.
            $("#clear-filters").hide();
            $("#filterlist").hide();
            
            //Function to chronologically compare two dates.
            function sortByDate(dateArray1, dateArray2)
            {
                    //dateArray in form [day, month, year]
                    //console.log(dateArray1, dateArray2);
                    var greater = false;
                    var arraySize = 5;
                    
                    console.log(dateArray1, dateArray2);
                    
                    for(i = 0; i < arraySize; i++)
                    {
                        if(dateArray1[i] > dateArray2[i])
                        {
                            greater = true;
                            break;
                        }
                        else if(dateArray1[i] == dateArray2[i])
                        {
                            if(i==arraySize-1)
                            {
                                greater = true;
                                break;
                            }
                        }
                        else
                        {
                            greater = false;
                            break;
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
            
            //Function to chronologically compare two posters.
            function sortPostersByDate(PosterArray1, PosterArray2)
            {
                    //Year, Month, Day, Hour, Minute
                    dateArray1 = [parseInt(PosterArray1[3]), parseInt(PosterArray1[4]), parseInt(PosterArray1[5]), parseInt(PosterArray1[7].split(":")[0]), parseInt(PosterArray1[7].split(":")[1])];
                    dateArray2 = [parseInt(PosterArray2[3]), parseInt(PosterArray2[4]), parseInt(PosterArray2[5]), parseInt(PosterArray2[7].split(":")[0]), parseInt(PosterArray2[7].split(":")[1])];
                    
                    return(sortByDate(dateArray1, dateArray2));
            }
            
            //Function to pad strings with the specified number of zeroes (or another character).
            function pad(n, width, z) {
                    z = z || '0';
                    n = n + '';
                    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            }
            
            //Function to automatically link urls in a body of text.
            function urlify(text) {
                    var urlRegex = /(https?:\/\/[^\s]+)/g;
                    return text.replace(urlRegex, function(url) {
                            return '<a href="' + url + '">' + url + '</a>';
                    })
            }

            //Function to convert 24-hour time to 12-hour time.
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

            //Function to get url query strings.
            function getParameterByName(name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }
            
            //IMPORTANT!! ###############################################################
            //Document IDs for the Master Event Registry (PosterSpreadsheetKey) and the Poster Repository (PosterFolderKey).
	    //Change these to the ones you used in your backend!
            var PosterSpreadsheetKey = "1IDfn6Pl87E1hTDtZFuYswUJrESCIwYtn0QGgvN6ZsQs";
            var PosterFolderKey = "0B_vROCev3947fkNNdlVVUGpHVDgtSHNUZURtbS1wMXBfZlpJQkhaZ1JHcW8wbmxZcnEzbTQ";

            //Get data from the Master Event Registry
            $.getJSON("https://spreadsheets.google.com/feeds/list/"+PosterSpreadsheetKey+"/od6/public/values?alt=json", function(data){
                    
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
                    
                    
            	    //Get variables from the Master Event Registry
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
                            
                            //If the poster date is not already passed, the poster is an approved poster, the poster is not opted-out of poster display, and the poster is in this display group, then queue it for display.
                            if(sortByDate([ortByDate([parseInt(EventDateYear), parseInt(EventDateMonth), parseInt(EventDateDay), 23, 59], [TodayYear, TodayMonth, TodayDay, 0, 0])==1 && Approved.toLowerCase() == "y" && DisplayOpts.search("noposter")==-1 && (DisplayGroup.search(ThisGroup)!=-1 || DisplayGroup == "" || ThisGroup == ""))
                            {
                                    ToBePosted.push([HostName, EventName, EventDesc, EventDateYear, EventDateMonth, EventDateDay, PosterID, EventTime, EventGenLoc, EventLoc, EventDate, PosterExists, DisplayOpts]);
                            }
                            
                    });
                    
                    //Sort posters in chronological order
                    ToBePosted.sort(sortPostersByDate);

                    var datelist = [];
                    var clublist = [];
                    var weeklist = [];
                    var filterlist = {};
                    
                    //Generate entries in the slideshow from the poster queue.
                    $(ToBePosted).each(function(index){

                            //Get data on whether this event has a poster.
                            var PosterExists = ToBePosted[index][11];
                            
                            var namedate = new Date(ToBePosted[index][4]+"/"+ToBePosted[index][5]+"/"+ToBePosted[index][3]);

                            //If poster exists...
                            if(PosterExists=="TRUE")
                            {
                                //And if the event host has requested a fullscreen poster, then set it to the fullscreen class.
                                if(ToBePosted[index][12].search("fullposter")!=-1)
                                {
                                    var postercode = "<img class=\"fullposter\" src=\"https://googledrive.com/host/"+PosterFolderKey+"/"+ToBePosted[index][6]+"\">";
                                }
                                //Otherwise, treat it like a normal poster.
                                else
                                {
                                    var postercode = "<img class=\"poster\" src=\"https://googledrive.com/host/"+PosterFolderKey+"/"+ToBePosted[index][6]+"\">";
                                }
                                var detailexpand = "";
                            }
                            //If there is no poster, then don't generate an image tag for it.
                            else
                            {
                                var postercode = "";
                                var detailexpand = "style=\"width: 90%\"";
                            }
                            
                            //Generate the slideshow by appending to the main document.
                            if(ToBePosted[index][12].search("fullposter")!=-1)
                            {
                                $("#impress").append("<div class=\"step\" data-x=\""+Math.round(Math.cos(index+1)*500*(index+1))+"\" data-y=\""+Math.round(Math.cos(index+1)*500*(index+1))+"\" data-z=\""+((index+1)*1500)+"\"><div class=\"clubcard\"><span class=\"helper\"></span>"+postercode+"</div></div>");
                                
                            }
                            else
                            {
                                $("#impress").append("<div class=\"step\" data-x=\""+Math.round(Math.cos(index+1)*500*(index+1))+"\" data-y=\""+Math.round(Math.cos(index+1)*500*(index+1))+"\" data-z=\""+((index+1)*1500)+"\"><div class=\"clubcard\"><h1 class=\"title\">"+ToBePosted[index][1]+"</h1><h3 class=\"host\">"+ToBePosted[index][0]+"</h3><h3 class=\"logis\">"+namedate.getDayName()+", "+ToBePosted[index][10]+"<br />"+tConvert(ToBePosted[index][7])+"<br />"+ToBePosted[index][9]+"</h3><p class=\"detail\" "+detailexpand+">"+urlify(ToBePosted[index][2])+"</p>"+postercode+"</div></div>");
                            }
                    }).promise().done(function(){

                            //Append a slide that pulls a funny gif from my gif folder.
                            //Comment this out if you don't want it.
                            $("#impress").append("<div class=\"step\" data-x=\"0\" data-y=\"0\" data-z=\""+(ToBePosted.length+1)*1500+"\" data-transition-duration=\"5000\"><div class=\"clubcard\"><div class=\"centered\"><img id=\"gifofthemoment\" src=\"https://googledrive.com/host/0B_vROCev3947WXV6TnZBMFNPbWM/"+Math.ceil(Math.random()*20)+".gif\"></div></div></div>");

                            //Initialize the slideshow
                            imp.init();

                            //Set everything to the proper dimensions.
                            $(".poster").css("max-height", $("html").height()*.75);
                            $(".clubcard").css("width", $("html").width());
                            $(".clubcard").css("height", $("html").height());
                            $("#gifofthemoment").css("height", $("html").height());
                            
                            //Correct the ratios of the fullscreen posters.
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
                    
                    //Listen to when the slides change and to track the slideshow progress.
                    //Use these events to set a timer for the slide.
                    //When the step count exceeds a certain limit (indcating the age of the slideshow), refresh.
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

                                        //If the SUD can't connect to the internet, it will simply continue to show
                                        //the slides it has. The progress bar will go red to indicate that it is in offline mode.
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
            });
        });
});
