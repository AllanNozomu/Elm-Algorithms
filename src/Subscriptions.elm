module Subscriptions exposing (subscriptions)

import Model exposing (CurrentModel(..), Model)
import Pages.Graph.Subscriptions as GraphAlgorithms
import Pages.Graph.Update as GraphAlgorithmsUpdate
import Pages.Sort.Subscriptions as SortAlgorithms
import Pages.Sort.Update as SortAlgorithmsUpdate
import Pages.Maze.Subscriptions as MazeAlgorithms
import Pages.Maze.Update as MazeAlgorithmsUpdate
import Update exposing (Msg(..), SubPageMsg(..))

subscriptions : Model -> Sub Msg
subscriptions model =
    case model.currentModel of
        SortAlgorithmsModel subModel ->
            [ SortAlgorithms.subscriptions subModel
            
            ]
                |> List.map (\s -> Sub.map SortMsg s |> Sub.map SubPageMsg)
                |> Sub.batch

        GraphAlgorithmModel subModel ->
            [ GraphAlgorithms.subscriptions subModel
            ]
                |> List.map (\s -> Sub.map GraphMsg s |> Sub.map SubPageMsg)
                |> Sub.batch

        MazeAlgorithmModel subModel ->
            [ MazeAlgorithms.subscriptions subModel
            ]
                |> List.map (\s -> Sub.map MazeMsg s |> Sub.map SubPageMsg)
                |> Sub.batch

        HomeModel ->
            Sub.none
