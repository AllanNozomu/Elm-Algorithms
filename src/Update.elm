module Update exposing (update, Msg(..))

import Browser
import Browser.Navigation as Nav
import Url
import Model exposing (Model, CurrentModel(..))
import Algorithms.Visualization.Update as Algorithms
import Algorithms.Visualization.Model as Algorithms

type Msg
    = 
    LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | SubPageMsg Algorithms.Msg

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case (msg, model) of
        (UrlChanged url, _) -> 
            ({model | url = url}, Cmd.none)

        (LinkClicked urlRequest, _) ->
            case urlRequest of
                Browser.Internal url -> 
                    ( model, Nav.pushUrl model.key (Url.toString url))
                Browser.External href ->
                    (model, Nav.load href)

        (SubPageMsg subMsg, _) -> 
            case model.currentModel of
                SortAlgorithmsModel subModel ->
                    let
                        (newModel, subCmd) = Algorithms.update subMsg subModel
                    in
                        ({model | currentModel = SortAlgorithmsModel newModel}, Cmd.map SubPageMsg subCmd)