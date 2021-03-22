# earworm

> A spammy sfx chat bot

## What is this?

This project is a [twitch irc chat bot](https://dev.twitch.tv/docs/irc/guide) built using [ComfyJS](https://github.com/instafluff/ComfyJS) and [tmi.js](https://github.com/tmijs). The chat bot will listen for chat commands (messages that start with `!`) and attempt to find a matching media file.

Media files are indexed from the `media/` folder in this project. Media placed in sub-folders will be grouped into a single command prefix. If a media file cannot be found from a it will attempt to find a matching media file from a prefix.

The application will detect the format of the media file by the extension (e.g. `mp3` for audio, `webm` for `video`, etc) and play the file. Media requests are queued and will play concurrently until all commands are dequeued.

There is also a built-in `!sfx` command that will list random sound effects. They can also be filtered but adding a filter text (e.g. `!sfx <filter>`. Latest alerts can also be  viewed by using the special `latest` filter.

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

## Why was this made?

There are a few reasons I decided to roll my own vs. using a off the shelf solution such as NightBot, Phantombot, or SoundAlerts.

* The HTML web application can connect anonymously without a token or password. This means that even if the token expires I didn't need to reauthenticate and redeploy to get the bot to work. This is crucial as this is one less thing to worry about when streaming
* Adding sound commands and take multiple steps. Typically the media file needs to be added, the command added, the cooldown settings configured etc. This project only requires that you follow a filename convention to add a media file.
* The HTML web application does not require a separate process to run. Once you have hosted the application and added the OBS source the chat bot will automtically start and connect.

## How do I use this?

You will need to host the web application somewhere (e.g. locally or on S3) and add the [Browswer Source](https://obsproject.com/wiki/Sources-Guide#browsersource) to OBS.

Because of certain security restrictions the chat bot needs a secure connection to the twich irc chat.

For either solution you can optionally [generate a twitch token ](./#generating-oauth-token) so the chat bot can respond to chat.

Once hosted and added to OBS you can join your twitch channale and use the `!chime` command. You should then hear the test sound effect.

#### Using Netlify

[Netlify](https://app.netlify.com/start) is a Platform as a service (PaaS) that has a built-in Git Workflow and CDN for serving assets.

*Note: it is recommened to that create a private fork so that you can begin to add files from your repository*

<a href="https://app.netlify.com/start">
  <img src="https://www.netlify.com/img/deploy/button.svg" title="Deploy to Netlify">
</a>

#### Using GitHub Pages

You can benefit from using [GitHub Pages](https://guides.github.com/features/pages/) as a host by [forking](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) this project. 

However, once you fork this project you will need to [enable GitHub pages](https://docs.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) for the `gh-pages` branch. There is also a [GitHub actions workflow](../../actions) that will need to be enabled to build and deploy the application to the `gh-pages` branch.  

Once built you can navigate to the GitHub Pages (currently on the right-hand pane under "Environments").

Media files can be added via the [GitHub UI](https://docs.github.com/en/github/managing-files-in-a-repository/adding-a-file-to-a-repository) or the [git cli](https://docs.github.com/en/github/managing-files-in-a-repository/adding-a-file-to-a-repository-using-the-command-line)

#### Local Hosting

Local hosting will require you to build the application and [host the files on a http server](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server). You may also choose to host these files using a cloud service such as [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html) or [Netlify](https://www.netlify.com/)

1. Clone or download this repository

2. Place media files in the `media` directory

3. Build the project using [nodejs](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment)

```
npm i
npm build
```

The `dist/` folder will contain static files that can be uploaded to an http server (or S3).

4. Start local Express server

```
npm run local
```

The application will be available under `http://localhost:30000`.
You can alternatively start your http server of choice.

5. [Generate a twitch token (optional)](./#generating-oauth-token)

6. Add your browser source to point to the root of web folder

Be sure to add `twitch_channel` and `twitch_token` in the query parameters

```
https://your-server/?twich_channel=yourname&twitch_token=123abc
```

## Generating OAuth Token

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

# Misc

### [View a demo](https://alexjpaz-twitch.github.io/earworm/?twitch_channel=mychannel)

### [Very professional architecture diagram](https://user-images.githubusercontent.com/899367/110877061-c36fd400-82a6-11eb-9850-136023f97006.png)
