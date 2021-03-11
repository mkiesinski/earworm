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

4. Generate a twitch token (optional)


5. Add your browser source to point to the root of web folder

Be sure to add `twitch_channel` and `twitch_token` in the query parameters
