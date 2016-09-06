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
            name='EmailMarketingConfiguration',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('change_date', models.DateTimeField(auto_now_add=True, verbose_name='Change date')),
                ('enabled', models.BooleanField(default=False, verbose_name='Enabled')),
                ('sailthru_key', models.CharField(help_text='API key for accessing Sailthru. ', max_length=32)),
                ('sailthru_secret', models.CharField(help_text='API secret for accessing Sailthru. ', max_length=32)),
                ('sailthru_new_user_list', models.CharField(help_text='Sailthru list name to add new users to. ', max_length=48)),
                ('sailthru_retry_interval', models.IntegerField(default=3600, help_text='Sailthru connection retry interval (secs).')),
                ('sailthru_max_retries', models.IntegerField(default=24, help_text='Sailthru maximum retries.')),
                ('sailthru_activation_template', models.CharField(help_text='Sailthru template to use on activation send. ', max_length=20, blank=True)),
                ('sailthru_abandoned_cart_template', models.CharField(help_text='Sailthru template to use on abandoned cart reminder. Deprecated.', max_length=20, blank=True)),
                ('sailthru_abandoned_cart_delay', models.IntegerField(default=60, help_text='Sailthru minutes to wait before sending abandoned cart message. Deprecated.')),
                ('sailthru_enroll_template', models.CharField(help_text='Sailthru send template to use on enrolling for audit. ', max_length=20, blank=True)),
                ('sailthru_upgrade_template', models.CharField(help_text='Sailthru send template to use on upgrading a course. Deprecated ', max_length=20, blank=True)),
                ('sailthru_purchase_template', models.CharField(help_text='Sailthru send template to use on purchasing a course seat. Deprecated ', max_length=20, blank=True)),
                ('sailthru_get_tags_from_sailthru', models.BooleanField(default=True, help_text='Use the Sailthru content API to fetch course tags.')),
                ('sailthru_content_cache_age', models.IntegerField(default=3600, help_text='Number of seconds to cache course content retrieved from Sailthru.')),
                ('sailthru_enroll_cost', models.IntegerField(default=100, help_text='Cost in cents to report to Sailthru for enrolls.')),
                ('sailthru_lms_url_override', models.CharField(help_text='Optional lms url scheme + host used to construct urls for content library, e.g. https://courses.edx.org.', max_length=80, blank=True)),
                ('changed_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, editable=False, to=settings.AUTH_USER_MODEL, null=True, verbose_name='Changed by')),
            ],
        ),
    ]
