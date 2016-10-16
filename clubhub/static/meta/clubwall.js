//clubwall.js - The Club Hub Automatic Event Listing Generator
//Copyright (c) 2015 George Moe - See LICENSE for more details.
//Event tracking with Google Analytics. Change to your own tracking code.
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-55205533-10']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

//The main code
$(document).ready(function () {

    // =================== UTILS ===================

    function humanReadable(word) {
            var dictionary = {
                    "data-date": "Date",
                    "data-time": "Time",
                    "data-host": "Host",
                    "data-genloc": "General Location"
            };
            if (word in dictionary) {
                    return dictionary[word];
            } else return word;
    }

    // =================== INIT ===================

    //Hide filter labels.
    $("#clear-filters").hide();
    $("#filterlist").hide();

    // =================== POSTER SORTING SYSTEM ===================

    //Enable filtering-on-click by different data tags included with the entries in the table.
    $(".date").click(function () {
        filter("data-date", $(this).parent("tr").attr("data-date"));
    });
    $(".host").click(function () {
        filter("data-host", $(this).parent("tr").attr("data-host"));
    });
    $(".time").click(function () {
        filter("data-time", $(this).parent("tr").attr("data-time"));
    });
    $(".location").click(function () {
        filter("data-genloc", $(this).parent("tr").attr("data-genloc"));
    });

    //Link users to the RemindMe! form when they click on the remindme button.
    // $(".remindme").click(function () {
    //     window.open($(this).attr("data-link"));
    // });

    //Setup TableSorter, a plugin to sort the entries in the table by header.
    $("#event-table").tablesorter({
        headers: {
            1: {
                sorter: false
            },
            4: {
                sorter: false
            }
        },
        textExtraction: function (contents) {
            if ($(contents).hasClass("date")) {
                return $(contents).attr("data-date");
            } else if ($(contents).hasClass("time")) {
                return $(contents).attr("data-time");
            } else {
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

    // =================== POSTER FILTERING SYSTEM ===================

    var filterlist = {};

    //Button to clear all filters when clicked.
    $("#clear-filters").click(function () {
        filterlist = {};
        $("#event-table tbody tr").each(function () {
            $(this).show();
        });
        $("#filterlist").slideUp(200, function () {
            $(this).empty();
        });
        $(this).slideUp(200);
    });

    //Function to alter the table when filters are activated
    function filter(attribute, value) {
        if (filterlist[attribute] != value) {
            filterlist[attribute] = value;
            $("#event-table tbody tr:visible").each(function () {
                console.log(attribute, value);
                if ($(this).attr(attribute) != value) {
                    //Hide entries that do not match the filter.
                    $(this).hide();
                }
            });

            //Show what's being filtered.
            $("#filterlist").slideUp(100, function () {
                $(this).append("<div class=\"info-bubble\">" + humanReadable(attribute) + ": " + value + "</div>");
            }).slideDown(200);
            $("#clear-filters").slideDown(200);
        }
    }

    // =================== PLUGINS ===================

    //Setup fancybox, the image viewer used to display posters.
    $(".fancybox").fancybox({
        beforeLoad: function () {
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
    $(".css-button-link").click(function () {
        if ($(this).attr("data-link-newtab")) {
            window.open($(this).attr("data-link"));
        } else {
            window.location = $(this).attr("data-link")
        }
    });

});
