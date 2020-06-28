module Update exposing (Msg(..), SubPageMsg(..), changeRouteTo, init, update)

import Pages.Sort.Model as SortModel
import Pages.Sort.Update as SortUpdate
import Browser
import Browser.Navigation as Nav
import Model exposing (CurrentModel(..), Model)
import Random
import Route exposing (Route(..))
import Url


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | SubPageMsg SubPageMsg

type SubPageMsg
    = SortMsg SortUpdate.Msg

init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    changeRouteTo (Route.fromUrl url) (Model.initModel url key)


changeRouteTo : Maybe Route -> Model -> ( Model, Cmd Msg )
changeRouteTo url model =
    case url of
        Just Home ->
            ( { model | currentModel = HomeModel }, Cmd.none )

        Just (SortAlgorithmsPage sortAlgorithmName) ->
            ( { model | currentModel = SortAlgorithmsModel (SortModel.initModel sortAlgorithmName) }
            , List.map (\s -> Cmd.map SortMsg s |> Cmd.map SubPageMsg) [ Random.generate SortUpdate.NewSeedStart (Random.int 1 1000000) ] |> Cmd.batch
            )

        _ ->
            ( model, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( UrlChanged url, _ ) ->
            if url == model.url then
                ( model, Cmd.none )
            else 
                changeRouteTo (Route.fromUrl url) {model | url = url}
                

        ( LinkClicked urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        ( SubPageMsg subPageMsg, _ ) ->
            case ( subPageMsg, model.currentModel ) of
                ( SortMsg algortihmMsg, SortAlgorithmsModel subModel ) ->
                    let
                        ( newModel, subCmd ) =
                            SortUpdate.update algortihmMsg subModel
                    in
                    ( { model | currentModel = SortAlgorithmsModel newModel }, Cmd.map SubPageMsg (Cmd.map SortMsg subCmd) )

                ( _, HomeModel ) ->
                    ( model, Cmd.none )