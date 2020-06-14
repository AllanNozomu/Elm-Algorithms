module Subscriptions exposing (subscriptions)

import Model exposing (Model, CurrentModel(..))
import Update exposing (Msg(..), SubPageMsg(..))
import Pages.Sort.Subscriptions as Algorithms

subscriptions : Model -> Sub Msg
subscriptions model =
    case model.currentModel of
        SortAlgorithmsModel subModel ->
            [Algorithms.subscriptions subModel]  
            |> List.map (\s -> Sub.map AlgorithmsMsg s |> Sub.map SubPageMsg) 
            |> Sub.batch
        HomeModel ->
            Sub.none
