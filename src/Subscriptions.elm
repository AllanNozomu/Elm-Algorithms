module Subscriptions exposing (subscriptions)

import Model exposing (Model, CurrentModel(..))
import Update exposing (Msg(..), SubPageMsg(..))
import Pages.Sort.Subscriptions as SortAlgorithms

subscriptions : Model -> Sub Msg
subscriptions model =
    case model.currentModel of
        SortAlgorithmsModel subModel ->
            [SortAlgorithms.subscriptions subModel]  
            |> List.map (\s -> Sub.map SortMsg s |> Sub.map SubPageMsg) 
            |> Sub.batch

        GraphAlgorithmModel _ ->
            []  
            |> List.map (\s -> Sub.map SortMsg s |> Sub.map SubPageMsg) 
            |> Sub.batch


        HomeModel ->
            Sub.none
