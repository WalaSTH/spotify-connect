from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RoomSerializer, UserSerializer
from .models import Room, User

class RoomView(generics.ListAPIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

class UserTaken(APIView):
    serializer_class = UserSerializer

    def get(self, request, format=None):
        username = request.GET.get('username')
        if username != None:
            queryset = User.objects.filter(username=username)
            if queryset.exists():
                return Response({'data':True}, status=status.HTTP_200_OK)
            else:
                return Response({'data':False}, status=status.HTTP_200_OK)
        return Response({'Bad Requiest': 'Username not in request'}, status=status.HTTP_400_BAD_REQUEST)