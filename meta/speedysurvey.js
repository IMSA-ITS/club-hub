//SpeedySurvey.js v0.1 - a simple survey that collects quick responses to single questions!
//Integrates into Google Analytics for collecting user data.
//This is not used by Club Hub.
//Copyright (c) George Moe 2015

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-58038459-2']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var surveys = [["appearance", "Do you like how Club Hub looks?", "Yes", "positive", "No", "negative"], ["meta", "Is a quick one-question survey like this an easy way to give feedback?", "Yes", "positive", "No", "negative"], ["weekview", "Which view do you prefer?", "Week View", "week", "Date View", "date"]];

$(document).ready(function(){
        var selectedsurvey = surveys[Math.floor(Math.random()*surveys.length)];
        $("#speedysurvey").append("\
                <p>"+selectedsurvey[1]+"\
                <a href=\"#\" class=\"speedysurvey-response\" data-survey-point=\""+selectedsurvey[0]+"\" data-survey-value=\""+selectedsurvey[3]+"\">"+selectedsurvey[2]+"</a>\
                <a href=\"#\" class=\"speedysurvey-response\" data-survey-point=\""+selectedsurvey[0]+"\" data-survey-value=\""+selectedsurvey[5]+"\">"+selectedsurvey[4]+"</a>\
                </p>\
        ");
        
        $(".speedysurvey-response").click(function(){
                var point = $(this).attr("data-survey-point");
                var value = $(this).attr("data-survey-value");
                console.log(point+" "+value);
                _gaq.push(["_trackEvent", "SpeedySurvey", "Response", "speedysurvey-"+point+"-"+value]);
                afterClick();
        });
        
        function afterClick()
        {
                $("#speedysurvey").html("<p>Thanks for your help! To give more detailed feedback, check out the <a href=\"https://docs.google.com/forms/d/10h9SFEC7zsQv_teze6dOfSI168qGP8z4Ef3oLrz6Z6Q/viewform?usp=send_form\">Feedback Form (for Students)</a></p>");
        }
        
       
});
