module Pages.Sort.Subscriptions exposing (subscriptions)

import Time
import Pages.Sort.Model exposing (Model)
import Pages.Sort.Update exposing (Msg(..))

subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 1 Tick