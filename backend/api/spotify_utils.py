from .models import *
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(user_id):
    user = get_user_by_id(user_id)
    user_tokens = SpotifyToken.objects.filter(user=user)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def set_user_authenticated(user_id, value):
    user = get_user_by_id(user_id)
    if user:
        user.authenticated = value
        user.save(update_fields=['authenticated'])


def update_or_create_user_tokens(user_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(user_id)
    user = get_user_by_id(user_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=user, access_token=access_token,
                              refresh_token=refresh_token, token_type= token_type, expires_in=expires_in)
        tokens.save()


def refresh_spotify_token(user_id):
    refresh_token = get_user_tokens(user_id).refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_tokens(user_id, access_token, token_type, expires_in, refresh_token)


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            #Refresh token
            refresh_spotify_token(session_id)
        return True
    
    return False

def execute_spotify_api_request(user_id, endpoint, post_=False, put_=False, data_body={}, data_=False):
    tokens = get_user_tokens(user_id)
    header = {'Content-Type':'application/json', 'Authorization':'Bearer ' + tokens.access_token}

    if post_:
        response = post(BASE_URL + endpoint, headers=header)
        return response.content

    if put_ and data_:
        response = put(BASE_URL + endpoint,data=data_body, headers=header)
        return response.content

    if put_:
        response = put(BASE_URL + endpoint, headers=header)
        
    
    response = get(BASE_URL + endpoint, {}, headers=header)

    try:
        return response.json()
    except:
        return {'Error':'Issue with request'}