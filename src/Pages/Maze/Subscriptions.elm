module Pages.Maze.Subscriptions exposing (subscriptions)

import Time
import Browser.Events exposing (onAnimationFrame)
import Pages.Maze.Model exposing (Model)
import Pages.Maze.Update exposing (Msg(..))

subscriptions : Model -> Sub Msg
subscriptions model =
    if List.isEmpty model.toDrawPath then
        Sub.none
    else
        Sub.batch [
            Time.every 1 Tick
        ]
