from django.utils import timezone
from django.utils.html import escape
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
#from django.core.mail import send_mail
from clubhub.settings import SENDGRID_API_KEY, MEDIA_URL
from .models import Event, Approver
from .forms import SubmitEvent
from .templatetags.sanitize import sanitize
import sendgrid
from sendgrid.helpers.mail import *
import pytz

event_fields = ["event_name", "event_host", "event_body", "event_datetime", "event_location",
                "event_specific_location", "display_fullscreen", "display_no_slideshow",
                "poster_file"]


def index(request):
    posters = Event.get_approved().filter(event_datetime__gt=timezone.now(), hide_from_registry=False).order_by(
        "event_datetime").only(*event_fields)
    return render(request, "main/index.html", {"posters": posters})

def set_timezone(request):
    if request.method == 'POST':
        request.session['django_timezone'] = request.POST['timezone']
        return redirect('/')

def get_present_posters():
    return Event.get_approved().filter(event_datetime__gt=timezone.now(), display_no_slideshow=False).order_by(
        "event_datetime").only(*event_fields)


def present(request):
    posters = get_present_posters()
    return render(request, "present/index.html", {"posters": posters})


def present_receiver(request):
    posters = get_present_posters()
    return render(request, "present/receiver.html", {"posters": posters})


def present_cast(request):
    return render(request, "present/cast.html")


