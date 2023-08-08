from rest_framework import serializers
from .models import Room, User, SpotifyToken

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('code', 'host', 'room_name', 'guest_can_pause',
                  'guest_can_queue')


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