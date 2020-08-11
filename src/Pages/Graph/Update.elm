module Pages.Graph.Update exposing (..)

import Algorithms.Graphs.MazeGenerator exposing (Edge, Position, dfs, pathToEdgesPerNode)
import Dict exposing (Dict)
import Pages.Graph.Model exposing (Model)
import Set exposing (Set)
import Time


type Msg
    = Tick Time.Posix
    | SelectTile Position
    | None


setVisited : Edge -> Dict ( ( Int, Int ), ( Int, Int ) ) Int -> Dict ( ( Int, Int ), ( Int, Int ) ) Int
setVisited edge l =
    let
        dictSetValue : ( ( Int, Int ), ( Int, Int ) ) -> Dict ( ( Int, Int ), ( Int, Int ) ) Int -> Dict ( ( Int, Int ), ( Int, Int ) ) Int
        dictSetValue key =
            Dict.update key
                (\v ->
                    case v of
                        Just vv ->
                            Just (vv + 1)

                        Nothing ->
                            Just 0
                )
    in
    dictSetValue ( ( edge.from.x, edge.from.y ), ( edge.to.x, edge.to.y ) ) l |> dictSetValue ( ( edge.to.x, edge.to.y ), ( edge.from.x, edge.from.y ) )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of

        Tick _ ->
            let
                ( newDrawedSteps, newAllSteps, newDrawed ) =
                    case model.allSteps of
                        [] ->
                            ( model.drawedSteps, model.allSteps, model.drawed )

                        a :: r ->
                            ( model.drawedSteps ++ [ a ], r, setVisited a model.drawed )
            in
            ( { model | index = model.index + 1, drawedSteps = newDrawedSteps, allSteps = newAllSteps, drawed = newDrawed }, Cmd.none )

        SelectTile position ->
            let
                ( newBeginPosition, newEndPosition ) =
                    if model.selectBegin then
                        ( position, model.endPosition )

                    else
                        ( model.beginPosition, position )

                ( beginEndPath, allSteps ) =
                    dfs newBeginPosition newEndPosition (pathToEdgesPerNode model.maze)
            in
            ( { model
                | index = 0
                , drawedSteps = []
                , allSteps = allSteps
                , drawed = Dict.empty
                , beginEndPath = beginEndPath
                , selectBegin = not model.selectBegin
                , beginPosition = newBeginPosition
                , endPosition = newEndPosition
              }
            , Cmd.none
            )

        _ ->
            ( model, Cmd.none )
