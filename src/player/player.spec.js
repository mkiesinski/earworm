let MediaPlayer;

let messages = [];

let ComfyJSMock;

beforeEach(() =>  {
  global.fetch = jest.fn(() => Promise.reject("Mock Not Implemented"));
  fetch.mockClear();
  jest.resetModules();

  messages = [];

  ComfyJSMock = {
    Init: jest.fn(),
    Say: jest.fn((message) => {
      messages.push(message);
    })
  };
  jest.doMock('comfy.js', () => {
    return ComfyJSMock;
  });

  MediaPlayer = require('./').default;
});



describe('MediaPlayerBuilder', () => {
  let player;

  beforeEach(async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({
      json: () => Promise.resolve({
        media: {
          "foo1": {
            url: "foo"
          },
          "foo2": {
            url: "foo"
          },
          "bar": {
            url: "bar"
          }
        }
      })
    }));

    player = await MediaPlayer("http://example.com/foo.json");

  });

  // TODO - Very fragile
  describe('mediaHandler', () => {

    beforeEach(() => {
      global.Audio = jest.fn();
      Audio.prototype.play = jest.fn(function() {
        this.onended();
      });
      Audio.prototype.pause = jest.fn();
      Audio.mockClear();

      global.HTMLMediaElement = jest.fn();
      HTMLMediaElement.prototype.play = jest.fn(function() {
        this.onended();
      });
      HTMLMediaElement.prototype.pause = jest.fn();
      HTMLMediaElement.mockClear();

    });

    // Not Easy to Test
    test('audio', async () => {
      const alert = {
        type: 'audio',
        key: 'foo.ogg',
      };

      const handler = player.getMediaHandler(alert.type);

      await handler(alert);

      expect(Audio.prototype.play).toHaveBeenCalled();

    });

    test('video', async () => {
      const alert = {
        type: 'video',
        key: 'foo.webm',
      };

      const handler = player.getMediaHandler(alert.type);

      handler(alert);

      const body = document.querySelector('body');

      expect(body.innerHTML).toContain(`<video>`);
      expect(body.innerHTML).toContain(alert.key);

    });

    test('image', async () => {
      const alert = {
        type: 'image',
        key: 'foo.gif',
      };

      const handler = player.getMediaHandler(alert.type);

      handler(alert);

      const body = document.querySelector('body');

      expect(body.innerHTML).toContain(`<img`);
      expect(body.innerHTML).toContain(alert.key);

    });

    test('composite', async () => {
      const alert = {
        type: 'composite',
        key: [
          {
            type: 'image',
            key: 'foo.gif',
          },
          {
            type: 'audio',
            key: 'foo.ogg',
          },
        ]
      };

      const handler = player.getMediaHandler(alert.type);

      const p = handler(alert);

      const body = document.querySelector('body');

      expect(body.innerHTML).toContain(`<img`);
      expect(body.innerHTML).toContain(alert.key[1].key); // TODO bug, array is reversed

      await p;

      expect(Audio.prototype.play).toHaveBeenCalled();

    });
  });

  describe('onCommand', () => {
    test('sfx list', async () => {
      fetch.mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          media: {
            "foo": {
              url: "foo"
            },
            "bar": {
              url: "bar"
            }
          }
        })
      }));

      await MediaPlayer("http://example.com/foo.json");

      await ComfyJSMock.onCommand("FAKEUSER", "sfx", "");

      const calls = ComfyJSMock.Say.mock.calls;

      expect(calls[0][0]).toContain("(2/2)");
      expect(calls[0][0]).toContain("!foo");
      expect(calls[0][0]).toContain("!bar");
    });

    test('sfx list filter', async () => {
      fetch.mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          media: {
            "foo": {
              url: "foo"
            },
            "bar": {
              url: "bar"
            }
          }
        })
      }));

      await MediaPlayer("http://example.com/foo.json");

      await ComfyJSMock.onCommand("FAKEUSER", "sfx", "foo");

      const calls = ComfyJSMock.Say.mock.calls;

      expect(calls[0][0]).toContain("(1/2)");
      expect(calls[0][0]).toContain("!foo");
      expect(calls[0][0]).not.toContain("!bar");
    });

    test('sfx list filter', async () => {
      fetch.mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          media: {
            "foo": {
              url: "foo"
            },
            "bar": {
              url: "bar"
            }
          }
        })
      }));

      await MediaPlayer("http://example.com/foo.json");

      await ComfyJSMock.onCommand("FAKEUSER", "sfx", "foo");

      const calls = ComfyJSMock.Say.mock.calls;

      expect(calls[0][0]).toContain("(1/2)");
      expect(calls[0][0]).toContain("!foo");
      expect(calls[0][0]).not.toContain("!bar");
    });

    test('sfx list filter', async () => {
      fetch.mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          media: {
            "foo": {
              url: "foo"
            },
            "bar": {
              url: "bar"
            }
          }
        })
      }));

      await MediaPlayer("http://example.com/foo.json");

      await ComfyJSMock.onCommand("FAKEUSER", "sfx", "foo");

      const calls = ComfyJSMock.Say.mock.calls;

      expect(calls[0][0]).toContain("(1/2)");
      expect(calls[0][0]).toContain("!foo");
      expect(calls[0][0]).not.toContain("!bar");
    });

    test('sfx list latest', async () => {
      fetch.mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          media: {
            "foo": {
              url: "foo",
              mtime: "2020-01-01",
            },
            "bar": {
              url: "bar",
              mtime: "2020-01-02",
            }
          }
        })
      }));

      await MediaPlayer("http://example.com/foo.json");

      await ComfyJSMock.onCommand("FAKEUSER", "sfx", "latest");

      const calls = ComfyJSMock.Say.mock.calls;

      expect(calls[0][0]).toContain("!bar, !foo");
    });

    test('queue sfx', async () => {
      fetch.mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          media: {
            "foo": {
              url: "foo"
            },
          }
        })
      }));

      const player = await MediaPlayer("http://example.com/foo.json");

      player.queueAlert = jest.fn();

      await ComfyJSMock.onCommand("FAKEUSER", "foo", "");

      expect(player.queueAlert).toHaveBeenCalledWith("./media/foo");
    });

    test('queue sfx multiple', async () => {
      fetch.mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          media: {
            "foo1": {
              url: "foo"
            },
            "foo2": {
              url: "foo"
            },
            "bar": {
              url: "bar"
            }
          }
        })
      }));

      const player = await MediaPlayer("http://example.com/foo.json");

      player.queueAlert = jest.fn();

      await ComfyJSMock.onCommand("FAKEUSER", "foo", "");

      expect(player.queueAlert).toHaveBeenCalledWith("./media/foo");
    });

    test('queue sfx numberd', async () => {
      fetch.mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          media: {
            "foo1": {
              url: "foo1"
            },
            "foo2": {
              url: "foo2"
            },
            "bar": {
              url: "bar"
            }
          }
        })
      }));

      const player = await MediaPlayer("http://example.com/foo.json");

      player.queueAlert = jest.fn();

      await ComfyJSMock.onCommand("FAKEUSER", "foo", "1");

      expect(player.queueAlert).toHaveBeenCalledWith("./media/foo1");
    });

    test('queue sfx multiple', async () => {
      fetch.mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          media: {
            "foo1": {
              url: "foo"
            },
            "foo2": {
              url: "foo"
            },
            "bar": {
              url: "bar"
            }
          }
        })
      }));

      const player = await MediaPlayer("http://example.com/foo.json");

      player.queueAlert = jest.fn();

      await ComfyJSMock.onCommand("FAKEUSER", "foo1+foo2", "");

      expect(player.queueAlert).toHaveBeenCalledWith([
        "./media/foo",
        "./media/foo",
      ]);
    });

  });

  test('queue alert', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({
      json: () => Promise.resolve({
        media: {
          "foo1": {
            url: "foo"
          },
          "foo2": {
            url: "foo"
          },
          "bar": {
            url: "bar"
          }
        }
      })
    }));

    const player = await MediaPlayer("http://example.com/foo.json");

    player.playlist = [];

    player.nextAlert = jest.fn();

    player.queueAlert("foo.webm");

    expect(player.nextAlert).toHaveBeenCalled();

    expect(player.playlist).toEqual([{
      key: "foo.webm",
      type: "video"
    }]);
  });


  test('multiple', async () => {
    player.nextAlert = jest.fn();

    player.queueAlert("foo.derp");
    player.queueAlert("foo2.gif");
    player.queueAlert("bar.webm");

    expect(player.nextAlert).toHaveBeenCalled();

    expect(player.playlist).toEqual([
      {
        key: "foo.derp",
        type: "audio"
      },
      {
        key: "foo2.gif",
        type: "image"
      },
      {
        key: "bar.webm",
        type: "video"
      },
    ]);
  });

  test('multiple', async () => {
    player.nextAlert = jest.fn();

    player.queueAlert("foo.derp");
    player.queueAlert("foo2.gif");
    player.queueAlert("bar.webm");

    expect(player.nextAlert).toHaveBeenCalled();

    expect(player.playlist).toEqual([
      {
        key: "foo.derp",
        type: "audio"
      },
      {
        key: "foo2.gif",
        type: "image"
      },
      {
        key: "bar.webm",
        type: "video"
      },
    ]);
  });

  test('ogg', async () => {
    player.nextAlert = jest.fn();

    player.queueAlert("foo.ogg");

    expect(player.playlist).toEqual([
      {
        key: "foo.ogg",
        type: "audio"
      },
    ]);
  });

  test('webm', async () => {
    player.nextAlert = jest.fn();

    player.queueAlert("foo.webm");

    expect(player.playlist).toEqual([
      {
        key: "foo.webm",
        type: "video"
      },
    ]);
  });

  test('gif', async () => {
    player.nextAlert = jest.fn();

    player.queueAlert("foo.gif");

    expect(player.playlist).toEqual([
      {
        key: "foo.gif",
        type: "image"
      },
    ]);
  });

  test('png', async () => {
    player.nextAlert = jest.fn();

    player.queueAlert("foo.png");

    expect(player.playlist).toEqual([
      {
        key: "foo.png",
        type: "image"
      },
    ]);
  });

  test('mp4', async () => {
    player.nextAlert = jest.fn();

    player.queueAlert("foo.mp4");

    expect(player.playlist).toEqual([
      {
        key: "foo.mp4",
        type: "video"
      },
    ]);
  });

  describe('nextAlert', () => {
    test('single', async () => {

      const handler = jest.fn();
      player.getMediaHandler = jest.fn((t) => handler);

      player.playlist = [
        {
          test: "1",
          type: "video",
        }
      ];

      await player.nextAlert();

      expect(player.getMediaHandler).toBeCalled();
      expect(player.getMediaHandler).toBeCalledWith("video");
      expect(handler).toBeCalledWith({
        test: "1",
        type: "video"
      });

      expect(player.playlist).toEqual([]);
    });

    test('multiple', async () => {

      const handler = jest.fn();
      player.getMediaHandler = jest.fn((t) => handler);

      player.playlist = [
        {
          test: "1",
          type: "video",
        },
        {
          test: "2",
          type: "video",
        }
      ];

      await player.nextAlert();

      expect(player.getMediaHandler).toBeCalledTimes(2);
      expect(player.playlist).toEqual([]);
    });
  });
});
