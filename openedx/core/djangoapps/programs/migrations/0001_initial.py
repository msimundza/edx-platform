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
            name='ProgramsApiConfig',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('change_date', models.DateTimeField(auto_now_add=True, verbose_name='Change date')),
                ('enabled', models.BooleanField(default=False, verbose_name='Enabled')),
                ('api_version_number', models.IntegerField(verbose_name='API Version')),
                ('internal_service_url', models.URLField(verbose_name='Internal Service URL')),
                ('public_service_url', models.URLField(verbose_name='Public Service URL')),
                ('marketing_path', models.CharField(help_text='Path used to construct URLs to programs marketing pages (e.g., "/foo").', max_length=255, blank=True)),
                ('authoring_app_js_path', models.CharField(help_text='This value is required in order to enable the Studio authoring interface.', max_length=255, verbose_name="Path to authoring app's JS", blank=True)),
                ('authoring_app_css_path', models.CharField(help_text='This value is required in order to enable the Studio authoring interface.', max_length=255, verbose_name="Path to authoring app's CSS", blank=True)),
                ('cache_ttl', models.PositiveIntegerField(default=0, help_text='Specified in seconds. Enable caching by setting this to a value greater than 0.', verbose_name='Cache Time To Live')),
                ('enable_student_dashboard', models.BooleanField(default=False, verbose_name='Enable Student Dashboard Displays')),
                ('enable_studio_tab', models.BooleanField(default=False, verbose_name='Enable Studio Authoring Interface')),
                ('enable_certification', models.BooleanField(default=False, verbose_name='Enable Program Certificate Generation')),
                ('max_retries', models.PositiveIntegerField(default=11, help_text='When making requests to award certificates, make at most this many attempts to retry a failing request.', verbose_name='Maximum Certification Retries')),
                ('xseries_ad_enabled', models.BooleanField(default=False, verbose_name='Do we want to show xseries program advertising')),
                ('program_listing_enabled', models.BooleanField(default=False, verbose_name='Do we want to show program listing page')),
                ('program_details_enabled', models.BooleanField(default=False, verbose_name='Do we want to show program details pages')),
                ('changed_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, editable=False, to=settings.AUTH_USER_MODEL, null=True, verbose_name='Changed by')),
            ],
            options={
                'ordering': ('-change_date',),
                'abstract': False,
            },
        ),
    ]
