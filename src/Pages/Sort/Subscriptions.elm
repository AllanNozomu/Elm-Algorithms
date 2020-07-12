port module Pages.Sort.Subscriptions exposing (subscriptions)

import Time
import Pages.Sort.Model exposing (Model)
import Pages.Sort.Update exposing (Msg(..))


port getCanvasWidthReceiver : (Float -> msg) -> Sub msg

subscriptions : Model -> Sub Msg
subscriptions model =
    if model.pause then
        Sub.batch [
            getCanvasWidthReceiver CanvasWidthReceiver
        ]
    else
        Sub.batch [
            Time.every 1 Tick,
            getCanvasWidthReceiver CanvasWidthReceiver
        ]
        