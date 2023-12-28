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
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing user-library-read user-library-modify user-read-private'

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
            return Response({}, status=status.HTTP_202_ACCEPTED)

        item = response.get('item')
        if item is None:
            return Response({}, status=status.HTTP_202_ACCEPTED)
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
        song_db={
            'title': item.get('name'),
            'artist': artist_string,
            'image_url': album_cover,
            'id': song_id
        }
        self.update_room_song(room, song_db)
        #print("THE SONG IS:")
        #print(song)
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
            
            if "error" in res.decode():
                return Response({"Msg":res.decode()}, status=status.HTTP_400_BAD_REQUEST)
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

        # Permissions
        if user_id != host_id and not room.guest_pause:
            return Response({'Msg':'User doesnt have permission'}, status=status.HTTP_403_FORBIDDEN) 

        users = User.objects.filter(room=room_code)
        for i in range(len(users)):
            user_nid = users[i].id
            execute_spotify_api_request(user_nid, "player/pause", put_=True)
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

        # Permissions
        if user_id != host_id and not room.guest_pause:
            return Response({'Msg':'User doesnt have permission'}, status=status.HTTP_403_FORBIDDEN) 

        users = User.objects.filter(room=room_code)
        for i in range(len(users)):
            user_nid = users[i].id
            execute_spotify_api_request(user_nid, "player/play", put_=True)

        return Response({}, status=status.HTTP_200_OK)
    
class SkipSong(APIView):
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
        # Permissions
        if user_id != host_id and not room.guest_skip:
            return Response({'Msg':'User doesnt have permission'}, status=status.HTTP_403_FORBIDDEN) 

        users = User.objects.filter(room=room_code)
        
        for i in range(len(users)):
            user_nid = users[i].id
            execute_spotify_api_request(user_nid, "player/next", post_=True)

        return Response({}, status=status.HTTP_200_OK)
    
class SearchSong(APIView):

    def get(self,request, format=None):
        limit = 10
        result_list = []
        key = request.GET.get('key')
        user_id = request.GET.get('user_id')
        endpoint = "search?q=track:" + key + "&type=track&limit="+str(limit)
        list = execute_spotify_api_request(user_id, endpoint=endpoint, queue_=True)
        if not list is None:
            results = list.get("tracks").get("items")
            for i in range(len(results)):
                result = results[i]
                name = result.get("name")
                image = result.get("album").get("images")[2].get("url")
                id = result.get("id")
                artist_string = ""
                for i, artist in enumerate(result.get('artists')):
                    if i > 0:
                        artist_string += ", "
                    artist_ind = artist.get('name')
                    artist_string += artist_ind
                song = {
                    'title': name,
                    'artist': artist_string,
                    'image_url': image,
                    'id': id
                }
                result_list.append(song)
        return Response({"data":result_list}, status=status.HTTP_200_OK)

