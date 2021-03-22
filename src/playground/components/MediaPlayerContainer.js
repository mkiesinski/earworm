import React, { useEffect, useState, useContext, useRef } from "react";

import { MediaPlayer } from '../../player';
import { AppContext } from './AppContext';

const rootStyle = {
  height: "30vmax",
};

const playerStyle = {
  height: "100%",
  textAlign: "center",
};

const mediaIndexUrl = require('!file-loader?name=media/index.json!val-loader!../../media').default;

export function MediaPlayerForm() {
  const ctx = useContext(AppContext);

  const [ commandKey, setCommandKey ] = useState("");

  const onSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();

    ctx.setCommandKey(commandKey);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="field has-addons">
        <div className="control">
          <input className="input" type='text' name="commandKey" value={commandKey} onChange={(e) => setCommandKey(e.target.value)}/>
        </div>
        <div className="control">
          <button className="button is-info">
            Queue Alert
          </button>
        </div>
      </div>
    </form>
  );
}

export default function MediaPlayerContainer() {
  const ctx = useContext(AppContext);

  const rootElem = useRef(null);
  const [ player, setPlayer ] = useState(null);

  useEffect(() => {
    if(!rootElem.current) return;

    (async function() {
      const player = new MediaPlayer(mediaIndexUrl, rootElem.current);

      await player.init();

      setPlayer(player);
    })();

  }, [ rootElem ]);

  useEffect(() => {
    if(!player) return;

    player.commandAlert(ctx.commandKey);
  }, [ ctx ]);

  return (
    <div>
      <div style={rootStyle}>
        <div style={playerStyle} ref={rootElem}></div>
      </div>
      <MediaPlayerForm />
    </div>
  );
}
