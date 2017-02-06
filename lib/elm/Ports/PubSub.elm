port module Ports.PubSub exposing (..)


import Json.Encode


type alias Event = String
type alias Payload = Json.Encode.Value


-- Send to JS (Cmd)
port broadcast : (Event, Payload) -> Cmd msg


-- Receive from JS (Sub)
port receiveBroadcast : ((Event, Payload) -> msg) -> Sub msg
