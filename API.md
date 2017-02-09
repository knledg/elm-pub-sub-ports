# API Reference

The full API reference for Elm PubSub Ports.

## Type Aliases

```elm
type alias Event = String
type alias Payload = Json.Encode.Value
```

# Commands

## broadcast

```elm
port broadcast : (Event, Payload) -> Cmd msg
```

```elm
-- Broadcast a "somethingHappened" event to all other Elm apps that are listening
Ports.PubSub.broadcast ("somethingHappened", payload)
```

### Notes

* `"somethingHappened"` is the string that you'll match on when receiving events.
* `payload` is a `Json.Encode.Value`. (See [Json.Encode](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Encode) if you're unfamiliar.)

# Subscriptions

## receiveBroadcast

```elm
port receiveBroadcast : ((Event, Payload) -> msg) -> Sub msg
```

```elm
type Msg
  = ReceiveBroadcast (String, Json.Decode.Value)


subscriptions model =
  Ports.PubSub.receiveBroadcast ReceiveBroadcast -- Add this to subscriptions


update msg model =
  case msg of
    ReceiveBroadcast ("somethingHappened", payload) -> -- Subscribe to "somethingHappened" messages sent by any Elm app
      case Json.Decode.decodeValue someDecoder payload of
        Ok payload_ ->
          -- Do something with payload_
```
