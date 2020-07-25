module Pages.Graph.Update exposing (..)

import Time
import Pages.Graph.Model exposing (Model)

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
                (newAllsteps, newPath) = 
                    case model.path of
                    [] -> (model.allSteps, model.path)
                    a :: r -> (model.allSteps ++ [a], r)
            in
            ({model | index = model.index + 1, allSteps = newAllsteps, path = newPath}, Cmd.none)
        _ -> (model, Cmd.none) 