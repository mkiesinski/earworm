const logger = console;

const { resolve, sep } = require('path');
const { readdir, writeFile } = require('fs').promises;

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
    let item = file.replace(prefix + sep, '').split(sep).join('/');

    let key = item
      .replace(/\..*/, '')
      .replace(/\//, '');

    media[key] = item;

    if(key.includes('/')) {
      let [ parentKey, child ] = key.split('/');

      media[parentKey] = {};

      let childKey = child.replace(/\..*/, '');

      media[parentKey][childKey] = item;

    }
  }

  return media;
}

async function main() {
  try {
    const list = {};

    const media = await getMediaFiles();

    const indexJSON = JSON.stringify(media, null, 2);

    await writeFile('./media/index.json', indexJSON);

  } catch(e) {
    logger.error(e);
    process.exit(1);
  }
}

main();
