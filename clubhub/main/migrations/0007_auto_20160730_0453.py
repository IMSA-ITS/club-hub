# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-07-30 04:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_auto_20160730_0452'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='approved',
            field=models.BooleanField(default=False, verbose_name='Approve event?'),
        ),
    ]