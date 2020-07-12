module Pages.Graph.Update exposing (..)

import Array exposing (Array)
import Pages.Graph.Model exposing (Model)

type Msg
    = CanvasWidthReceiver Float
    | None

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        CanvasWidthReceiver edgeLen -> 
            ({model | edgeLen = edgeLen}, Cmd.none)
        _ -> (model, Cmd.none)