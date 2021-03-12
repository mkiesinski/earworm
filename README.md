# earworm

> A spammy sfx chat bot

### [Very professional architecture diagram](https://user-images.githubusercontent.com/899367/110877061-c36fd400-82a6-11eb-9850-136023f97006.png)

## Features

This project is a twitch irc chat bot built using [ComfyJS](https://github.com/instafluff/ComfyJS) and [tmi.js](https://github.com/tmijs). The chat bot will listen for chat commands (messages that start with `!`) and attempt to find a matching media file.

Media files are indexed from the `media/` folder in this project. Media placed in sub-folders will be grouped into a single command prefix. If a media file cannot be found from a it will attempt to find a matching media file from a prefix.

The application will detect the format of the media file by the extension (e.g. `mp3` for audio, `webm` for `video`, etc) and play the file. Media requests are queued and will play concurrently until all commands are dequeued.

### Supported Formats

#### Audio 

Audio files will only play the audio from the media file.

* mp3
* wav
* ogg

#### Video

Video files typically contain audio and video components. When the alert is the video will display in the browser source provided. 

* webm
* mkv
* mp4

#### Images

Image media files contain no audio and will display for a default of 5 seconds in the browser source.

* png
* gif
* jpeg

## Hosting

Because of certain security restrictions the chat bot needs a secure connection to the twich irc chat. 

## Local Hosting

Local hosting will require you to build the application and [host the files on a http server](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)/

1. Clone or download this repository

2. Place media files in the `media` directory

3. Build the project using [nodejs](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment)

```
npm i
npm build
```

The `dist/` folder will contain static files that can be uploaded to an http server (or S3).

4. Start your local http server

4. [Generate a twitch token (optional)](./#generating-oauth-token)

5. Add your browser source to point to the root of web folder

Be sure to add `twitch_channel` and `twitch_token` in the query parameters

```
https://your-server/?twich_channel=yourname&twitch_token=123abc
```

### Generating OAuth Token

1. Navtivate to https://dev.twitch.tv/console/apps/create

2. Enter a name for the application (e.g. MyUserNameRomShuffler)

3. Enter `https://twitchapps.com/tokengen/` for the *OAuth Redirect URLs* field

4. Click *create*

5. Click *manage* next to your newly created application

6. Copy the value in the *clientID* field 

7. Navigate to https://twitchapps.com/tokengen/

8. Enter your *clientID* from step 6

9. Enter the following scopes string in to the scopes field

```
channel:manage:redemptions channel:read:redemptions user:read:email chat:edit chat:read
```
