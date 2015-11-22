var reminderSSKey = "1-zp1U043VJDluoim68nVrBUEpVPZThBTM5CBabzFSoo";
var submissionSSKey = "1IDfn6Pl87E1hTDtZFuYswUJrESCIwYtn0QGgvN6ZsQs";
var folderId = "0B_vROCev3947fkNNdlVVUGpHVDgtSHNUZURtbS1wMXBfZlpJQkhaZ1JHcW8wbmxZcnEzbTQ";

function doGet(e) {
  var page = HtmlService.createHtmlOutputFromFile('form.html');
  page.setTitle("RemindMe Service | Club Hub");
  return page;
}

function processForm(formObject) {
  
  Logger.log("Got form.");
  
  var Email = formObject.reminderemail;
  var Poster = String(formObject.posterid);
  
  if(!Email)
  {   
    return "not full";
  }
  else if(!Poster)
  {
    return "no posterid";
  }
  else if(!(validateEmail(Email)))
  {
    return "bad email"
  }
  else
  {
    //Get submission time
    var d = new Date();
    var currentTime = d.toDateString()+d.toTimeString();
    
    var sheet = SpreadsheetApp.openById(reminderSSKey).getActiveSheet();
    var data = sheet.getDataRange();
    var lastRow = sheet.getLastRow();
    var values = data.getValues();
    //var targetRange = sheet.getRange(lastRow+1, 1, 1, 6).setValues([[currentTime, ClubName,PosterTitle,PosterCaption,PosterDate,PosterID]]);
    
    var found = false;
    var row = lastRow;
    //Find email entry, if it exists.
    for(i=0; i<values.length; i++)
    {
      if(values[i][0]==Email)
      {
        row = i+1;
        found = true;
      }
    }
    
    if(found)
    {
      var reminderlist = String(sheet.getRange(row, 2).getValue()).replace(/\"/g, "");
      var reminderarray = reminderlist.split(",");
      if(reminderlist.indexOf(String(Poster)) == -1)
      {
        reminderarray.push(String(Poster));
        reminderlist = "\""+reminderarray.join()+"\"";
        Logger.log(reminderlist);
        var targetRange = sheet.getRange(row, 2).setValue(reminderlist);
      }
      else
      {
        Logger.log("Event omitted because it's already queued.");
      }
    }
    else
    {
      var targetRange = sheet.getRange(lastRow+1, 1, 1, 2).setValues([[Email, "\""+Poster+"\""]]);
    }
    
    return "good";
  }

 }

//Validate Emails
//Function to validate email and display the response
function validateEmail(email){
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  Logger.log("Checking: "+email);
  return(emailPattern.test(email));
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

function dispatchEmails()
{
  var sheet = SpreadsheetApp.openById(reminderSSKey).getActiveSheet();
  var data = sheet.getDataRange();
  var values = data.getValues();
  
  var postersheet = SpreadsheetApp.openById(submissionSSKey).getActiveSheet();
  var posterdata = postersheet.getDataRange();
  var postervalues = posterdata.getValues();
  
  var d = new Date();
  var today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
  for(i=0; i<values.length; i++)
  {
    //Send email
    var recipient = String(sheet.getRange(i+1, 1).getValue());
    var reminderlist = String(sheet.getRange(i+1, 2).getValue()).replace(/\"/g, "").split(",");
    
    var maillist = []
    
    for(p=0; p<reminderlist.length; p++)
    {
      for(j=0; j<postervalues.length; j++)
      { 
        //Poster ID in column 9. Poster APPROVAL in column 11.
        if(String(postersheet.getRange(j+1, 9).getValue())==reminderlist[p] && String(postersheet.getRange(j+1, 11).getValue()).toLowerCase()=="y")
        {
          //Poster Date in colum 4
          var posterdate = postersheet.getRange(j+1, 4).getValue();
          
          Logger.log("=============");
          Logger.log(posterdate);
          Logger.log(today);
          Logger.log(today.valueOf()==posterdate.valueOf());
          
          Logger.log("Hey");
          if(posterdate.valueOf()==today.valueOf())
          {
            maillist.push(j);
            Logger.log("HO");
          }
        }
      }
    }
    
    var posterbody = "";
    
    Logger.log(maillist.length);
    
    for(a=0; a<maillist.length; a++)
    {
      //Event name in col 3. Host name in col 2.
      posterbody += "<b><u>"+String(postersheet.getRange(maillist[a]+1, 3).getValue())+" (by "+String(postersheet.getRange(maillist[a]+1, 
2).getValue())+")</b></u><br />";
      var time = String(postersheet.getRange(maillist[a]+1, 5).getValue());
      if(time!="")
      {
        posterbody += "<p><i>When: "+Utilities.formatDate(new Date(time), "CST", "hh:mm a")+"</i></p>";
      }
      //Event location in col 7
      var location = String(postersheet.getRange(maillist[a]+1, 7).getValue());
      if(location!="")
      {
        posterbody += "<p><i>Where: "+location+"</i></p>";
      }
      //Event description in col 8.
      posterbody += "<p>"+urlify(String(postersheet.getRange(maillist[a]+1, 8).getValue()))+"</p>";
      
      //Poster id in col 9
      if(postersheet.getRange(maillist[a]+1, 10).getValue()==true)
      {
        posterbody += "<img src=\"https://googledrive.com/host/"+folderId+"/"+String(postersheet.getRange(maillist[a]+1, 9).getValue())+"\"><br /><br 
/>";
      }
    }
    
    
    if(posterbody != "")
    {
      var datetoday = Utilities.formatDate(today, "CST", "MM/dd/yy");
      if(maillist.length > 2)
      {
        var subject = "["+datetoday+"] Club Hub Today: "+String(postersheet.getRange(maillist[0]+1, 3).getValue())+", 
"+String(postersheet.getRange(maillist[1]+1, 3).getValue())+", and more!";
      }
      else if(maillist.length == 2)
      {
        var subject = "["+datetoday+"] Club Hub Today: "+String(postersheet.getRange(maillist[0]+1, 3).getValue())+" and 
"+String(postersheet.getRange(maillist[1]+1, 3).getValue());
      }
      else if(maillist.length == 1)
      {
        var subject = "["+datetoday+"] Club Hub Today: "+String(postersheet.getRange(maillist[0]+1, 3).getValue());
      }
      
      
      var header = "<p>Here's what's happening at Club Hub Today! For more details and events, see it all at <a 
href=\"https://george.moe/clubhub\">george.moe/clubhub</a>.<br /><br />";
      var footer = "<p>...and those are your events for today! Thank you for using the Club Hub RemindMe! Service.</p><i><font color=\"gray\">This 
service is in beta. Please report bugs to <a href=\"mailto:gmoe@imsa.edu\">gmoe@imsa.edu</a>.</font></i>";
      
      Logger.log("Send email to "+recipient);
      Logger.log("Send subject "+subject);
      Logger.log("Send body "+header+posterbody);
      
      MailApp.sendEmail({
        to: recipient,
        subject: subject,
        htmlBody: header+posterbody+footer,
      });
      
      for(a=0; a<maillist.length; a++)
      {
        reminderlist.splice(reminderlist.indexOf(String(postersheet.getRange(maillist[a]+1, 6).getValue())),1);
      }
      
      if(reminderlist.length==0)
      {
        sheet.deleteRow(i+1);
      }
      else
      {
        sheet.getRange(i+1, 2).setValue(reminderlist.join());
      }
      
      
    }
  }
}


