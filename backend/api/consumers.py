# chat/consumers.py
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import get_user_by_id

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        user = text_data_json["user"]
        avatar = text_data_json["avatar"]
        code = text_data_json["code"]

        user_db = get_user_by_id(self.user_id)
        if user_db.room != self.room_name:
            # User no longer in room
            self.disconnect()

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat_message", "message": message, "user":user, "avatar":avatar, "code":code}
        )


    # Receive message from room group
    def chat_message(self, event):
        message = event["message"]
        user = event["user"]
        avatar= event["avatar"]
        code = event["code"]

        user_db = get_user_by_id(self.user_id)
        if user_db.room != self.room_name:
            # User no longer in room
            self.disconnect()

        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message, "user":user, "avatar":avatar, "code":code}))