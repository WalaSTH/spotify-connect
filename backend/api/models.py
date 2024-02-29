from django.db import models
import string, random
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.hashers import make_password, check_password


# User constraints
USER_MIN_LEN = 4
USER_MAX_LEN = 16
PASSWORD_MIN_LEN = 8
PASSWORD_MAX_LEN = 60
PASSWORD_MAX_LEN_ENCODED = 600
EMAIL_MIN_LEN = 4
EMAIL_MAX_LEN = 60

# Room constraints
ROOM_NAME_MAX_LEN = 30
ROOM_NAME_MIN_LEN = 2
ROOM_CODE_LENGTH = 32
ROOM_MIN_PASSOWRD = 3
ROOM_MAX_PASSWORD = 16
ROOM_MAX_PASSWORD_ENCODED = 600

# Other
SESSION_KEY_LENGHT = 32

# Models

def generate_unique_code():
    length = ROOM_CODE_LENGTH

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
    code = models.CharField(max_length=ROOM_CODE_LENGTH, default=generate_unique_code, unique=True, primary_key=True)
    host = models.CharField(max_length=64, default=None)
    password = models.CharField(max_length=ROOM_MAX_PASSWORD_ENCODED, null=True, blank=True)
    room_name = models.CharField(max_length=30, default="Music Room")
    guest_pause = models.BooleanField(null=False, default=False)
    guest_add_queue = models.BooleanField(null=False, default=False)
    guest_manage_queue = models.BooleanField(null=False, default=False)
    guest_skip = models.BooleanField(null=False, default=False)
    show_lobby = models.BooleanField(null=False, default=False)
    private_room = models.BooleanField(null=False, default=False)
    current_song = models.JSONField(null=True, blank=True)
    spot_queue = ArrayField(
        models.JSONField(null=True, blank=True)
    )
    user_queue = ArrayField(
        models.JSONField(null=True, blank=True)
    )
    last_queue = ArrayField(
        models.JSONField(null=True, blank=True)
    )
    last_id = models.IntegerField()
    user_count = models.IntegerField()
    banned_users = ArrayField(
        models.CharField(max_length=64, default=None, null=True, blank=True)
    )
    def __str__(self):
        return self.code

class User(models.Model):
    id = models.CharField(max_length=64, unique=True, primary_key=True, default=generate_unique_id)
    email = models.CharField(unique=True, max_length=EMAIL_MAX_LEN)
    username = models.CharField(max_length=USER_MAX_LEN)
    password = models.CharField(max_length=PASSWORD_MAX_LEN_ENCODED)
    verified = models.BooleanField(default=False)
    authenticated = models.BooleanField(default=False)
    room = models.CharField(max_length=ROOM_CODE_LENGTH, default="", blank=True, null=True)


class SpotifyToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    access_token = models.CharField(max_length=250)
    refresh_token = models.CharField(max_length=250)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

class UserFrontendSession(models.Model):
    key = models.CharField(max_length=SESSION_KEY_LENGHT)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

# Helper User functions

def user_name_exists(username):
    users = User.objects.filter(username=username)
    return users.exists()


def user_id_exists(id):
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
        #res = password_hashed == User.objects.filter(username=username)[0].password
        res = check_password(password, User.objects.filter(username=username)[0].password)
    return res

def get_user_id(username):
    id = None
    if user_name_exists(username):
        id = User.objects.filter(username=username)[0].id
    return id

# Helper Room functions

def get_room_by_host(host_id):
    room = None
    if user_id_exists(host_id):
        queryset = Room.objects.filter(host=host_id)
        if queryset.exists():
            room = queryset[0]
    return room

def get_room_by_code(room_code):
    room = None
    queryset = Room.objects.filter(code=room_code)
    if queryset.exists():
        room = queryset[0]
    return room

def room_exists(room_code):
    queryset = Room.objects.filter(code=room_code)
    return queryset.exists()

def room_password_match(room_code, input_password):
    room = Room.objects.filter(code=room_code)[0]
    room_password = room.password
    return check_password(input_password, room_password)

def join_user(room_code, user_id):
    user = get_user_by_id(user_id)
    user.room = room_code
    user.save(update_fields=['room'])
    room = get_room_by_code(room_code)
    room.user_count=room.user_count+1
    room.save(update_fields=['user_count'])

def user_in_room(room_code, user_id):
    user = get_user_by_id(user_id)
    res = False
    if user.room:
        res = user.room == room_code
    return res

def user_in_any_room(user_id):
    user = get_user_by_id(user_id)
    res = False
    if user.room:
        res = True
    return res