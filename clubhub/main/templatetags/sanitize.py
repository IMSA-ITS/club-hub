from django import template
from django.utils.html import escape
from django.utils.safestring import mark_safe

register = template.Library()

def sanitize(text):

    replacements = {
        "&lt;b&gt;": "<b>",
        "&lt;/b&gt;": "</b>",
        "&lt;i&gt;": "<i>",
        "&lt;/i&gt;": "</i>",
        "&lt;u&gt;": "<u>",
        "&lt;/u&gt;": "</u>",
        "&lt;br \&gt;": "<br \>",
        "\n": "<br />"
    }

    safetext = escape(text)
    for r in replacements:
        safetext = safetext.replace(r, replacements[r])

    return mark_safe(safetext)


register.filter("sanitize", sanitize)