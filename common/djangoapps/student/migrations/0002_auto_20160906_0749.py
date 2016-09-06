# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='announcements',
            name='announcement',
            field=models.CharField(default=b'Lorem ipsum', max_length=1000),
        ),
    ]
