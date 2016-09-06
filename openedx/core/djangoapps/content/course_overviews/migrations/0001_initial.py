# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
import model_utils.fields
import xmodule_django.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseOverview',
            fields=[
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('version', models.IntegerField()),
                ('id', xmodule_django.models.CourseKeyField(max_length=255, serialize=False, primary_key=True, db_index=True)),
                ('_location', xmodule_django.models.UsageKeyField(max_length=255)),
                ('org', models.TextField(default=b'outdated_entry', max_length=255)),
                ('display_name', models.TextField(null=True)),
                ('display_number_with_default', models.TextField()),
                ('display_org_with_default', models.TextField()),
                ('start', models.DateTimeField(null=True)),
                ('end', models.DateTimeField(null=True)),
                ('advertised_start', models.TextField(null=True)),
                ('announcement', models.DateTimeField(null=True)),
                ('course_image_url', models.TextField()),
                ('social_sharing_url', models.TextField(null=True)),
                ('end_of_course_survey_url', models.TextField(null=True)),
                ('certificates_display_behavior', models.TextField(null=True)),
                ('certificates_show_before_end', models.BooleanField(default=False)),
                ('cert_html_view_enabled', models.BooleanField(default=False)),
                ('has_any_active_web_certificate', models.BooleanField(default=False)),
                ('cert_name_short', models.TextField()),
                ('cert_name_long', models.TextField()),
                ('lowest_passing_grade', models.DecimalField(null=True, max_digits=5, decimal_places=2)),
                ('days_early_for_beta', models.FloatField(null=True)),
                ('mobile_available', models.BooleanField(default=False)),
                ('visible_to_staff_only', models.BooleanField(default=False)),
                ('_pre_requisite_courses_json', models.TextField()),
                ('enrollment_start', models.DateTimeField(null=True)),
                ('enrollment_end', models.DateTimeField(null=True)),
                ('enrollment_domain', models.TextField(null=True)),
                ('invitation_only', models.BooleanField(default=False)),
                ('max_student_enrollments_allowed', models.IntegerField(null=True)),
                ('catalog_visibility', models.TextField(null=True)),
                ('short_description', models.TextField(null=True)),
                ('course_video_url', models.TextField(null=True)),
                ('effort', models.TextField(null=True)),
                ('self_paced', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='CourseOverviewImageConfig',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('change_date', models.DateTimeField(auto_now_add=True, verbose_name='Change date')),
                ('enabled', models.BooleanField(default=False, verbose_name='Enabled')),
                ('small_width', models.IntegerField(default=375)),
                ('small_height', models.IntegerField(default=200)),
                ('large_width', models.IntegerField(default=750)),
                ('large_height', models.IntegerField(default=400)),
                ('changed_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, editable=False, to=settings.AUTH_USER_MODEL, null=True, verbose_name='Changed by')),
            ],
            options={
                'ordering': ('-change_date',),
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CourseOverviewImageSet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('small_url', models.TextField(default=b'', blank=True)),
                ('large_url', models.TextField(default=b'', blank=True)),
                ('course_overview', models.OneToOneField(related_name='image_set', to='course_overviews.CourseOverview')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CourseOverviewTab',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('tab_id', models.CharField(max_length=50)),
                ('course_overview', models.ForeignKey(related_name='tabs', to='course_overviews.CourseOverview')),
            ],
        ),
    ]
