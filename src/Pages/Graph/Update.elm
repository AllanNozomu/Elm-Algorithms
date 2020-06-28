port module Pages.Graph.Update exposing (..)

import Array exposing (Array)
import Http
import Pages.Graph.Model exposing (Model)
import Random
import Random.List
import Time


type Msg
    = None


port beep : ( Int, Int ) -> Cmd msg


port tooltip : () -> Cmd msg


port highlight : () -> Cmd msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
       _ -> (model, Cmd.none)