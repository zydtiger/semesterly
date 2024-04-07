# Generated by Django 2.2.18 on 2021-07-10 21:08

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("timetable", "0033_section_course_section_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="course",
            name="areas",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.TextField(default="", null=True),
                default=list,
                size=None,
            ),
        ),
        migrations.AlterField(
            model_name="course",
            name="pos",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.TextField(default="", null=True),
                default=list,
                size=None,
            ),
        ),
        migrations.AlterField(
            model_name="course",
            name="sub_school",
            field=models.TextField(default="", null=True),
        ),
        migrations.AlterField(
            model_name="course",
            name="writing_intensive",
            field=models.TextField(default="", null=True),
        ),
    ]
