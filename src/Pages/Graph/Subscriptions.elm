module Pages.Graph.Subscriptions exposing (subscriptions)

import Time
import Pages.Graph.Model exposing (Model)
import Pages.Graph.Update exposing (Msg(..))

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
