from django.contrib import admin

from .models import Room, User, SpotifyToken

class RoomAdmin(admin.ModelAdmin):
    list_display = ('code', 'host', 'password', 'room_name', 'guest_pause',
                  'guest_manage_queue', 'guest_chat', 'guest_skip',
                  'private_room','show_lobby','guest_add_queue')

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username', 'password', 'verified',
                  'authenticated', 'room')

class SpotifyTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'access_token', 'refresh_token', 'expires_in',
                  'token_type')

# Register your models here.

admin.site.register(Room, RoomAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(SpotifyToken, SpotifyTokenAdmin)