class AddToQueue(APIView):
    def post(self, request, format=None):
        user_id = request.data.get("user_id")
        song_id = request.data.get("song_id")
        artist = request.data.get("artist")
        image_url = request.data.get("image_url")
        title = request.data.get("title")
        user = get_user_by_id(user_id)
        room = get_room_by_code(user.room)
        if room == None:
            return Response({'Msg':'Room not found'}, status=status.HTTP_404_NOT_FOUND)

        room.last_id = room.last_id + 1
        room.save(update_fields=["last_id"])
        if user == None:
            return Response({'Msg':'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.room == "":
            return Response({'Msg':'User not in room'}, status=status.HTTP_404_NOT_FOUND)
        host_id = room.host
        # Permissions
        if user_id != host_id and not room.guest_add_queue:
            return Response({'Msg':'User doesnt have permission'}, status=status.HTTP_403_FORBIDDEN)
        
        username = user.username
        song = {
            'title': title,
            'artist': artist,
            'image_url': image_url,
            'id': song_id,
            'queue_id': room.last_id + 1,
            'added_by':username
        }
        queue = room.user_queue
        queue.append(song)
        room.save(update_fields=["user_queue"])

        return Response({"Msg":"Song added"}, status=status.HTTP_200_OK)


class GetQueue(APIView):
    def get(self, request, format=None):
        max_queue = 50
        user_id = request.GET.get('user_id')
        user=get_user_by_id(user_id)
        if user == None:
            return Response({'Msg':'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.room == "":
            return Response({'Msg':'User not in room'}, status=status.HTTP_404_NOT_FOUND)

        room_code = user.room
        room = get_room_by_code(room_code)

        if room == None:
            return Response({'Msg':'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        host_id = room.host


        endpoint = "player/queue"
        res = execute_spotify_api_request(host_id, endpoint=endpoint)

        queue=[]
        db_queue=[]
        #res = None

        if not res is None:
            if 'error' in res:
                return Response({'Msg':'Error with request'}, status=status.HTTP_404_NOT_FOUND)
            res_queue = res.get('queue')
            size = min(max_queue, len(res_queue))
            for i in range(size):
                index = i
                queue_elem = res_queue[i]
                name = queue_elem.get('name')
                id = queue_elem.get('id')
                image_url = queue_elem.get('album').get('images')[0].get('url')
                artist_string = ""
                for i, artist in enumerate(queue_elem.get('artists')):
                    if i > 0:
                        artist_string += ", "
                    artist_ind = artist.get('name')
                    artist_string += artist_ind
                song = {
                    'title': name,
                    'artist': artist_string,
                    'image_url': image_url,
                    'id': id,
                    'queue_id': index,
                    'added_by':""
                }
                
                db_queue.append(song)
                queue.append(song)
        if queue[0].get('id') != queue[1].get('id'):
            #Valid new queue, replace
            room.spot_queue = db_queue
            room.last_id=size
            room.save(update_fields=["spot_queue", "last_id"])
        #if queue[0].get('id') == queue[1].get('id'):
            #Not valid queue

        return Response({"spot_queue":room.spot_queue, "user_queue":room.user_queue}, status=status.HTTP_200_OK)

class SaveSong(APIView):
    def put(self, request, format=None):
        user_id = request.data.get('user_id')
        song_id = request.data.get('song_id')
        user=get_user_by_id(user_id)

        # Validate fields
        if user == None:
            return Response({'Msg':'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if user.room == "":
            return Response({'Msg':'User not in room'}, status=status.HTTP_404_NOT_FOUND)
        room_code = user.room
        room = get_room_by_code(room_code)
        if room == None:
            return Response({'Msg':'Room not found'}, status=status.HTTP_404_NOT_FOUND)

        # Execute Spotify endpoint
        endpoint = "tracks?ids="+song_id
        res = execute_spotify_api_request(user_id, endpoint=endpoint, put_=True)
        return Response({"Msg":res}, status=status.HTTP_200_OK)

class UnsaveSong(APIView):
    def put(self, request, format=None):
        user_id = request.data.get('user_id')
        song_id = request.data.get('song_id')
        user=get_user_by_id(user_id)

        # Validate fields
        if user == None:
            return Response({'Msg':'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if user.room == "":
            return Response({'Msg':'User not in room'}, status=status.HTTP_404_NOT_FOUND)
        room_code = user.room
        room = get_room_by_code(room_code)
        if room == None:
            return Response({'Msg':'Room not found'}, status=status.HTTP_404_NOT_FOUND)

        # Execute Spotify endpoint
        endpoint = "tracks?ids="+song_id
        res = execute_spotify_api_request(user_id, endpoint=endpoint, delete_=True)
        return Response({"Msg":"Song saved"}, status=status.HTTP_200_OK)
    
class CheckSaved(APIView):
    def get(self,request,format=None):
        user_id = request.GET.get('user_id')
        song_id = request.GET.get('song_id')
        user=get_user_by_id(user_id)

        # Validate fields
        if user == None:
            return Response({'Msg':'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if user.room == "":
            return Response({'Msg':'User not in room'}, status=status.HTTP_404_NOT_FOUND)
        room_code = user.room
        room = get_room_by_code(room_code)
        if room == None:
            return Response({'Msg':'Room not found'}, status=status.HTTP_404_NOT_FOUND)

        # Execute Spotify endpoint
        endpoint = "tracks/contains?ids="+song_id
        res = execute_spotify_api_request(user_id, endpoint=endpoint)
        return Response({"data":res}, status=status.HTTP_200_OK)

class GetRoomAvatar(APIView):
    def get(self, request, format=None):
        room_code = request.GET.get("room_code")
        room = get_room_by_code(room_code)
        if room == None:
            return Response({'Msg':'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        host_id = room.host
        # Execute Spotify endpoint
        endpoint = ""
        res = execute_spotify_api_request(host_id, endpoint=endpoint)
        if  res is None:
            return Response({'Bad request':'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        avatar = res.get("images")[1].get("url")
        return Response({"image":avatar}, status=status.HTTP_200_OK)

class StartNextSong(APIView):
    def get(self, request, format=None):
        user_id = request.GET.get('user_id')
        user = get_user_by_id(user_id)
        room_code = user.room
        room = get_room_by_code(room_code)
        db_queue = room.spot_queue
        user_queue = room.user_queue
        room_host = room.host
        is_host = room_host == user_id
        if user_queue:
            track = user_queue[0]['id']

        else:
            track = db_queue[0]['id']

        endpoint = "player/play"
        data ={
            "uris":["spotify:track:{}".format(track)],
            "position_ms": 0
        }
        res = execute_spotify_api_request(user_id=user_id,endpoint="player/play", put_=True, data_=True, data_body=json.dumps(data))
        return Response({"data":res}, status=status.HTTP_200_OK)

class StartSong(APIView):
    def get(self, request, format=None):
        user_id = request.GET.get('user_id')
        song_id = request.GET.get('song_id')
        user = get_user_by_id(user_id)
        room_code = user.room
        if user == None:
            return Response({'Msg':'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if user.room == "":
            return Response({'Msg':'User not in room'}, status=status.HTTP_404_NOT_FOUND)
        room = get_room_by_code(room_code)

        if room == None:
            return Response({'Msg':'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        host_id = room.host

        # Execute Spotify endpoint
        endpoint = "player/play"
        data ={
            "uris":["spotify:track:{}".format(song_id)],
            "position_ms": 0
        }

        # Play for every user
        users = User.objects.filter(room=room_code)
        for i in range(len(users)):
            user_nid = users[i].id
            execute_spotify_api_request(user_id=user_nid,endpoint="player/play", put_=True, data_=True, data_body=json.dumps(data))
        return Response({"Msg":"Song played for every user"}, status=status.HTTP_200_OK)

class GetSong(APIView):
    def get(self, request, format=None):
        user_id = request.GET.get('user_id')
        song_id = request.GET.get('song_id')
        user = get_user_by_id(user_id)
        if user == None:
            return Response({'Msg':'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Execute Spotify endpoint
        endpoint = "tracks/" + song_id
        print(song_id)
        response = execute_spotify_api_request(user_id=user_id,endpoint=endpoint, queue_=True)
        
        print(response)
        print("RESPONSEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")

        if 'Error' in response:
            return Response({}, status=status.HTTP_208_ALREADY_REPORTED)

        if response is None:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        artist_string = ""
        for i, artist in enumerate(response.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name 

        album_cover = response.get('album').get('images')[0].get('url')
        song = {
            'title': response.get('name'),
            'artist': artist_string,
            'image_url': album_cover,
            'id': song_id,
        }
        return Response({"Data":song}, status=status.HTTP_200_OK)
        #

""" 
        """