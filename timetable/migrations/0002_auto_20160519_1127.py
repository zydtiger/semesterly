"""
Copyright (C) 2017 Semester.ly Technologies, LLC

Semester.ly is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Semester.ly is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
"""

# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-19 16:27


from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("timetable", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="section",
            old_name="name",
            new_name="meeting_section",
        ),
        migrations.AddField(
            model_name="section",
            name="textbooks",
            field=models.ManyToManyField(
                through="timetable.TextbookLink", to="timetable.Textbook"
            ),
        ),
    ]