def submit(request):
    if request.method == "POST":
        form = SubmitEvent(request.POST, request.FILES)
        if form.is_valid():
            event = form.save()

            sg = sendgrid.SendGridAPIClient(apikey=SENDGRID_API_KEY)
            from_email = Email("admin@clubhub.live")

            approvers = Approver.objects.values_list("email", flat=True)

            # message = "Hello!\n\n" \
            #           "     {} has submitted \"{}\" to ClubHub. The submission requires approval before it can be shown on ClubHub. " \
            #           "You can go to https://clubhub.live/admin to approve or reject this submission.\n\n" \
            #           "Submission details:\n\n" \
            #           "EVENT NAME: {}\n" \
            #           "EVENT HOST: {}\n" \
            #           "EVENT CONTACT: {}\n" \
            #           "EVENT DATETIME: {}\n" \
            #           "EVENT DESCRIPTION: {}\n" \
            #           "EVENT LOCATION: {}\n" \
            #           "EVENT POSTER: {}\n" \
            #           "SLIDESHOW?: {}\n" \
            #           "FULLSCREEN?: {}\n\n".format(
            #     escape(event.event_host),
            #     escape(event.event_name),
            #     escape(event.event_name),
            #     escape(event.event_host),
            #     escape(event.host_email),
            #     escape(event.event_datetime),
            #     sanitize(event.event_body),
            #     escape(event.event_location) + " ({})".format(
            #         escape(event.event_specific_location)) if escape(
            #         event.event_specific_location) else escape(
            #         event.event_location),
            #     "See ClubHub Central for poster." if event.poster_file else "No poster.",
            #     "Yes" if not event.display_no_slideshow else "No",
            #     "Yes" if event.display_fullscreen else "No") + \
            #           "     Thank you for using ClubHub!"

            html_message = "<p>Hello!</p>" \
                           "<p><i>{}</i> has submitted <b>\"{}\"</b> to ClubHub. The submission requires approval before it can be shown on ClubHub. " \
                           "You can go to <a href=\"https://clubhub.live/admin\">ClubHub Central</a> to approve or reject this submission.</p>" \
                           "<p>Submission details:</p>" \
                           "<table style=\"width: 100%\">" \
                           "<tr><td>EVENT NAME</td><td>{}</td></tr>" \
                           "<tr><td>EVENT HOST</td><td>{}</td></tr>" \
                           "<tr><td>EVENT CONTACT</td><td>{}</td></tr>" \
                           "<tr><td>EVENT DATETIME</td><td>{}</td></tr>" \
                           "<tr><td>EVENT DESCRIPTION</td><td>{}</td></tr>" \
                           "<tr><td>EVENT LOCATION</td><td>{}</td></tr>" \
                           "<tr><td>EVENT POSTER</td><td>{}</td></tr>" \
                           "<tr><td>SLIDESHOW?</td><td>{}</td></tr>" \
                           "<tr><td>FULLSCREEN?</td><td>{}</td></tr>" \
                           "</table>".format(
                escape(event.event_host),
                escape(event.event_name),
                escape(event.event_name),
                escape(event.event_host),
                escape(event.host_email),
                escape(event.event_datetime),
                sanitize(event.event_body),
                escape(event.event_location) + " ({})".format(
                    escape(event.event_specific_location)) if escape(
                    event.event_specific_location) else escape(
                    event.event_location),
                "<img src=\"https://clubhub.live" + MEDIA_URL + str(event.poster_file) + "\">" if event.poster_file else "No poster.",
                "Yes" if not event.display_no_slideshow else "No",
                "Yes" if event.display_fullscreen else "No") + \
                           "<p>Thank you for using ClubHub!</p>"

            for approver in approvers:
                subject = "[ClubHub] New Event Registration"
                to_email = Email(approver)
                content = Content("text/html", html_message)
                mail = Mail(from_email, subject, to_email, content)
                sg.client.mail.send.post(request_body=mail.get())

            # message = "Hello!\n\n" \
            #           "     Your submisson for \"{}\" has been received. Student Life will now review your event for approval." \
            #           " If it is approved, you'll be able to see it on the ClubHub registry at https://clubhub.live, so check there for updates." \
            #           " For corrections, questions, and concerns, please contact Student Life at imsaactivities@gmail.com.\n\n" \
            #           "Here are the details of your submission:\n\n" \
            #           "EVENT NAME: {}\n" \
            #           "EVENT HOST: {}\n" \
            #           "EVENT DATETIME: {}\n" \
            #           "EVENT DESCRIPTION: {}\n" \
            #           "EVENT LOCATION: {}\n" \
            #           "EVENT POSTER?: {}\n" \
            #           "SLIDESHOW?: {}\n" \
            #           "FULLSCREEN?: {}\n\n".format(
            #     escape(event.event_name),
            #     escape(event.event_name),
            #     escape(event.event_host),
            #     escape(event.event_datetime),
            #     sanitize(event.event_body),
            #     escape(event.event_location) + " ({})".format(
            #         escape(event.event_specific_location)) if escape(
            #         event.event_specific_location)
            #     else escape(event.event_location),
            #     "Yes" if event.poster_file else "No",
            #     "Yes" if event.display_no_slideshow else "No",
            #     "Yes" if event.display_fullscreen else "No") + \
            #           "     Thank you for using ClubHub!"

            html_message = "<p>Hello!</p>" \
                           "<p>Your submisson for <b>\"{}\"</b> has been received. Student Life will now review your event for approval." \
                           " If it is approved, you'll be able to see it on the ClubHub registry at https://clubhub.live, so check there for updates." \
                           " For corrections, questions, and concerns, please contact Student Life at <a href=\"mailto:imsaactivities@gmail.com\">imsaactivities@gmail.com</a>.</p>" \
                           "<p>Here are the details of your submission:</p>" \
                           "<table style=\"width: 100%\">" \
                           "<tr><td>EVENT NAME</td><td>{}</td></tr>" \
                           "<tr><td>EVENT HOST</td><td>{}</td></tr>" \
                           "<tr><td>EVENT DATETIME</td><td>{}</td></tr>" \
                           "<tr><td>EVENT DESCRIPTION</td><td>{}</td></tr>" \
                           "<tr><td>EVENT LOCATION</td><td>{}</td></tr>" \
                           "<tr><td>EVENT POSTER?</td><td>{}</td></tr>" \
                           "<tr><td>SLIDESHOW?</td><td>{}</td></tr>" \
                           "<tr><td>FULLSCREEN?</td><td>{}</td></tr>" \
                           "</table>".format(
                escape(event.event_name),
                escape(event.event_name),
                escape(event.event_host),
                escape(event.event_datetime),
                sanitize(event.event_body),
                escape(event.event_location) + " ({})".format(
                    escape(event.event_specific_location)) if escape(
                    event.event_specific_location)
                else escape(event.event_location),
                "Yes" if event.poster_file else "No",
                "Yes" if not event.display_no_slideshow else "No",
                "Yes" if event.display_fullscreen else "No") + \
                           "<p>Thank you for using ClubHub!</p>"

            subject = "[ClubHub] Registration Confirmation"
            to_email = Email(event.host_email)
            content = Content("text/html", html_message)
            mail = Mail(from_email, subject, to_email, content)
            sg.client.mail.send.post(request_body=mail.get())

            request.session["form_posted"] = True
            return HttpResponseRedirect("submit/success")
        else:
            return render(request, "submit/submit.html", {"form": form, "messages": "Something went wrong!"})

    else:
        form = SubmitEvent()
        return render(request, "submit/submit.html", {"form": form})


def success(request):
    if not request.session.pop('form_posted', False):
        return HttpResponseRedirect("/")
    return render(request, "submit/success.html")


def about(request):
    return HttpResponseRedirect("https://george.moe/#projects/clubhub")


def error404(request):
    return render(request, "main/404.html", status=404)
