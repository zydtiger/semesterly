# Generated by Django 2.2.18 on 2021-06-21 02:50

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("analytics", "0018_auto_20170615_1835"),
    ]

    operations = [
        migrations.AlterField(
            model_name="analyticscoursesearch",
            name="is_advanced",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name="analyticstimetable",
            name="has_conflict",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name="calendarexport",
            name="is_google_calendar",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name="sharedtimetable",
            name="has_conflict",
            field=models.BooleanField(blank=True, default=False),
        ),
    ]
