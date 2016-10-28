from django import forms
from .models import Event


class SubmitEvent(forms.ModelForm):
    required_css_class = "required"
    event_start_datetime = forms.DateTimeField(input_formats=("%m/%d/%Y %I:%M %p",), label="Event Start Date/Time")
    event_end_datetime = forms.DateTimeField(input_formats=("%m/%d/%Y %I:%M %p",), label="Event End Date/Time")

    class Meta:
        model = Event
        fields = ("event_name", "event_host", "host_email", "event_body", "event_start_datetime", "event_end_datetime", "event_location",
                  "event_specific_location", "display_fullscreen", "display_no_slideshow",
                  "poster_file")
        widgets = dict({field: forms.widgets.TextInput() for field in
                        ["event_name", "event_host", "host_email", "event_specific_location"]}, **{
            "event_body": forms.widgets.Textarea(),
            "poster_file": forms.widgets.ClearableFileInput()
        })
