module Pages.Maze.Update exposing (..)

import Time
import Pages.Maze.Model exposing (Model)

type Msg
    = CanvasWidthReceiver Float
    | Tick Time.Posix
    | None

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        CanvasWidthReceiver edgeLen -> 
            ({model | edgeLen = 512 }, Cmd.none)

        Tick _ -> 
            let
                (newDrawedSteps, newToDrawPath) = 
                    case model.toDrawPath of
                    [] -> (model.drawedSteps, model.toDrawPath)
                    a :: r -> (model.drawedSteps ++ [a], r)
            in
            ({model | index = model.index + 1, drawedSteps = newDrawedSteps, toDrawPath = newToDrawPath}, Cmd.none)
        _ -> (model, Cmd.none) 