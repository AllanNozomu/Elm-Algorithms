port module Subscriptions exposing (subscriptions)

import Model exposing (CurrentModel(..), Model)
import Pages.Graph.Subscriptions as GraphAlgorithms
import Pages.Graph.Update as GraphAlgorithmsUpdate
import Pages.Sort.Subscriptions as SortAlgorithms
import Pages.Sort.Update as SortAlgorithmsUpdate
import Update exposing (Msg(..), SubPageMsg(..))


port getCanvasWidthReceiver : (Float -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.currentModel of
        SortAlgorithmsModel subModel ->
            [ SortAlgorithms.subscriptions subModel
            , getCanvasWidthReceiver SortAlgorithmsUpdate.CanvasWidthReceiver
            ]
                |> List.map (\s -> Sub.map SortMsg s |> Sub.map SubPageMsg)
                |> Sub.batch

        GraphAlgorithmModel subModel ->
            [ GraphAlgorithms.subscriptions subModel
            , getCanvasWidthReceiver
                GraphAlgorithmsUpdate.CanvasWidthReceiver
            ]
                |> List.map (\s -> Sub.map GraphMsg s |> Sub.map SubPageMsg)
                |> Sub.batch

        HomeModel ->
            Sub.none
