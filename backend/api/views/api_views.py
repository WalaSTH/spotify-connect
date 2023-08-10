from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from ..serializers import *
from ..models import *

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
            user = User(username=username, password=password, verified=False, authenticated=False, room=None)
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
            print(user_id)
            return Response({'data':user_id}, status=status.HTTP_200_OK)

        else:

            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

# Room Views

class RoomView(generics.ListAPIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

class CreateRoomView(generics.ListAPIView):
    serializer_class = RoomCreateSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            host = serializer.data.get('host')
            room_name = serializer.data.get('room_name')
            guest_pause = serializer.data.get('guest_pause')
            guest_manage_queue = serializer.data.get('guest_manage_queue')
            guest_chat = serializer.data.get('guest_chat')
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
                room.guest_chat=guest_chat
                room.guest_manage_queue=guest_manage_queue
                room.guest_skip=guest_skip
                room.private_room=private_room
                room.password=password
                room.show_lobby=show_lobby
                room.guest_add_queue=guest_add_queue

                room.save(update_fields=['room_name', 'guest_pause','guest_manage_queue',
                                        'guest_chat', 'guest_skip', 'private_room',
                                        'guest_add_queue', 'show_lobby', 'password'])
                return Response({"Msg":"Room succesfully updated"}, status=status.HTTP_200_OK)
            else:
                # Create room
                room = Room(host=host, room_name=room_name, guest_pause=guest_pause,
                            guest_chat=guest_chat, guest_skip=guest_skip,
                            guest_manage_queue=guest_manage_queue, private_room=private_room,
                            password=password, guest_add_queue=guest_add_queue, show_lobby=show_lobby)
                room.save()
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
        print("HOLAAA VA REQUEST")

        if True:
            print("HOLA2")
            user_id = request.data.get('user_id')
            room_code = request.data.get('room_code')
            password = request.data.get('password')

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
                return Response({'Bad Request': 'User already in room'}, status=status.HTTP_400_BAD_REQUEST)
        # Join user
            join_user(room_code, user_id)
            return Response({'Msg':'Room joined.'}, status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
