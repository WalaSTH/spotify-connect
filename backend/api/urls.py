from django.urls import path, include
from .views import *


urlpatterns = [
    path('room/', RoomView.as_view()),
    path('user/', UserView.as_view()),
    path('username-taken', UserTaken.as_view()),
    path('create-user', CreateUser.as_view()),
    path('login', Login.as_view()),
]