var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-58038459-2']);
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
                        
                        var splitdate = EventDate.split("/");
                        var EventDateMonth = pad(splitdate[0], 2);
                        var EventDateDay = pad(splitdate[1], 2);
                        var EventDateYear = splitdate[2];
                        
                        if(sortByDate([parseInt(EventDateDay), parseInt(EventDateMonth), parseInt(EventDateYear)], [TodayDay, TodayMonth, TodayYear])==1 && Approved.toLowerCase() == "y")
                        {
                                ToBePosted.push([HostName, EventName, EventDesc, EventDateYear, EventDateMonth, EventDateDay, PosterID, EventTime, EventGenLoc, EventLoc, EventDate, PosterExists]);
                        }
                        
                });
                
                //Sort posters in chronological order
                ToBePosted.sort(sortPostersByDate);
                //console.log(ToBePosted);
                
                var datelist = [];
                var clublist = [];
                var weeklist = [];
                
                var filterlist = {};
                
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
                        $("#table tbody").append("<tr data-date=\""+ToBePosted[index][10]+"\" data-host=\""+ToBePosted[index][0]+"\" data-time=\""+ToBePosted[index][7]+"\" data-genloc=\""+ToBePosted[index][8]+"\"><td class=\"date clickable\" data-date=\""+ToBePosted[index][10]+"\">"+namedate.getDayName()+"<br />"+ToBePosted[index][10]+"</td><td>"+postercode+"</td><td class=\"remindme clickable\" data-link=\"https://script.google.com/macros/s/AKfycbyJxGCzHjDhJ_DphdB5xNfKPN1nl_YSSocFEm1thB8_YCfp_bZh/exec?posterid="+ToBePosted[index][6]+"\">"+ToBePosted[index][1]+"</td><td class=\"host clickable\">"+ToBePosted[index][0]+"</td><td><div class=\"description\">"+urlify(ToBePosted[index][2])+"</div></td><td class=\"time clickable\">"+tConvert(ToBePosted[index][7])+"</td><td class=\"clickable location\">"+ToBePosted[index][9]+"</td></tr>");
                });
                
                $("#table").tablesorter({
                        headers: {
                            1: { sorter: false },
                            4: { sorter: false }
                        },
                        textExtraction: function(contents){
                              if($(contents).attr("class")=="data")
                              {
                                   return $(contents).attr("data-date");
                              }
                              else if($(contents).attr("class")=="remindme")
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
                
                $("#clear-filters").click(function(){
                         filterlist = {};
                        $("#table tbody tr").each(function(){
                              $(this).show();
                        });
                        $("#filterlist").slideUp(200, function(){$(this).empty();});
                        $(this).slideUp(200);
                });
                
                function filter(attribute, value)
                {
                    if(filterlist[attribute]!=value)
                    {
                         filterlist[attribute]=value;
                         $("#table tbody tr:visible").each(function(){
                              if($(this).attr(attribute)!=value)
                              {
                                   $(this).hide();
                              }
                         });
                         $("#filterlist").slideUp(100, function(){ $(this).append("<div class=\"info-bubble\">"+humanReadable(attribute)+": "+humanReadable(value)+"</div>");}).slideDown(200);
                         $("#clear-filters").slideDown(200);
                    }
               }
                
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
               $(".remindme").click(function(){
                    window.open($(this).attr("data-link"));
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
        
});
