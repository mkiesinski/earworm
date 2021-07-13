const ComfyJS = require('comfy.js');
import getDndCharacter from './dnd';

const baseUrl = './media';

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class timedMessages {
  constructor() {
      this.count = 0;
      this.pointer = 0;
      this.timer = 20;
      
      this.messages = [
          `Want to stay informed? I have a discord channel! Join in at https://discord.gg/gD86QqPY`,
          `Type !sfx to list available sound commands. You can also use !sfx latest for recently added sound commands.`,
          `Available commands: !sfx, !discord, !dndcharacter`
      ];
  }

  shouldSendMessage() {
      if( this.count === this.timer ) {
          this.count = 0;
          return true;
      } else {
          this.count += 1;
          return false;
      }
  }

  getNextMessage() {
      const message = this.messages[this.pointer % this.messages.length];
      this.pointer += 1;
      return message;
  }
}

export class MediaPlayer {
  constructor(mediaIndexUrl, rootElement) {
    this.mediaIndexUrl = mediaIndexUrl;
    this.rootElement = rootElement;
  }

  async testInteraction() {
    const interactionTestElement = document.querySelector('#interaction-test');

    if(!interactionTestElement) {
      return;
    }

    interactionTestElement.onclick = () => {
      interactionTestElement.style.display = 'none';
    };

    try {
      const a = new Audio();
      await a.play();
    } catch(e) {
      console.log(e);
      interactionTestElement.style.display = 'block';
    }
  }

  async init() {
    this.testInteraction();

    const mediaIndex = await fetch(this.mediaIndexUrl)
      .then(r => r.json())
      .then(j => j.media);
    ;

    this.mediaIndex = mediaIndex;

    this.isPlaying = false;
    this.playlist = [];

    const TM = new timedMessages();

    ComfyJS.onChat = async ( user, message, flags, self, extra ) => {
      if( TM.shouldSendMessage() ) {
        ComfyJS.Say(TM.getNextMessage());
      }
    }


    ComfyJS.onCommand = async ( user, command, message, flags, extra ) => {

      // Check cooldown
      if(!!extra && !!extra.sinceLastCommand && extra.sinceLastCommand.user !== 0 && extra.sinceLastCommand.user <= 1000) {
        return;
      }

      if(/sfx/.test(command)) {
        await this.listSfx(user, command, message, flags, extra);
      } 
      if(/discord/.test(message)) {
        ComfyJS.Say('Want to stay informed? I have a discord channel! Join in at https://discord.gg/gD86QqPY');
      }
      if(/nuzlocke/.test(command)) {
        ComfyJS.Say("Nuzlocke rules: 1. Any Pokemon that faints is considered dead and must be put in Storage System permanently "
        + "| 2. The player may only catch the first wild Pokemon encountered in each area and none else. No second chanes if the Pokemon flees or faints. "
        + "| 3. The player must nickname all of their Pokemon for the sake of forming stronger emotional bonds.");
      }      
      if(/dndcharacter/.test(command)) {
        ComfyJS.Say(getDndCharacter(user));
      } else {
        if(/^[0-9]+/.test(message)) {
          command = command + message;
        }

        if(/\+/.test(message)) {
          command = command + message;
        }

        if(/^r$/.test(command)) {
          command = ""; // random
        }

        if(/pocketsand/.test(command)) {
          ComfyJS.Say(`/me has moved into @${user}'s pocketsand!`);
          ComfyJS.Say(`YAOW!`);
        }
  
        if(/alexjpaz/.test(command)) {
          ComfyJS.Say('Many thanks to the friend of the stream @alexjpaz! Make sure you spin to his channel at https://twitch.tv/alexjpaz and donate some sand! GorillaSpin');
        }

        await this.commandAlert(command);
      }
    }

    const twitchChannel = new URLSearchParams(location.search).get("twitch_channel");
    const twitchToken = new URLSearchParams(location.search).get("twitch_token");

    if(twitchToken) {
      ComfyJS.Init( twitchChannel, twitchToken );
    } else {
      ComfyJS.Init( twitchChannel );
    }
  }

  async commandAlert(alert) {
    let media = this.mediaIndex[alert];


    if(!media) {
      // Try to match with if there is a number
      const pattern = new RegExp("^"+alert+"([0-9]+)");

      const matches = Object.keys(this.mediaIndex)
        .filter((key) => pattern.test(key))

      const mediaKey = matches[Math.floor(Math.random() * matches.length)];

      media = this.mediaIndex[mediaKey];
    }

    if(media) {
      this.queueAlert(`${baseUrl}/${media.url}`);
    }
  };


