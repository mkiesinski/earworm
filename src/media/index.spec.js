const indexer = require('./');

let mediaIndex;

beforeAll(async () => {
  const result = await indexer();
  mediaIndex = JSON.parse(result.code);
});

test('check version', async () => {
  expect(mediaIndex.version).toBe(2);
});

test.skip('check hank', async () => {
  expect(mediaIndex.media['hank1']).toBeDefined();
  expect(mediaIndex.media['hank2']).toBeDefined();
});
