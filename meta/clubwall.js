//clubwall.js - The Club Hub Automatic Event Listing Generator
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
                
                $(posters).each(function(index){

                	//Get variables from the Master Event Registry
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
                        
                        if(EventLoc == "")
                        {
                              EventLoc = humanReadable(EventGenLoc);
                        }
                        
                        var splitdate = EventDate.split("/");
                        var EventDateMonth = pad(splitdate[0], 2);
                        var EventDateDay = pad(splitdate[1], 2);
                        var EventDateYear = splitdate[2];
                        
                        //If the poster date is not already passed and is an approved poster, then queue it for display.
                        if(sortByDate([parseInt(EventDateYear), parseInt(EventDateMonth), parseInt(EventDateDay), 23, 59], [TodayYear, TodayMonth, TodayDay, 0, 0])==1 && Approved.toLowerCase() == "y")
                        {
                                ToBePosted.push([HostName, EventName, EventDesc, EventDateYear, EventDateMonth, EventDateDay, PosterID, EventTime, EventGenLoc, EventLoc, EventDate, PosterExists]);
                        }
                        
                });
                
                //Sort posters in chronological order
                ToBePosted.sort(sortPostersByDate);

                var datelist = [];
                var clublist = [];
                var weeklist = [];
                var filterlist = {};

                //Generate entries in the Event Listing from the poster queue.
                $(ToBePosted).each(function(index){
                        
                        var PosterExists = ToBePosted[index][11];
                        
                        var namedate = new Date(ToBePosted[index][4]+"/"+ToBePosted[index][5]+"/"+ToBePosted[index][3]);
                        if(PosterExists=="TRUE")
                        {
                              var postercode = "<a class=\"fancybox\" rel=\"posters\" href=\"https://googledrive.com/host/"+PosterFolderKey+"/"+ToBePosted[index][6]+"\"><img class=\"poster-img\" src=\"https://googledrive.com/host/"+PosterFolderKey+"/"+ToBePosted[index][6]+"\"></a>";
                        }
                        else
                        {
                              var postercode = "";
                        }
                        $("#table tbody").append("<tr data-date=\""+ToBePosted[index][10]+"\" data-host=\""+ToBePosted[index][0]+"\" data-time=\""+ToBePosted[index][7]+"\" data-genloc=\""+ToBePosted[index][8]+"\"><td class=\"date clickable\" data-date=\""+ToBePosted[index][10]+"\">"+namedate.getDayName()+"<br />"+ToBePosted[index][10]+"</td><td>"+postercode+"</td><td class=\"remindme clickable\" data-link=\"https://script.google.com/macros/s/AKfycbyJxGCzHjDhJ_DphdB5xNfKPN1nl_YSSocFEm1thB8_YCfp_bZh/exec?posterid="+ToBePosted[index][6]+"\">"+ToBePosted[index][1]+"</td><td class=\"host clickable\">"+ToBePosted[index][0]+"</td><td><div class=\"description\">"+urlify(ToBePosted[index][2])+"</div></td><td class=\"time clickable\" data-time=\""+ToBePosted[index][7]+"\">"+tConvert(ToBePosted[index][7])+"</td><td class=\"clickable location\">"+ToBePosted[index][9]+"</td></tr>");
                });
                
                //Setup TableSorter, a plugin to sort the entries in the table by header.
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
                
                //Setup ReadMore, a plugin to hide long discriptions with a "Read More" button.
                $(".description").readmore({
                    speed: 200,
                    moreLink: '<a href="#">Show more</a>',
                    lessLink: '<a href="#">Show less</a>',
                    blockCSS: 'display: block; width: 100%;'
                });
                
                //Button to clear all filters when clicked.
                $("#clear-filters").click(function(){
                         filterlist = {};
                        $("#table tbody tr").each(function(){
                              $(this).show();
                        });
                        $("#filterlist").slideUp(200, function(){$(this).empty();});
                        $(this).slideUp(200);
                });

		//Function to alter the table when filters are activated
                function filter(attribute, value)
                {
                    if(filterlist[attribute]!=value)
                    {
                         filterlist[attribute]=value;
                         $("#table tbody tr:visible").each(function(){
                              if($(this).attr(attribute)!=value)
                              {
                                   //Hide entries that do not match the filter.
                                   $(this).hide();
                              }
                         });

                         //Show what's being filtered.
                         $("#filterlist").slideUp(100, function(){ $(this).append("<div class=\"info-bubble\">"+humanReadable(attribute)+": "+humanReadable(value)+"</div>");}).slideDown(200);
                         $("#clear-filters").slideDown(200);
                    }
               }

               //Enable filtering-on-click by different data tags included with the entries in the table.
               $(".date").click(function(){
                    filter("data-date", $(this).parent("tr").attr("data-date"));
               });
               $(".host").click(function(){
                    filter("data-host", $(this).parent("tr").attr("data-host"));
               });
               $(".time").click(function(){
                    filter("data-time", $(this).parent("tr").attr("data-time"));
               });
               $(".location").click(function(){
                    filter("data-genloc", $(this).parent("tr").attr("data-genloc"));
               });

               //Link users to the RemindMe! form when they click on the remindme button.
               $(".remindme").click(function(){
                    window.open($(this).attr("data-link"));
               });
        });
        
        //Setup fancybox, the image viewer used to display posters.
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
        
        //Configure our css buttons to open the link specified by the data-link attribute.
        $(".css-button-link").click(function(){
               window.open($(this).attr("data-link"));
        });
        
});
