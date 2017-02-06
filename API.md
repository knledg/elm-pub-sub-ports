# API Reference

## Type Aliases for Port Signatures

```elm
type alias Event = String
type alias Payload = Json.Encode.Value
```

## Commands

### `broadcast`

> Broadcast an event to all other Elm apps that are listening

```elm
port broadcast : (Event, Payload) -> Cmd msg
```

**Example Usage:**

```elm
Ports.PubSub.broadcast ("somethingHappened", payload)
```

`"somethingHappened"` is the string that you'll match on when receiving events.
`payload` is a `Json.Encode.Value`. (See [Json.Encode](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Encode) if you're unfamiliar.)

## Subscriptions

### `receiveBroadcast`

> Receive a broadcast sent by any Elm app

```elm
port receiveBroadcast : ((Event, Payload) -> msg) -> Sub msg
```

**Example Usage:**

```elm
type Msg
  = ReceiveBroadcast (String, Json.Decode.Value)


subscriptions =
  Ports.PubSub.receiveBroadcast ReceiveBroadcast -- Add this to subscriptions


update msg model =
  case msg of
    ReceiveBroadcast ("somethingHappened", payload) -> -- Receive broadcasts with
      case Json.Decode.decodeValue someDecoder payload of
        Ok payload_ ->
          -- Do something with payload_
```
