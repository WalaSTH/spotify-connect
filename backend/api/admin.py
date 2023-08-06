from django.contrib import admin

from .models import Room

class RoomAdmin(admin.ModelAdmin):
    list_display = ('code', 'host', 'room_name', 'guest_can_pause',
                  'guest_can_queue')

# Register your models here.

admin.site.register(Room, RoomAdmin)