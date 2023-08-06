from django.db import models
import string, random

def generate_unique_code():
    length = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break

    return code

class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.IntegerField(unique=True)
    room_name = models.CharField(max_length=30, default="Music Room")
    guest_can_pause = models.BooleanField(null=False, default=False)
    guest_can_queue = models.BooleanField(null=False, default=False)

    def __str__(self):
        return self.code

class User(models.Model):
    id = models.IntegerField(unique=True, primary_key=True)
    username = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=30)
    verified = models.BooleanField(default=False)
    authenticated = models.BooleanField(default=False)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

class SpotifyToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=150)
    refresh_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)