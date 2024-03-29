# Generated by Django 4.2.4 on 2024-02-29 22:00

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_room_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='last_queue',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(blank=True, null=True), default=[], size=None),
            preserve_default=False,
        ),
    ]
