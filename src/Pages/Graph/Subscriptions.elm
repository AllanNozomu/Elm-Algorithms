module Pages.Graph.Subscriptions exposing (subscriptions)

import Time
import Browser.Events exposing (onAnimationFrame)
import Pages.Graph.Model exposing (Model)
import Pages.Graph.Update exposing (Msg(..))

subscriptions : Model -> Sub Msg
subscriptions model =
    if List.isEmpty model.toDrawPath then
        Sub.none
    else
        Sub.batch [
            Time.every 1 Tick
        ]
