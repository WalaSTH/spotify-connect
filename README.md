# Spotify Connect - Listen to Music Together

Spotify Connect is an application that allows users to join virtual rooms and listen to music together in real-time, enhancing the shared music listening experience. With Spotify Connect, users can synchronize playback and comunicate through integrated chat functionality.

![](https://github.com/WalaSTH/spotify-connect/blob/main/images/room2.png)


## Key Features:
- **Real-Time Playback Synchronization:** Enjoy synchronized playback across all connected users, ensuring everyone hears the same song at the same time.
- **Create and Join Rooms:** Users can create or join virtual rooms to listen to music with friends, family, or fellow music enthusiasts.
  When creating a room, you can set its default values and rules, i.e wheter or not guests can pause, add tracks or skip the current track. You can set a password to the room, and even decide if you want your room to be visible for everyone.

<img src="https://github.com/WalaSTH/spotify-connect/blob/main/images/create-room2.gif" height="500">

- **Room and Guest Management:** You can always change the settings of your room. You can also ban users so they can't join your room again.

- **Track Search and Queue Management:** Search for any available track in Spotify and add it to the shared playlist queue. Delete, or rearrange the queue.
<img src="https://github.com/WalaSTH/spotify-connect/blob/main/images/queue-use2.gif" height="600">

- **Interactive Chat:** Engage in conversations with other users through the built-in chat feature, sharing thoughts, recommendations, and reactions in real-time.
- **Room Search:** Explore the available rooms. Many sorting options and filters can be applied: sort by room name, or users in the room. Filter rooms by permissions and wheter you want them private or not.
<img src="https://github.com/WalaSTH/spotify-connect/blob/main/images/search-room2.gif">







## Installation
The project is deployed and you can try it here!\
But, if you wish to run it locally here are the instructions.

### Run Backend using Docker Compose
To run the backend process locally the easiest way is to do it by using docker compose
Simply run:\
```docker compose -f docker-compose.yaml up --build```
### Run Backend without Docker Compose
If you don't want to use Docker Compose you can run it as follows.
For the backend, you will need:
- Python 3.10.12 and pip to install all the required dependencies.
- Redis server v=6.0.16
- PostgreSQL 15.4 for the database.

First, move to the _backend_ directory:

```cd backend```

Install requirements:

```pip install -r requirements.txt```

And then run:

```
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```





### Run Frontend

For the frontend, you will need Node.js v19.8.1 or higher.

Move to the _frontend_ directory:

```cd frontend```

Install node modules:

```npm install```

And finally run:

```npm start```

Important: If you are running the backend locally on your machine, go to the file:\
```frontend/src/static/endpoints.js```\
And change the value of BASE_BACKEND to ```"http://127.0.0.1:8000"``` or else the front end process will be comunicating with the backend process running on the web.
