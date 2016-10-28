from django.contrib import admin

# Register your models here.

from .models import Event, Approver


def approve_event(modeladmin, request, queryset):
    queryset.update(approved=True)
approve_event.short_description = "Approve selected events"


def disapprove_event(modeladmin, request, queryset):
    queryset.update(approved=False)
disapprove_event.short_description = "Disapprove selected events"


class EventAdmin(admin.ModelAdmin):
    list_display = ["event_name", "event_host", "body_preview", "event_location", "event_start_datetime", "poster_preview", "approved"]
    ordering = ["approved", "-event_start_datetime"]
    actions = [disapprove_event, approve_event]
    normaluser_fields = ("event_name", "event_host", "host_email", "event_body", "event_start_datetime", "event_end_datetime", "event_location",
                  "event_specific_location", "display_fullscreen", "display_no_slideshow",
                  "poster_file", "poster_preview", "slide_duration", "approved")
    superuser_fields = ("allow_custom_html", "custom_function", "hide_from_registry")
    readonly_fields = ("poster_preview",)

    def get_form(self, request, obj=None, **kwargs):
        if request.user.is_superuser:
            self.fields = self.normaluser_fields + self.superuser_fields
        else:
            self.fields = self.normaluser_fields

        return super(EventAdmin, self).get_form(request, obj, **kwargs)
admin.site.register(Event, EventAdmin)

class ApproverAdmin(admin.ModelAdmin):
    list_display = ["name", "email"]
    ordering = ["name"]
admin.site.register(Approver, ApproverAdmin)