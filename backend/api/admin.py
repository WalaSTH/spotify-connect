from django.contrib import admin

from .models import Room

class RoomAdmin(admin.ModelAdmin):
    list_display = ('code', 'host', 'password', 'room_name', 'guest_pause',
                  'guest_manage_queue', 'guest_chat', 'guest_skip',
                  'private_room','show_lobby','guest_add_queue')

# Register your models here.

admin.site.register(Room, RoomAdmin)