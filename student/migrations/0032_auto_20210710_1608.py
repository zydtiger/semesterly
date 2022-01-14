# Generated by Django 2.2.18 on 2021-07-10 21:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("student", "0031_auto_20200126_1700"),
    ]

    operations = [
        migrations.AlterField(
            model_name="personaltimetable",
            name="has_conflict",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name="student",
            name="first_name",
            field=models.CharField(default="", max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="student",
            name="hopid",
            field=models.CharField(default="", max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name="student",
            name="jhed",
            field=models.CharField(default="", max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name="student",
            name="last_name",
            field=models.CharField(default="", max_length=255, null=True),
        ),
    ]
