# earworm

> A spammy sfx chat bot

## Usage

1. Clone or download this repository

2. Place media files in the `media` directory

Supported files

audio
* mp3
* wav
* ogg

video
* webm
* mkv
* mp4

images
* png
* gif
* jpeg

3. Build the project

```
npm i
npm build
```

The `dist/` folder will contain static files that can be uploaded to an http server (or S3).

4. [Generate a twitch token (optional)](./#Generating-OAuth-Token)

5. Add your browser source to point to the root of web folder

Be sure to add `twitch_channel` and `twitch_token` in the query parameters

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
