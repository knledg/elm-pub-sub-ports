const pubSubPorts = require('../src/pub-sub-ports');

let mockPorts;

function portResponse(portFn, responseNumber) {
  const call = portFn.send.mock.calls[0];

  if (!call) {
    throw `call number ${responseNumber || 0} doesn't exist`;
  }

  return call[responseNumber || 0];
}

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

      expect(portResponse(mockPorts.receiveBroadcast))
        .toEqual(['searchPerformed', 'Phoenix, AZ']);
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

      expect(portResponse(mockPorts2.receiveBroadcast)).toEqual(['someEvent', {foo: "bar"}]);
      expect(portResponse(mockPorts3.receiveBroadcast)).toEqual(['someEvent', {foo: "bar"}]);
      expect(portResponse(mockPorts4.receiveBroadcast)).toEqual(['someEvent', {foo: "bar"}]);
      expect(portResponse(mockPorts5.receiveBroadcast)).toEqual(['someEvent', {foo: "bar"}]);
    });

    describe('sends the payload to `receiveBroadcast` no matter the type', () => {
      test('string', () => {
        port(mockPorts.broadcast)(['someEvent', 'a string']);

        expect(portResponse(mockPorts.receiveBroadcast))
          .toEqual(['someEvent', 'a string']);
      });

      test('number', () => {
        port(mockPorts.broadcast)(['someEvent', 3]);

        expect(portResponse(mockPorts.receiveBroadcast))
          .toEqual(['someEvent', 3]);
      });

      test('bool', () => {
        port(mockPorts.broadcast)(['someEvent', true]);

        expect(portResponse(mockPorts.receiveBroadcast))
          .toEqual(['someEvent', true]);
      });

      test('object', () => {
        port(mockPorts.broadcast)(['someEvent', {testing: 123}]);

        expect(portResponse(mockPorts.receiveBroadcast))
          .toEqual(['someEvent', {testing: 123}]);
      });

      test('array', () => {
        port(mockPorts.broadcast)(['someEvent', ["lol", 1, {a: false}]]);

        expect(portResponse(mockPorts.receiveBroadcast))
          .toEqual(['someEvent', ["lol", 1, {a: false}]]);
      });
    });
  });
});
