# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AppVersionConfig',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('platform', models.CharField(max_length=50, choices=[(b'Android', b'Android'), (b'iOS', b'iOS')])),
                ('version', models.CharField(help_text=b'Version should be in the format X.X.X.Y where X is a number and Y is alphanumeric', max_length=50)),
                ('major_version', models.IntegerField()),
                ('minor_version', models.IntegerField()),
                ('patch_version', models.IntegerField()),
                ('expire_at', models.DateTimeField(null=True, verbose_name=b'Expiry date for platform version', blank=True)),
                ('enabled', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-major_version', '-minor_version', '-patch_version'],
            },
        ),
        migrations.CreateModel(
            name='MobileApiConfig',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('change_date', models.DateTimeField(auto_now_add=True, verbose_name='Change date')),
                ('enabled', models.BooleanField(default=False, verbose_name='Enabled')),
                ('video_profiles', models.TextField(help_text=b'A comma-separated list of names of profiles to include for videos returned from the mobile API.', blank=True)),
                ('changed_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, editable=False, to=settings.AUTH_USER_MODEL, null=True, verbose_name='Changed by')),
            ],
            options={
                'ordering': ('-change_date',),
                'abstract': False,
            },
        ),
        migrations.AlterUniqueTogether(
            name='appversionconfig',
            unique_together=set([('platform', 'version')]),
        ),
    ]
