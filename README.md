# Spotify Connect - Listen to Music Together

Spotify Connect is an application that allows users to join virtual rooms and listen to music together in real-time, enhancing the shared music listening experience. With Spotify Connect, users can synchronize playback and comunicate through integrated chat functionality.

![](https://github.com/WalaSTH/spotify-connect/blob/main/images/room2.png)

## Usage
The project is deployed and you can try it here!\
Once on the app, create an account and log in. After that you can fully start using the app.\
When you create a room, you will need to first start playing a song on a device so the app can identify a running Spotify device.\
The same applies when joining a room.

## Usage

To get started, simply follow these steps:

1. **Visit the App:** The project is deployed, and you can try it [here](https://spotifyconnect.netlify.app/).
   
2. **Create an Account:** If you're new to Spotify Connect, create an account by signing up. If you already have an account, log in to access the full features of the app.

3. **Create or Join a Room:** Once logged in, you can create a new room or join an existing one. When creating a room, make sure to start playing a song on your device. This allows the app to identify the active Spotify device for seamless playback synchronization. The same applies when joining a room.

4. **Enjoy Shared Music Experience:** Once inside a room, you can start enjoying music with friends or other users. Add your favorite tracks to the shared playlist queue, manage the queue by rearranging or removing songs, and talk with the other users in the room through the integrated chat.

**Note:** A Spotify Premium account is required to fully utilize the app's features. While users with non-premium accounts can still use the app, certain functionalities may be limited.\
Please remember that this app is still under development, and as such, some bugs and errors may be encountered. Expect fixes and improved functionality as developement goes on.


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
The project is deployed and you can try it out without any installation needed (see Usage)
However, if you wish to run it locally here are the instructions.

First you need to set the spotify redirect uri to localhost\
go to ```backend/api/redirect.py```
and set the values as follows:
```
REDIRECT_URI = "http://127.0.0.1:8000/api/spotify-redirect"
APP_REDIRECT = 'http://localhost:3000/room'
```

### Run Backend using Docker Compose
To run the backend process locally the easiest way is to do it by using docker compose.\
Simply run:\
```docker compose -f docker-compose.yaml up --build```
### Run Backend without Docker Compose
If you don't want to use Docker Compose you can run it as follows.
For the backend, you will need:
- Python 3.10.12 or higher and pip to install all the required dependencies.
- Redis server v=6.0.16 or higher
- PostgreSQL 15.4 or higher for the database.



Init your PostgreSQL database:
Spotify Connect uses PostgreSQL, so you will have to get it running on your computer.\
After doing so, go to ```backend/backend/settings.py``` and modify the value of DATABASES to match your PostgreSQL database.

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': ‘<db_name>’,
        'USER': '<db_username>',
        'PASSWORD': '<password>',
        'HOST': '<db_hostname_or_ip>',
        'PORT': '<db_port>',
    }
}
```
Start Redis:

```/etc/init.d/redis-server start```

After the database and redis are ready, move to the _backend_ directory:

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
