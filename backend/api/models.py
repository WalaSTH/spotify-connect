from django.db import models
import string, random


# User constraints
USER_MIN_LEN = 4
USER_MAX_LEN = 16
PASSWORD_MIN_LEN = 8
PASSWORD_MAX_LEN = 60
EMAIL_MIN_LEN = 4
EMAIL_MAX_LEN = 60

# Room constraints
ROOM_NAME_MAX_LEN = 30
ROOM_CODE_MAX_LEN = 8

# Models

def generate_unique_code():
    length = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break

    return code


def generate_unique_id():
    length = 64

    while True:
        id = ''.join(random.choices(string.hexdigits, k=length))
        if User.objects.filter(id=id).count() == 0:
            break

    return id

class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.IntegerField(unique=True)
    room_name = models.CharField(max_length=30, default="Music Room")
    guest_can_pause = models.BooleanField(null=False, default=False)
    guest_can_queue = models.BooleanField(null=False, default=False)

    def __str__(self):
        return self.code

class User(models.Model):
    id = models.CharField(max_length=64, unique=True, primary_key=True, default=generate_unique_id)
    email = models.CharField(unique=True, max_length=EMAIL_MAX_LEN)
    username = models.CharField(max_length=USER_MAX_LEN)
    password = models.CharField(max_length=PASSWORD_MAX_LEN)
    verified = models.BooleanField(default=False)
    authenticated = models.BooleanField(default=False)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, null=True, blank=True)

class SpotifyToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=150)
    refresh_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)


# Helper functions

def user_name_exists(username):
    users = User.objects.filter(username=username)
    return users.exists()


def user_id_exists(username):
    users = User.objects.filter(id=id)
    return users.exists()


def get_user_by_id(id):
    res = None
    if user_id_exists(id):
        res = User.objects.filter(id=id)[0]
    return res


def get_user_by_username(username):
    res = None
    if user_name_exists(username):
        res = User.objects.filter(username=username)[0]
    return res

def user_match_pass(username, password):
    res = None
    if user_name_exists(username):
        res = password == User.objects.filter(username=username)[0].password
    return res

def get_user_id(username):
    id = None
    if user_name_exists(username):
        id = User.objects.filter(username=username)[0].id
    return id