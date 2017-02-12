const pubSubPorts = require('../src/pub-sub-ports');

let mockPorts;

function port(portFn) {
  return portFn.subscribe.mock.calls[0][0];
}

function newMockPorts() {
  return {
    broadcast: {subscribe: jest.fn()},
    receiveBroadcast: {send: jest.fn()}
  };
}

beforeEach(() => {
  mockPorts = newMockPorts();

  pubSubPorts.register(mockPorts);
});

describe('pub-sub-ports', () => {
  describe('broadcast', () => {
    test('sends the event and payload to `receiveBroadcast` for the Elm app which published the event', () => {
      port(mockPorts.broadcast)(['searchPerformed', 'Phoenix, AZ']);

      expect(mockPorts.receiveBroadcast.send).toHaveBeenCalledWith(['searchPerformed', 'Phoenix, AZ']);
    });

    test('sends the event and payload to `receiveBroadcast` for every other Elm app for which pub-sub-ports are registered', () => {
      const mockPorts2 = newMockPorts();
      const mockPorts3 = newMockPorts();
      const mockPorts4 = newMockPorts();
      const mockPorts5 = newMockPorts();

      pubSubPorts.register(mockPorts2);
      pubSubPorts.register(mockPorts3);
      pubSubPorts.register(mockPorts4);
      pubSubPorts.register(mockPorts5);

      port(mockPorts.broadcast)(['someEvent', {foo: "bar"}]);

      expect(mockPorts2.receiveBroadcast.send).toHaveBeenCalledWith(['someEvent', {foo: "bar"}]);
      expect(mockPorts3.receiveBroadcast.send).toHaveBeenCalledWith(['someEvent', {foo: "bar"}]);
      expect(mockPorts4.receiveBroadcast.send).toHaveBeenCalledWith(['someEvent', {foo: "bar"}]);
      expect(mockPorts5.receiveBroadcast.send).toHaveBeenCalledWith(['someEvent', {foo: "bar"}]);
    });

    describe('sends the payload to `receiveBroadcast` no matter the type', () => {
      test('string', () => {
        port(mockPorts.broadcast)(['someEvent', 'a string']);

        expect(mockPorts.receiveBroadcast.send).toHaveBeenCalledWith(['someEvent', 'a string']);
      });

      test('number', () => {
        port(mockPorts.broadcast)(['someEvent', 3]);

        expect(mockPorts.receiveBroadcast.send).toHaveBeenCalledWith(['someEvent', 3]);
      });

      test('bool', () => {
        port(mockPorts.broadcast)(['someEvent', true]);

        expect(mockPorts.receiveBroadcast.send).toHaveBeenCalledWith(['someEvent', true]);
      });

      test('object', () => {
        port(mockPorts.broadcast)(['someEvent', {testing: 123}]);

        expect(mockPorts.receiveBroadcast.send).toHaveBeenCalledWith(['someEvent', {testing: 123}]);
      });

      test('array', () => {
        port(mockPorts.broadcast)(['someEvent', ["lol", 1, {a: false}]]);

        expect(mockPorts.receiveBroadcast.send).toHaveBeenCalledWith(['someEvent', ["lol", 1, {a: false}]]);
      });
    });
  });
});
