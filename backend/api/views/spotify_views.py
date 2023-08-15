from django.shortcuts import render, redirect

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from requests import Request, post
from django.http import JsonResponse
from ..spotify_utils import *
from ..serializers import *
from ..models import *
from ..credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI

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
    print(user_id)
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
        room_code = request.GET.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({'Msg':'No room found'}, status=status.HTTP_404_NOT_FOUND)
        host_id = room.host.id
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
            'votes': votes,
            'votes_required': room.votes_to_skip,
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