  getMediaHandler(key) {
    const root = this.rootElement || document.querySelector('body');

    const mediaHandler = {
      composite: async (alert, muted, timeout) => {
        let playPromise = [];

        alert
          .key
          .reverse()
          .forEach((alert, index) => {
          const handler = this.getMediaHandler(alert.type);
          playPromise.push(handler(alert, index !== 0, 5000));
        });

        return Promise.all(playPromise);
      },
      audio: async (alert, muted, timeout = null) => {
        if(muted) {
          return;
        }

        const audio = new Audio(alert.key);

        const playPromise = new Promise((res, rej) => {
          audio.onended = res;
          audio.onerror = rej;
          audio.play();

          if(timeout) {
            setTimeout(() => {
              audio.pause();
              res()
            }, timeout);
          }
        });

        await playPromise;
      },
      video: async (alert, muted, timeout = null) => {
        const video = document.createElement('video');

        const source = document.createElement('source');
        source.src = alert.key
        source.type = "video/webm";

        if(muted) {
          video.muted = true;
        }

        video.appendChild(source);

        root.appendChild(video);

        const playPromise = new Promise((res, rej) => {
          video.onended = res;
          video.onerror = rej;
          video.play();

          if(timeout) {
            setTimeout(() => {
              video.pause();
              res();
            }, timeout);
          }
        });

        try {
          await playPromise;
        } finally {
          video.remove();
        }
      },
      image: async (alert, muted, timeout = 5000) => {
        const image = document.createElement('img');
        image.src = alert.key;

        root.appendChild(image);

        const playPromise = new Promise((res) => {
          setTimeout(res, timeout);
        });

        try {
          await playPromise;
        } finally {
          root.removeChild(image);
        }
      }
    }

    return mediaHandler[key];
  }

  async nextAlert () {

    if(this.playlist.length == 0) {
      return;
    }

    const alert = this.playlist.shift();

    this.isPlaying = true;

    try {
      let playPromise = [];

      const handler = this.getMediaHandler(alert.type);

      playPromise.push(handler(alert));

      await Promise.all(playPromise);


    } catch(e) {
      console.error(e);
    }

    this.isPlaying = false;

    // TODO - do we need to wait?
    this.nextAlert();
  }

  determineAlertType(key) {
    let type = "unknown";

    if(key.endsWith(".webm")) {
      type = "video";
    } else if(key.endsWith(".mp4")) {
      type = "video";
    } else if(key.endsWith(".gif")) {
      type = "image";
    } else if(key.endsWith(".png")) {
      type = "image";
    } else {
      type = "audio";
    }

    return type;
  }

  async queueAlert(key) {
    let alert = {
      key,
    };

    if(Array.isArray(key)) {
      alert.type = "composite";
      alert.key = key.map((k) => {
        return {
          key: k,
          type: this.determineAlertType(k),
        }
      });
    } else {
      alert.type = this.determineAlertType(key);
    }

    this.playlist.push(alert);

    if(!this.isPlaying) {
      this.nextAlert();
    }
  };

  pickRandomMediaFromPrefix(alert) {
    let media;
    // Try to match with if there is a number
    const pattern = new RegExp("^"+alert+"([0-9]+)");

    const matches = Object.keys(this.mediaIndex)
      .filter((key) => pattern.test(key))

    const mediaKey = matches[Math.floor(Math.random() * matches.length)];

    media = this.mediaIndex[mediaKey];

    return media;
  }

  async commandAlert(alert) {
    let media = this.mediaIndex[alert];

    if(!media) {
      media = this.pickRandomMediaFromPrefix(alert);
    }

    if(alert.includes("+")) {
      media = alert.split("+")
        .map((m) => m.trim())
        .map((m) => m.replace(/^!/, ''))
        .map((m) => {
          let media = this.mediaIndex[m];

          if(!media) {
            media = this.pickRandomMediaFromPrefix(m);
          }

          return media;
        })
        .map((m) => `${baseUrl}/${m.url}`)
      ;

      if(media.length !== 2) {
        media = null;
      }

      this.queueAlert(media);
    } else {
      if(media) {
        this.queueAlert(`${baseUrl}/${media.url}`);
      }
    }
  };


  async listSfx(user, command, message, flags, extra) {

    let keys = Object.keys(this.mediaIndex);

    let totalKeys = keys.length;

    keys = keys
      .filter(k => k)
      .filter(k => k !== '')
    ;

    if(message === 'latest') {

      keys = keys.sort((a,b) => {
        const aa = this.mediaIndex[a].mtime;
        const bb = this.mediaIndex[b].mtime;
        return bb.localeCompare(aa);
      });
    } else {

      let groups = {};

      keys = keys
        .map((k) => {
          const matches = k.match(/([a-zA-Z]+)([0-9]+)/);

          if(!matches) {
            return k;
          }

          if(!groups[matches[1]]) {
            groups[matches[1]] = 0
          }

          groups[matches[1]] += 1;
        });

      keys = keys.filter(k => k);

      Object.keys(groups).forEach((g) => {
        keys.push(`${g}[1-${groups[g]}]`);
      });

      const filterText = message;

      if(filterText) {
        keys = keys.filter(function(k) { return k.indexOf(filterText) >= 0 });
      } else {
        keys = shuffle(keys);
      }
    }

    var selected  = [];

    for(var i=0; i < keys.length; i++) {
      if(selected.join(", ").length > 400) {
        continue;
      }

      selected.push(keys[i]);
    }

    selected = selected.map(function(i) {
      return "!"+i;
    });

    // Don't sort, it helps with the shuffle
    //selected.sort();

    var output = "/me KAPOW " + selected.join(", ");

    output += " ("+selected.length+"/"+totalKeys+")";

    ComfyJS.Say(output);
  };
}

const MediaPlayerBuilder = async (mediaIndexUrl) => {
  const player = new MediaPlayer(mediaIndexUrl);

  await player.init();

  return player;
}

export default MediaPlayerBuilder;
