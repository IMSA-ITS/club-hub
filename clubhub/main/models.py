import datetime
from django.db import models
from django.utils.html import escape
from os import urandom
from os.path import join
from binascii import hexlify


def get_upload_path(instance, filename):
    hash = hexlify(urandom(16)).decode()
    return join("posters/{}/{}/{}".format(datetime.date.today().year,
                                          datetime.date.today().month,
                                          datetime.date.today().day), hash)


class Event(models.Model):
    LOCATION_OPTIONS = (
        ("1501", "1501"),
        ("1502", "1502"),
        ("1503", "1503"),
        ("1504", "1504"),
        ("1505", "1505"),
        ("1506", "1506"),
        ("1507", "1507"),
        ("1508", "1508"),
        ("awing", "A-Wing Classrooms"),
        ("bwing", "B-Wing Classrooms"),
        ("cac", "CAC Offices"),
        ("acpit", "AC Pit"),
        ("msarea", "Math/Study Area"),
        ("tvpit", "TV Pit"),
        ("irc", "IRC"),
        ("sodexo", "Sodexo"),
        ("oldcafe", "Old Cafe"),
        ("science", "Science Atrium"),
        ("music", "Music Wing"),
        ("union", "Student Union"),
        ("lecture", "Lecture Hall"),
        ("auditorium", "Auditorium"),
        ("mgym", "Main Gym"),
        ("wgym", "West Gym"),
        ("outside", "Outside"),
        ("other", "Other")
    )

    event_name = models.CharField(max_length=200, verbose_name="Event Name")
    event_host = models.CharField(max_length=100, verbose_name="Event Host")
    host_email = models.EmailField(verbose_name="Contact Email")
    event_body = models.TextField(verbose_name="Event Description")
    event_start_datetime = models.DateTimeField(verbose_name="Event Start Date/Time")
    event_end_datetime = models.DateTimeField(verbose_name="Event End Date/Time")
    event_location = models.CharField(max_length=100, choices=LOCATION_OPTIONS, verbose_name="General Location")
    event_specific_location = models.CharField(blank=True, max_length=100, verbose_name="Specific Location")
    # Perhaps this will be useful in the future when we get more TVs.
    # display_group = models.CharField(blank=True, max_length=100, verbose_name="Display Group")
    display_fullscreen = models.BooleanField(default=False, verbose_name="Display poster fullscreen on Club Hub LIVE")
    display_no_slideshow = models.BooleanField(default=False, verbose_name="Don't show on Club Hub LIVE")
    poster_file = models.ImageField(blank=True, null=True, verbose_name="Poster File", upload_to=get_upload_path)
    slide_duration = models.IntegerField(default=20000, verbose_name="Slide Duration",
                                         help_text="Duration of slide on Club Hub LIVE in milleseconds.")
    allow_custom_html = models.BooleanField(default=False, verbose_name="Allow custom HTML?",
                                            help_text="SECURITY WARNING: Enabling this allows the Event Description to be rendered as HTML in Club Hub LIVE, "
                                                      "which might disrupt the entire service. Check the description to make sure that it is safe before "
                                                      "enabling this option.")
    custom_function = models.CharField(max_length=32, verbose_name="Custom Function ID",
                                       help_text="SECURITY WARNING: This is only enabled with Custom HTML. This is the designation for this slide's setup and "
                                                 "teardown methods. They will be stepfunction_NAME_start() and stepfunction_NAME_teardown().",
                                       null=True, blank=True)
    hide_from_registry = models.BooleanField(default=False, verbose_name="Don't show in the public registry.")
    approved = models.BooleanField(default=False, verbose_name="Event approved?")

    def __str__(self):
        return ("\"" + self.event_name + "\" by " + self.event_host)

    # def generate_upload_path(self, instance, filename):
    # 	return "/".join("posters/%Y/%m/%d/", str(int(time.time()*1000)))

    def poster_preview(self):
        if self.poster_file:
            return "<a class=\"fancybox\" href=\"{}\" rel=\"posters\"><img src=\"{}\" style=\"width: 100px\" /></a>".format(
                self.poster_file.url, self.poster_file.url)
        else:
            return "None"

    poster_preview.short_description = 'Poster Preview'
    poster_preview.allow_tags = True

    def body_preview(self):
        preview = self.event_body[0:300]
        if len(self.event_body) > 300:
            preview += "..."
        return escape(preview)

    body_preview.short_description = 'Event Description'
    body_preview.allow_tags = True

    @classmethod
    def get_approved(cls):
        return cls.objects.filter(approved=True)


class Approver(models.Model):
    name = models.CharField(max_length=200, verbose_name="Approver Name")
    email = models.EmailField(verbose_name="Approver Email")
