# Generated by Django 4.2.4 on 2023-12-28 14:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_room_bammed_users_alter_room_current_song_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='bammed_users',
            new_name='banned_users',
        ),
    ]
