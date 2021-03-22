const { logger } = require('../logger');

const { resolve, sep } = require('path');
const { readdir, writeFile, stat } = require('fs').promises;

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }

}

async function getMediaFiles() {
  const prefix = resolve('./media');
  const files = await getFiles(prefix);

  let media = {};

  for await (const file of files) {
    // Remove the prefix
    const stats = await stat(file);

    let item = {
      mtime: stats.mtime,
      birthtime: stats.birthtime,
      url: file.replace(prefix + sep, '').split(sep).join('/'),
    };

    let key = item.url
      .replace(/\..*/, '')
      .replace(/\//, '');

    if(media[key]) {
      logger.warn(`Media for key=${key} already exists! Replaced by ${item.url}`);
    }

    media[key] = item;

    if(key.includes('/')) {
      let [ parentKey, child ] = key.split('/');

      media[parentKey] = {};

      let childKey = child.replace(/\..*/, '');

      media[parentKey][childKey] = item;

      if(media[parentKey][childKey]) {
        logger.warn(`Media for key=${key} already exists! Replaced by ${item.url}`);
      }

    }
  }

  return media;
}

module.exports = async (options, loaderContext) => {

  let json = {
    version: 2
  };

  try {
    const list = {};

    const media = await getMediaFiles();

    json = { ...json, media };

  } catch(e) {
    logger.error(e);
    throw e;
  }

  return {
    code: `${JSON.stringify(json, null, 2)}`
  };
};
