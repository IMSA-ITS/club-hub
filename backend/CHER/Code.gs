//Database locations.
//submissionSSKey: key for data spreadsheet.
//folderId: key for folder to store posters.
var submissionSSKey = "<<ENTER YOUR DATA SPREADSHEET KEY HERE>>";
var folderId = "<<ENTER YOUR FOLDER KEY HERE>>";

//HTTP Service. Serve the form upon GET request.
function doGet(e) {
        var page = HtmlService.createHtmlOutputFromFile('form.html');
        page.setTitle("Event Registrator | Club Hub");
        return page;

}

//Process form submissions.
function processForm(formObject) {

        var HostName = formObject.hostname;
        var HostEmail = formObject.email;
        var EventName = formObject.eventname;
        var EventDate = formObject.eventdate;
        var EventTime = formObject.eventtime;
        var EventGenLoc = formObject.eventgenloc;
        var EventLoc = formObject.eventloc;
        var EventDesc = formObject.eventdesc;
        var poster = formObject.poster;
        var DisplayOpts = [formObject.fullposter, formObject.noposter];
        var DisplayGroup = formObject.group;

        //Make sure all the relevant items are present.
        if (!(HostName && HostEmail && EventName && EventDate && EventGenLoc != "unselected" && EventDesc)) {
                return "not full";
        } else {
                //Get submission time
                var d = new Date();
                var currentTime = d.toDateString() + d.toTimeString();
                var PosterID = d.getTime();
                var posterExists = false;

                //Upload poster as long as it isn't empty
                if (poster.length > 0) {
                        // data returned is a blob for FileUpload widget
                        var doc = DriveApp.getFolderById(folderId).createFile(poster).setName(PosterID);
                        posterExists = true;
                }

                //Get data spreadsheet.
                var sheet = SpreadsheetApp.openById(submissionSSKey).getActiveSheet();
                var lastRow = sheet.getLastRow();
                var targetRange = sheet.getRange(lastRow + 1, 1, 1, 13).setValues([
                        [currentTime, HostName, HostEmail, EventName, EventDate, EventTime, EventGenLoc, EventLoc, EventDesc, DisplayGroup, DisplayOpts.join(), PosterID, posterExists]
                ]);

                //Notify Club Hub Administrator(s).
                var recipient = "<<ENTER YOUR RECIPIENTS HERE>>"
                var subject = "[Club Hub Event Registrator] Event for " + HostName + " Needs Approval";
                var body = "<u>" + HostName + "</u> has submitted the event \"" + EventName + "\" to Club Hub. It needs approval before it can be posted.<br /><br /> \
<table border=\"1\"><tr><td>Host Name</td><td>" + HostName + "</td></tr><tr><td>Event Name</td><td>" + EventName + "</td></tr><tr><td>Event Date</td><td>" + EventDate + "</td></tr>\
<tr><td>Event Time</td><td>" + EventTime + "</td></tr><tr><td>Event Loc</td><td>" + EventLoc + "</td></tr><tr><td>Event Desc</td><td>" + EventDesc + "</td></tr><tr><td>Poster</td><td><a href=\"https://googledrive.com/host/" + folderId + "/" + PosterID + "\"><img src=\"https://googledrive.com/host/" + folderId + "/" + PosterID + "\" width=\"200px\" height=\"auto\"></a></td></tr></table>\
 <br /><br /> \
Go to the <a href='https://docs.google.com/spreadsheets/d/" + submissionSSKey + "'>Club Hub Master Registry</a> to approve or disapprove this event.<br /><br />";
                MailApp.sendEmail({
                        to: recipient,
                        subject: subject,
                        htmlBody: body,
                });

                //Give the "good" signal to the submission page.
                return "good";
        }

}
