module Algorithms.Visualization.Subscriptions exposing (subscriptions)

import Time
import Algorithms.Visualization.Model exposing (Model)
import Algorithms.Visualization.Update exposing (Msg(..))

subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 1 Tick