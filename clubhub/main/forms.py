from django import forms
from .models import Event


class SubmitEvent(forms.ModelForm):
    required_css_class = "required"
    event_datetime = forms.DateTimeField(input_formats=["%m/%d/%Y %H:%M%z"], label="Event End Date/Time")

    class Meta:
        model = Event
        fields = ("event_name", "event_host", "host_email", "event_body", "event_datetime", "event_location",
                  "event_specific_location", "display_fullscreen", "display_no_slideshow",
                  "poster_file")
        widgets = dict({field: forms.widgets.TextInput() for field in
                        ["event_name", "event_host", "host_email", "event_specific_location"]}, **{
            "event_body": forms.widgets.Textarea(),
            "poster_file": forms.widgets.ClearableFileInput()
        })
