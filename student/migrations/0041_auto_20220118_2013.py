# Generated by Django 3.2.7 on 2022-01-19 01:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0040_auto_20211227_1056'),
    ]

    operations = [
        migrations.AddField(
            model_name='personalevent',
            name='color',
            field=models.CharField(default='#F8F6F7', max_length=7),
        ),
        migrations.AddField(
            model_name='personalevent',
            name='credit',
            field=models.DecimalField(blank=True, decimal_places=1, default=0.0, max_digits=3, null=True),
        ),
        migrations.AddField(
            model_name='personalevent',
            name='location',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
