# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import jsonfield.fields
import django.db.models.deletion
import badges.models
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
            name='BadgeAssertion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False, db_index=True)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('data', jsonfield.fields.JSONField()),
                ('backend', models.CharField(max_length=50)),
                ('image_url', models.URLField()),
                ('assertion_url', models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name='BadgeClass',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('slug', models.SlugField(max_length=255, validators=[badges.models.validate_lowercase])),
                ('issuing_component', models.SlugField(default=b'', blank=True, validators=[badges.models.validate_lowercase])),
                ('display_name', models.CharField(max_length=255)),
                ('course_id', xmodule_django.models.CourseKeyField(default=None, max_length=255, blank=True)),
                ('description', models.TextField()),
                ('criteria', models.TextField()),
                ('mode', models.CharField(default=b'', max_length=100, blank=True)),
                ('image', models.ImageField(upload_to=b'badge_classes', validators=[badges.models.validate_badge_image])),
            ],
            options={
                'verbose_name_plural': 'Badge Classes',
            },
        ),
        migrations.CreateModel(
            name='CourseCompleteImageConfiguration',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('mode', models.CharField(help_text='The course mode for this badge image. For example, "verified" or "honor".', unique=True, max_length=125)),
                ('icon', models.ImageField(help_text='Badge images must be square PNG files. The file size should be under 250KB.', upload_to=b'course_complete_badges', validators=[badges.models.validate_badge_image])),
                ('default', models.BooleanField(default=False, help_text='Set this value to True if you want this image to be the default image for any course modes that do not have a specified badge image. You can have only one default image.')),
            ],
        ),
        migrations.CreateModel(
            name='CourseEventBadgesConfiguration',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('change_date', models.DateTimeField(auto_now_add=True, verbose_name='Change date')),
                ('enabled', models.BooleanField(default=False, verbose_name='Enabled')),
                ('courses_completed', models.TextField(default=b'', help_text="On each line, put the number of completed courses to award a badge for, a comma, and the slug of a badge class you have created that has the issuing component 'openedx__course'. For example: 3,enrolled_3_courses", blank=True)),
                ('courses_enrolled', models.TextField(default=b'', help_text="On each line, put the number of enrolled courses to award a badge for, a comma, and the slug of a badge class you have created that has the issuing component 'openedx__course'. For example: 3,enrolled_3_courses", blank=True)),
                ('course_groups', models.TextField(default=b'', help_text="Each line is a comma-separated list. The first item in each line is the slug of a badge class you have created that has an issuing component of 'openedx__course'. The remaining items in each line are the course keys the learner needs to complete to be awarded the badge. For example: slug_for_compsci_courses_group_badge,course-v1:CompSci+Course+First,course-v1:CompsSci+Course+Second", blank=True)),
                ('changed_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, editable=False, to=settings.AUTH_USER_MODEL, null=True, verbose_name='Changed by')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='badgeclass',
            unique_together=set([('slug', 'issuing_component', 'course_id')]),
        ),
        migrations.AddField(
            model_name='badgeassertion',
            name='badge_class',
            field=models.ForeignKey(to='badges.BadgeClass'),
        ),
        migrations.AddField(
            model_name='badgeassertion',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
    ]
