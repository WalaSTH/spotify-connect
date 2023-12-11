from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
import json
from ..serializers import *
from ..models import *
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# Pagination
from django.core.paginator import Paginator


USER_MIN_LEN = 4
USER_MAX_LEN = 16
PASSWORD_MIN_LEN = 8
PASSWORD_MAX_LEN = 60
EMAIL_MIN_LEN = 4
EMAIL_MAX_LEN = 60


# User Views

class UserTaken(APIView):
    serializer_class = UserSerializer

    def get(self, request, format=None):
        username = request.GET.get('username')
        if username != None:
            queryset = User.objects.filter(username=username)
            if queryset.exists() or username == "Wala":
                return Response({'data':True}, status=status.HTTP_200_OK)
            else:
                return Response({'data':False}, status=status.HTTP_200_OK)
        return Response({'Bad Requiest': 'Username not in request'}, status=status.HTTP_400_BAD_REQUEST)

class UserView(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class CreateUser(APIView):
    serializer_class = UserCreateSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            # Validate fields
            if (len(username) < USER_MIN_LEN or len(email)> USER_MAX_LEN):
                return Response({'Bad Request': 'Invalid username length'},status=status.HTTP_400_BAD_REQUEST)
            if (len(email) < EMAIL_MIN_LEN or len(email)> EMAIL_MAX_LEN):
                return Response({'Bad Request': 'Invalid email length'},status=status.HTTP_400_BAD_REQUEST)
            if (len(password) < PASSWORD_MIN_LEN or len(password)> PASSWORD_MAX_LEN):
                return Response({'Bad Request': 'Invalid password length'},status=status.HTTP_400_BAD_REQUEST)

            # Check unique fields
            queryset = User.objects.filter(username=username)
            if (queryset.exists()):
                return Response({'Bad Request': 'Username already exists'},status=status.HTTP_400_BAD_REQUEST)
            queryset = User.objects.filter(email=email)
            if (queryset.exists()):
                return Response({'Bad Request': 'Email already registered'},status=status.HTTP_400_BAD_REQUEST)

            # Create user
            user = User(username=username, password=password, email=email, verified=False, authenticated=False, room="")
            user.save()
            return Response({'Msg':'User created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class Login(APIView):
    serializer_class = UserLoginSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            if not user_name_exists(username):
                return Response({'Msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            # Auth user
            if not user_match_pass(username, password):
                return Response({'Msg':'Invalid credentials'}, status=status.HTTP_406_NOT_ACCEPTABLE)

            user_id = get_user_id(username)
            return Response({'data':user_id}, status=status.HTTP_200_OK)

        else:

            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
    serializer_class = UserRoomSerializer

    def get(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user_id = request.GET.get("id")
            queryset = User.objects.filter(id=user_id)
            if not queryset.exists():
                return Response({'Msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            room_code = queryset[0].room
            if room_code == "":
                return Response({'Msg': 'User not in room'}, status=status.HTTP_204_NO_CONTENT)
            room = Room.objects.filter(code=room_code)
            if not room.exists():
                return Response({'Msg': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
            room=room[0]
            data={
                'room_code':room.code,
                'room_name':room.room_name,
                'guest_pause':room.guest_pause,
                'guest_add_queue':room.guest_add_queue,
                'guest_manage_queue':room.guest_manage_queue,
                'guest_skip':room.guest_skip,
                'show_lobby':room.show_lobby,
                'private_room':room.private_room,
                'password': room.password,
            }
            return Response({'room': data}, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

# Room Views

class GetRooms(APIView):
    serializer_class = RoomSerializer
    def get(self, request, format=None):
        user_id = request.GET.get('user_id')
        page = request.GET.get('page')
        if not user_id_exists(user_id):
            return Response({'Msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        queryset = Room.objects.all()
        len = Room.objects.count()
        list = []
        # Pagination
        p = Paginator(Room.objects.all(), 5)
        rooms_paged = p.get_page(page)
        len = rooms_paged.start_index() - rooms_paged.end_index()
        len = rooms_paged.__len__()
        for i in range(len):
            room_code = rooms_paged[i].code
            user_count = User.objects.filter(room=room_code).count()
            permissions = ""
            if rooms_paged[i].guest_pause:
                permissions = permissions + "Play/Pause "
            if rooms_paged[i].guest_add_queue:
                permissions = permissions + "Add Queue "
            if rooms_paged[i].guest_manage_queue:
                permissions = permissions + "Manage Queue "
            if rooms_paged[i].guest_skip:
                permissions = permissions + "Skip "

            data={
                'id': i,
                'room_code':rooms_paged[i].code,
                'room_name':rooms_paged[i].room_name,
                'guest_pause':rooms_paged[i].guest_pause,
                'guest_add_queue':rooms_paged[i].guest_add_queue,
                'guest_manage_queue':rooms_paged[i].guest_manage_queue,
                'guest_skip':rooms_paged[i].guest_skip,
                'show_lobby':rooms_paged[i].show_lobby,
                'private_room':rooms_paged[i].private_room,
                'password': rooms_paged[i].password,
                'current_song': rooms_paged[i].current_song,
                'user_count':user_count,
                'permissions': permissions,
            }
            list.append(data)
        print(list)


        return Response({'Data': list, 'Count':p.count}, status=status.HTTP_200_OK)

class RoomView(generics.ListAPIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

class PopQueue(APIView):
    def post(self, request, format=None):
        user_id = request.data.get("user_id")
        user = get_user_by_id(user_id)
        if user is None:
            return Response({'Msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        room_code = user.room
        if room_code == "":
            return Response({'Msg': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        room = get_room_by_code(room_code)
        if room is None:
            return Response({'Msg': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        if room.host != user_id:
            return Response({'Bad Request': 'Only host can pop'}, status=status.HTTP_400_BAD_REQUEST)
        db_queue = room.spot_queue
        user_queue = room.user_queue
        if user_queue:
            user_queue.pop(0)
            room.user_queue = user_queue
            room.save(update_fields=['user_queue'])
        elif db_queue:
            db_queue.pop(0)
            room.spot_queue=db_queue
            room.save(update_fields=['spot_queue'])
        return Response({"Msg":"Queue popped!"}, status=status.HTTP_200_OK)

class RemoveSong(APIView):
    def post(self, request, format=None):
        user_id = request.data.get("user_id")
        queue_id = request.data.get("queue_id")
        user = get_user_by_id(user_id)
        if user is None:
            return Response({'Msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        room_code = user.room
        room = get_room_by_code(room_code)
        if room is None:
            return Response({'Msg': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Permissions
        host_id = room.host
        if user_id != host_id and not room.guest_skip:
            return Response({'Msg':'User doesnt have permission'}, status=status.HTTP_403_FORBIDDEN)
        
        db_queue = room.spot_queue
        user_queue = room.user_queue
        found = False
        i = 0
        while (not found and i<len(user_queue)):
            if (int(user_queue[i]["queue_id"]) == int(queue_id)):
                found = True
                del user_queue[i]
            i = i + 1

        i = 0
        while (not found and i<len(db_queue)):
            if (int(db_queue[i]["queue_id"]) == int(queue_id)):
                found = True
                del db_queue[i]
            i = i + 1
        if(not found):
            Response({"Msg":"Song not in queue"}, status=status.HTTP_204_NO_CONTENT)
        room.spot_queue = db_queue
        room.user_queue = user_queue
        room.save(update_fields=["spot_queue", "user_queue"])
        return Response({"Msg":"Song removed from queue"}, status=status.HTTP_200_OK)

class CreateRoomView(generics.ListAPIView):
    serializer_class = RoomCreateSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            host = serializer.data.get('host')
            room_name = serializer.data.get('room_name')
            guest_pause = serializer.data.get('guest_pause')
            guest_manage_queue = serializer.data.get('guest_manage_queue')
            guest_skip = serializer.data.get('guest_skip')
            private_room = serializer.data.get('private_room')
            show_lobby = serializer.data.get('show_lobby')
            password = serializer.data.get('password')
            guest_add_queue = serializer.data.get('guest_add_queue')

            # Validate entries
            if not user_id_exists(host):
                return Response({'Msg': 'Host user not found'}, status=status.HTTP_404_NOT_FOUND)

            if len(room_name) > ROOM_NAME_MAX_LEN or len(room_name) < ROOM_NAME_MIN_LEN:
                return Response({'Bad Request': 'Invalid room name length'}, status=status.HTTP_400_BAD_REQUEST)

            if password:
                if len(password) > ROOM_MAX_PASSWORD or len(password) < ROOM_MIN_PASSOWRD:
                    return Response({'Bad Request': 'Invalid password length'}, status=status.HTTP_400_BAD_REQUEST)

            if (not password) and private_room:
                return Response({'Bad Request': 'Private rooms must include a password'}, status=status.HTTP_400_BAD_REQUEST)

            if password and not private_room:
                password = ""

            if not password and not private_room:
                password = ""

            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                # Udpate room
                room = queryset[0]
                room.room_name=room_name
                room.guest_pause=guest_pause
                room.guest_manage_queue=guest_manage_queue
                room.guest_skip=guest_skip
                room.private_room=private_room
                room.password=password
                room.show_lobby=show_lobby
                room.guest_add_queue=guest_add_queue
                room.spot_queue = []
                room.user_queue = []
                room.save(update_fields=['room_name', 'guest_pause','guest_manage_queue',
                                         'guest_skip', 'private_room',
                                        'guest_add_queue', 'show_lobby', 'password', 'spot_queue', 'user_queue'])
                return Response({"Msg":"Room succesfully updated"}, status=status.HTTP_200_OK)
            else:
                # Create room if not in a room as guest
                if user_in_any_room(host):
                    return Response({'Msg': 'User already in a room'}, status=status.HTTP_400_BAD_REQUEST)
                room = Room(host=host, room_name=room_name, guest_pause=guest_pause,
                            guest_skip=guest_skip,
                            guest_manage_queue=guest_manage_queue, private_room=private_room,
                            password=password, guest_add_queue=guest_add_queue, show_lobby=show_lobby,
                            user_queue=[], spot_queue=[], last_id = 1)
                user = get_user_by_id(host)
                room.save()
                user.room=room.code
                user.save(update_fields=['room'])
                return Response({"Msg":"Room succesfully created"}, status=status.HTTP_201_CREATED)
        else:
            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class RoomExists(APIView):

    def get(self,request,format=None):
        room_code = request.GET.get('code')
        queryset = Room.objects.filter(code=room_code)
        res = None
        if queryset.exists():
            res = queryset[0].private_room
        return JsonResponse({'data':res}, status=status.HTTP_200_OK)

class RoomJoin(APIView):
    serializer_class = RoomEnterSerializer

    def post(self, request, format=None):

        user_id = request.data.get('user_id')
        room_code = request.data.get('room_code')
        password = request.data.get('room_password')
        ask_user =request.data.get('ask_user')

        # Validate fields
        if not user_id_exists(user_id):
            return Response({'Msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if not room_exists(room_code):
            return Response({'Msg': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        private_room = get_room_by_code(room_code).private_room
        if private_room:
            if not room_password_match(room_code,password):
                return Response({'Msg': 'Wrong password'}, status=status.HTTP_403_FORBIDDEN)

        # User in room?
        if user_in_room(room_code, user_id):
            return Response({'Msg': 'User already in room'}, status=status.HTTP_208_ALREADY_REPORTED)
        # User in another room?
        user = get_user_by_id(user_id)
        if user.room != "" and ask_user:
            return Response({'Msg': 'User is in another room'}, status=status.HTTP_400_BAD_REQUEST)

        # Join user
        join_user(room_code, user_id)
        return Response({'Msg':'Room joined.'}, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        user_id = request.data.get("user_id")

        # Validate fields

        if not user_id_exists(user_id):
            return Response({'Msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user = get_user_by_id(user_id)
        room_code = user.room
        if room_code == "":
            return Response({'Msg': 'User not in room_code'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        if not room_exists(room_code):
            user.room=""
            user.save(update_fields=['room'])
            return Response({'Msg': 'Invalid user room'}, status=status.HTTP_404_NOT_FOUND)

        # Delete room for user
        user.room=""
        user.save(update_fields=['room'])

        # Delete for all if user is host
        room = get_room_by_code(room_code)
        if user.id == room.host:
            queryset = User.objects.filter(room=room_code)
            for i in range(len(queryset)):
                queryset[i].room = ""
                queryset[i].save(update_fields=['room'])
            # Delete room
            Room.objects.filter(code=room_code).delete()

        return Response({'Msg':'Room leaved successfully'}, status=status.HTTP_200_OK)

class UserIsHost(APIView):
    def get(self, request, format=None):
        user_id = request.GET.get("user_id")
        if not user_id_exists(user_id):
            return Response({'Msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user = get_user_by_id(user_id)

        room_code = user.room

        if room_code == "":
            return Response({"data":False}, status=status.HTTP_200_OK)

        room = get_room_by_code(room_code)
        res = room.host == user_id
        return Response({"data":res}, status=status.HTTP_200_OK)
    
class MoveSong(APIView):
    def post(self, request, format=None):
        user_id = request.data.get("user_id")
        position = int(request.data.get("position"))
        queue_id = request.data.get("queue_id")
        use_user_str = request.data.get("use_user")
        if(use_user_str == "false"):
            use_user = False
        else:
            use_user = True
        print("WHAT IS THE VALUE OF USE USEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEER")
        print(use_user)
        # Validate fields
        if not user_id_exists(user_id):
            return Response({'Msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user = get_user_by_id(user_id)
        room_code = user.room
        if room_code == "":
            return Response({'Msg': 'User not in room_code'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        if not room_exists(room_code):
            user.room=""
            user.save(update_fields=['room'])
            return Response({'Msg': 'Invalid user room'}, status=status.HTTP_404_NOT_FOUND)
        room = get_room_by_code(room_code)

        host_id = room.host
        # Permissions
        if user_id != host_id and not room.guest_manage_queue:
            return Response({'Msg':'User doesnt have permission'}, status=status.HTTP_403_FORBIDDEN) 
        
        # Move song to position
        user_queue = room.user_queue
        spot_queue = room.spot_queue
        print("LEN OF SPOT QUEUE")
        print(len(spot_queue))
        print(type(use_user))
        if(use_user and len(user_queue)>0):
            print("SONG ON USR QUEUE")
            if position < 0:
                position = 0
            if position > len(user_queue):
                position = len(user_queue)-1
            found = False
            i = 0
            while (not found and i<len(user_queue)):
                if (int(user_queue[i]["queue_id"]) == int(queue_id)):
                    found = True
                i = i + 1
            if(not found):
                return Response({'Msg': 'Song not in list'}, status=status.HTTP_404_NOT_FOUND)
            user_queue[position], user_queue[i-1] = user_queue[i-1], user_queue[position]
            room.save(update_fields=["user_queue"])
        if(not use_user and len(spot_queue)>0):
            print("SONG ON SPOT QUEUE")
            if position < 0:
                position = 0
            if position > len(spot_queue):
                position = len(spot_queue)-1
            found = False
            i = 0
            while (not found and i<len(spot_queue)):
                if (int(spot_queue[i]["queue_id"]) == int(queue_id)):
                    found = True
                i = i + 1
            if(not found):
                return Response({'Msg': 'Song not in list'}, status=status.HTTP_404_NOT_FOUND)
            
            spot_queue[position], spot_queue[i-1] = spot_queue[i-1], spot_queue[position]
            room.save(update_fields=["spot_queue"])
        return Response({'Msg': 'Song moved!'}, status=status.HTTP_200_OK)
    

### WS LATER MOVE TO ITS OWN