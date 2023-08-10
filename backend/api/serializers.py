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


# Room Serializers

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('code', 'host', 'room_name', 'guest_can_pause',
                  'guest_can_queue', 'guest_can_chat', 'guest_can_skip', 'private')


class RoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('host', 'room_name', 'guest_can_pause','guest_can_queue',
                  'guest_can_chat', 'guest_can_skip', 'private')


# Spotify Serializers

class TokensSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotifyToken
        fields = ('user', 'created_at', 'access_token', 'refresh_token',
                  'expires_in', 'token_type')