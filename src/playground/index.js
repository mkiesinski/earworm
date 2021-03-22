const mediaIndexUrl = require('!file-loader?name=media/index.json!val-loader!../media').default;

import React, { useState, useContext } from "react";
import { render } from "react-dom";

import MediaPlayerContainer from './components/MediaPlayerContainer';

import { DefaultAppContext, AppContext } from './components/AppContext';

function getMediaType({ url }) {
  let type = "";

  if(/\.(mp4|mkv|webm)$/.test(url)) {
    type = "video";
  }

  if(/\.(ogg|opus|mp3|m4a)$/.test(url)) {
    type = "audio";
  }

  if(/\.(gif|jpeg|png)/.test(url)) {
    type = "image";
  }

  return type;
}

function MediaIcon({ url }) {
  let iconClassName = "";

  let type = getMediaType({ url })

  switch(type) {
    case "video":
      iconClassName = "fa-file-video-o";
      break;
    case "audio":
      iconClassName = "fa-file-audio-o";
      break;
    case "image":
    iconClassName = "fa-film";
      break;
  }

  return (
    <i className={`fa ${iconClassName}`}></i>
  );
}

function MediaList({ mediaIndex = {}, sort = "alpha", filter = null, type = "" }) {
  const ctx = useContext(AppContext);

  let keys = Object.keys(mediaIndex)
    .filter(k => k.url  !== '.DS_Store')
  ;

  if(sort === "date") {
    keys = keys.sort((a,b) => {
      const aa = mediaIndex[a].mtime;
      const bb = mediaIndex[b].mtime;
      return bb.localeCompare(aa);
    });
  } else {
    //
  }


  if(filter) {
    keys = keys.filter(k => {
      return (k.indexOf(filter) !== -1);
    });
  }

  if(type) {
    keys = keys.filter(k => {
      const { url } = mediaIndex[k];

      let matchesType = (getMediaType({ url }) === type);

      return matchesType;
    });
  }

  const onClick = (commandKey) => (e) => {
    e.stopPropagation();
    e.preventDefault();

    console.log(commandKey);

    ctx.setCommandKey(commandKey);
  };

  return (
    <div className="buttons">
      {keys.map((k) => (
        <a key={k} onClick={onClick(k)} className='button is-fullwidth is-link' target='_blank' href={`media/${mediaIndex[k].url}`}>
          <span className="icon is-small">
            <MediaIcon url={mediaIndex[k].url} />
          </span>
          <span>{k}</span>
        </a>
      ))}
    </div>
  );
}

function App() {
  const [mediaIndex, setMediaIndex] = useState({});

  const [options, setOptions] = useState({
    sort: "date",
    filter: null
  })

  const [commandKey, setCommandKey] = useState(null);

  React.useEffect(() => {
    (async function() {
      const mediaIndex = await fetch(mediaIndexUrl)
        .then(r => r.json())
        .then(j => j.media);
      ;

      setMediaIndex(mediaIndex);
    })();
  }, [ ]);

  const updateFilter = (e) => {
    e.stopPropagation();


    setOptions((o) => ({
      ...o,
      filter: e.target.value
    }));
  };

  const clearFilter = (e) => {
    e.stopPropagation();
    e.preventDefault();

    location.reload();

    //setOptions({
      //sort: "date",
      //filter: null
    //});
  };

  const updateSort = (e) => {
    e.stopPropagation();

    setOptions((o) => ({
      ...o,
      sort: e.target.value
    }));
  };

  const updateType = (e) => {
    e.stopPropagation();

    setOptions((o) => ({
      ...o,
      type: e.target.value
    }));
  };

  return (
    <DefaultAppContext>
    <div className='container'>
      <MediaPlayerContainer commandKey={commandKey} />
      <form>
        <div className="field">
          <label className="label">Filter</label>
          <div className="control">
            <input className="input" type="text" placeholder="Filter" onChange={updateFilter} />
          </div>
        </div>

       <div className="field">
          <label className="label">Type</label>
          <div className="control">
            <label className="radio">
              <input type="radio" name="type" value="" onClick={updateType} />
              Any
            </label>
            <label className="radio">
              <input type="radio" name="type" value="audio" onClick={updateType} />
              Audio
            </label>
            <label className="radio">
              <input type="radio" name="type" value="video" onClick={updateType} />
              Video
            </label>
            <label className="radio">
              <input type="radio" name="type" value="image" onClick={updateType} />
              Image
            </label>
          </div>
        </div>

        <div className="field">
          <label className="label">Sort By</label>
          <div className="control">
            <label className="radio">
              <input type="radio" name="answer" value="alpha" onClick={updateSort} />
              A-Z
            </label>
            <label className="radio">
              <input type="radio" name="answer" value="date" onClick={updateSort} />
              Date
            </label>
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link is-light" onClick={clearFilter}>Clear Filters</button>
          </div>
        </div>
      </form>
      <hr />
      <MediaList mediaIndex={mediaIndex} {...options} />
    </div>
  </DefaultAppContext>
  );
}

render(<App />, document.getElementById("root"));
