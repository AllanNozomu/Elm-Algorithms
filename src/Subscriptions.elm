module Subscriptions exposing (subscriptions)

import Time
import Model exposing (Model)
import Update exposing (Msg(..))

subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 1 Tick