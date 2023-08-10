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
        print("HOLA ACA VA EL USER:")
        print(user)
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        print(self.request.session.session_key)
        print("front should be:")
        print(self.request.session.session_key)
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

    return redirect('http://localhost:3000/create-room')


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