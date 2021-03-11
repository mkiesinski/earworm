const mediaIndexUrl = require('!file-loader?name=media/index.json!val-loader!../media').default;




//const init = async () => {
  //const mediaIndex = await fetch(mediaIndexUrl)
    //.then(r => r.json())
    //.then(j => j.media);
  //;

  //const root = document.querySelector('#root');

  //let keys = Object.keys(mediaIndex)
    //.filter(k => k)
    //.filter(k => k !== '.DS_Store')
  //;

  //// TODO
  //const sort = new URLSearchParams(location.search).get("sort")

  //if(sort === "mtime") {
    //keys = keys.sort((a,b) => {
      //const aa = mediaIndex[a].mtime;
      //const bb = mediaIndex[b].mtime;
      //return bb.localeCompare(aa);
    //});
  //}

  //console.log(keys);

  //root.innerHTML = `
  //<form>
    //<div class='buttons'>
      //${keys.map(k => `<a class='button is-fullwidth' target='_blank' href="media/${mediaIndex[k].url}">${k}</a>`).join('')}
    //</div>
  //</div>
  //`;
//}

//init();

import React, { useState } from "react";
import { render } from "react-dom";

function MediaList({ mediaIndex = {}, sort = "alpha", filter = null }) {

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

  return (
    <div className="buttons">
      {keys.map((k) => (
        <a key={k} className='button is-fullwidth is-primary' target='_blank' href={`media/${mediaIndex[k].url}`}>{k}</a>
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

    console.log(e.target.value);

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

  return (
    <div className='container'>
      <form>
        <div className="field">
          <label className="label">Filter</label>
          <div className="control">
            <input className="input" type="text" placeholder="Filter" onChange={updateFilter} />
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
  );
}

render(<App />, document.getElementById("root"));
