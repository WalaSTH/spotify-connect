from django.shortcuts import render

from rest_framework import generics
from .serializers import RoomSerializer
from .models import Room

class RoomView(generics.ListAPIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()