from django.urls import path, include
from .views.api_views import *
from .views.spotify_views import *


urlpatterns = [
    path('room/', RoomView.as_view()),
    path('user/', UserView.as_view()),
    path('username-taken', UserTaken.as_view()),
    path('create-user', CreateUser.as_view()),
    path('login', Login.as_view()),
    path('get-auth-url', AuthURL.as_view()),
    path('spotify-redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('token/', TokenView.as_view()),
    path('create-room/', CreateRoomView.as_view()),
    path('room-exists', RoomExists.as_view()),
    path('join-room', RoomJoin.as_view()),
    path('get-room', UserInRoom.as_view()),
]