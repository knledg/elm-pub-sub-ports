# API Reference

## Commands

### `broadcast`

> Broadcast a message to all other Elm apps that are listening

**Usage:**

```elm
Ports.PubSub.broadcast ("message", payload)
```

`message` is the string that you'll match on when receiving messages.
`payload` is a `Json.Encode.Value`. (See [Json.Encode](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Encode) if you're unfamiliar.)

## Subscriptions

### `receiveBroadcast`

> Receive a broadcast sent by any Elm app

**Usage:**

```elm
type Msg
  = ReceiveBroadcast (String, Json.Decode.Value)


subscriptions =
  Ports.PubSub.receiveBroadcast ReceiveBroadcast -- Add this to subscriptions


update msg model =
  case msg of
    ReceiveBroadcast ("message", payload) -> -- Receive broadcasts with
      case Json.Decode.decodeValue someDecoder payload of
        Ok payload_ ->
          -- Do something with payload_
```
