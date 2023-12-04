from rest_framework import serializers
from .models import Room, User, SpotifyToken

# User Serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'verified', 'authenticated', 'room')


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')

class UserRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (['id'])

# Room Serializers

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('code', 'host', 'password', 'room_name', 'guest_pause',
                  'guest_manage_queue', 'guest_skip',
                  'private_room','show_lobby','guest_add_queue')


class RoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('host', 'password', 'room_name', 'guest_pause',
                  'guest_manage_queue', 'guest_skip',
                  'private_room','show_lobby','guest_add_queue')

class RoomEnterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('user', 'room_code', 'password')

# Spotify Serializers

class TokensSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotifyToken
        fields = ('user', 'created_at', 'access_token', 'refresh_token',
                  'expires_in', 'token_type')
        
