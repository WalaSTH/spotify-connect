# Generated by Django 4.2.4 on 2023-10-04 20:29

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_room_spot_queue'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='user_queue',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(null=True), size=None),
        ),
    ]
