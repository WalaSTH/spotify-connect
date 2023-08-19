from django.shortcuts import render, redirect

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from requests import Request, post, put, get
from django.http import JsonResponse
from ..spotify_utils import *
from ..serializers import *
from ..models import *
from ..credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
import json

class AuthURL(APIView):
    lookup_karg = 'user_id'
    def get(self, request, format=None):
        user = request.GET.get(self.lookup_karg)
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'state':user,
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
        }).prepare().url
        return Response({'url':url}, status=status.HTTP_200_OK)



def spotify_callback(request, format=None):
    code = request.GET.get('code')
    user_id = request.GET.get('state')
    error = request.GET.get('error')
    if not user_id_exists(user_id):
        return JsonResponse({'Msg':"user not found"}, status=status.HTTP_404_NOT_FOUND)

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    update_or_create_user_tokens(user_id, access_token, token_type, expires_in, refresh_token)

    set_user_authenticated(user_id, True)

    return redirect('http://localhost:3000/room')


class IsAuthenticated(APIView):
    lookup_url_kwarg = 'user_id'

    def get(self, request, format=None):
        user_id = request.GET.get(self.lookup_url_kwarg)
        is_authenticated = is_spotify_authenticated(user_id)
        return Response({'status':{is_authenticated}}, status=status.HTTP_200_OK)


class GetTokens(generics.ListAPIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()


class TokenView(generics.ListAPIView):
    serializer_class = TokensSerializer
    queryset = SpotifyToken.objects.all()

class CurrentSong(APIView):
    def get(self, request, format=None):
        user_id = request.GET.get('user_id')

        user=get_user_by_id(user_id)
        if user == None:
            return Response({'Msg':'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.room == "":
            return Response({'Msg':'User not in room'}, status=status.HTTP_404_NOT_FOUND)

        room_code = user.room
        room = get_room_by_code(room_code)
        host_id = room.host

        if room == None:
            return Response({'Msg':'No room found'}, status=status.HTTP_404_NOT_FOUND)
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host_id, endpoint)

        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name
        #votes = len(Vote.objects.filter(room=room, song_id=song_id))

        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'id': song_id
        }

        self.update_room_song(room, song_id)

        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        current_song = room.current_song

        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            #votes = Vote.objects.filter(room=room).delete()

class SyncUser(APIView):
    def post(self, request, format=None):
        user_id = request.data.get("user_id")
        track_id = request.data.get("track_id")
        position = request.data.get("position")
        user = get_user_by_id(user_id)
        room_code = user.room
        host_id = get_room_by_code(room_code).host
        data ={
            "uris":["spotify:track:{}".format(track_id)],
            "position_ms": position
        }
        if user_id != host_id:
            res = execute_spotify_api_request(user_id=user_id,endpoint="player/play", put_=True, data_=True, data_body=json.dumps(data))
            print(res)
        return Response({}, status=status.HTTP_200_OK)

class PauseSong(APIView):
    def get(self, response, format=None):
        user_id = response.GET.get('user_id')
        user=get_user_by_id(user_id)
        if user == None:
            return Response({'Msg':'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.room == "":
            return Response({'Msg':'User not in room'}, status=status.HTTP_404_NOT_FOUND)

        room_code = user.room
        room = get_room_by_code(room_code)
        host_id = room.host
        execute_spotify_api_request(host_id, "player/pause", put_=True)
        return Response({}, status=status.HTTP_200_OK)

class PlaySong(APIView):
    def get(self, response, format=None):
        user_id = response.GET.get('user_id')
        user=get_user_by_id(user_id)
        if user == None:
            return Response({'Msg':'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.room == "":
            return Response({'Msg':'User not in room'}, status=status.HTTP_404_NOT_FOUND)

        room_code = user.room
        room = get_room_by_code(room_code)
        host_id = room.host
        execute_spotify_api_request(host_id, "player/play", put_=True)

        return Response({}, status=status.HTTP_200_OK)