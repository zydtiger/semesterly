# Generated by Django 3.2.10 on 2022-01-01 00:17

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("timetable", "0036_auto_20211005_2122"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="course",
            name="vector",
        ),
    ]
