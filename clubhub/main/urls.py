import django.conf.urls
from django.conf.urls import url
from django.conf import settings
from django.conf.urls.static import static


from . import views

urlpatterns = [
    url(r'^about/*$', views.about, name='about'),
    url(r'^submit/*$', views.submit, name='submit'),
    url(r'^submit/success$', views.success, name='success'),
    url(r'^present/*$', views.present, name='present'),
    url(r'^present/receiver$', views.present_receiver, name='present.receiver'),
    url(r'^present/cast/*$', views.present_cast, name='present.cast'),
    url(r'^$', views.index, name='index'),
]

django.conf.urls.handler404 = views.error404
