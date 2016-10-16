from django import template
from main.models import Event

register = template.Library()

def humanize(value):
    dictionary = dict(Event.LOCATION_OPTIONS)

    if value in dictionary:
        return dictionary[value]
    else:
        return value

register.filter("humanize", humanize)