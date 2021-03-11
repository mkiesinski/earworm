const mediaIndexUrl = require('!file-loader?name=media/index.json!val-loader!./media').default;

import MediaPlayer from './player';

MediaPlayer(mediaIndexUrl);
