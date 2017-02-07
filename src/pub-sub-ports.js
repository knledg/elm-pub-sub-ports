module.exports = {
  register: register,
  samplePortName: "broadcast",
  clearApps: clearApps,
  broadcast: broadcast
};

let portsObjects = []; // Holds ports objects; should be cleared out via `clearApps` when routing

/**
 * Register PubSub ports for the given Elm app.
 *
 * @param  {Object}   ports  Ports object from an Elm app
 * @param  {Function} log    Function to log ports for the given Elm app
 */
function register(ports, log) {
  log = log || function() {};

  portsObjects.push(ports);
  ports.broadcast.subscribe(broadcast(log));
}

/**
 * Remove all elm apps from `apps` in order to allow garbage collecting and
 * prevent memory leaks.
 *
 * (To be called when routing.)
 */
function clearApps() {
  portsObjects = [];
}

/**
 * Send a PubSub event to every Elm app registered.
 *
 * @param  {String}       event    The event being published
 * @param  {Serializable} payload  The payload associated with the event
 */
function broadcast(log) {
  return ([event, payload]) => {
    log("broadcast", event, payload);

    portsObjects.forEach(ports => {
      if (ports.receiveBroadcast) {
        ports.receiveBroadcast.send([event, payload]);
      }
    });
  };
}
