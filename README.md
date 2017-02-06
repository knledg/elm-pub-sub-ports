# Elm PubSub Ports

Cross-application communication between Elm apps via the publish-subscribe model.

## Quick Start

### 1. Install via NPM

```
$ npm install --save elm-pub-sub-ports
```

### 2. In `elm-package.json`, import [`Ports/PubSub.elm`](lib/elm/Ports/PubSub.elm)

Add `node_modules/elm-pub-sub-ports/lib/elm` to your `source-directories`:

```js
// elm-package.json
{
    // ...

    "source-directories": [
        "../../node_modules/elm-pub-sub-ports/lib/elm",
        "./"
    ],

    // ...
}
```

### 3. Use it in your Elm code

```elm
-- Publish from an Elm app


update msg model =
  case msg of
    SendSomeMessage ->
      (model, Ports.PubSub.broadcast ("someEventHappened", Json.Encode.string "This is the payload")
```

```elm
-- Receive message in another Elm app


type Msg
  = ReceiveBroadcast (String, Json.Encode.Value)


subscriptions =
  PubSub.receiveBroadcast ReceiveBroadcast


update msg model =
  case msg of
    ReceiveBroadcast ("someEventHappened", payload) ->
      case Json.Decode.decodeValue Json.Decode.string payload of
        Ok payload_ -> -- payload_ == "This is the payload"
          -- Do something with payload_
```

### 4. Register your Elm app in JavaScript

```javascript
var pubSubPorts = require("elm-pub-sub-ports");
var appSendingMessages = Elm.AppSendingMessages.embed(document.getElementById("app-sending-messages-container"));
var appReceivingMessages = Elm.AppReceivingMessages.embed(document.getElementById("app-receiving-messages-container"));

pubSubPorts.register(appSendingMessages.ports);
pubSubPorts.register(appReceivingMessages.ports);
```

## API Reference

[View the full API reference here.](./API.md)

## Questions or Problems?

Feel free to create an issue in the [GitHub issue tracker](https://github.com/knledg/elm-pub-sub-ports/issues).
