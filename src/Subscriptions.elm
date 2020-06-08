module Subscriptions exposing (subscriptions)

import Model exposing (Model, CurrentModel(..))
import Update exposing (Msg(..))
import Algorithms.Visualization.Subscriptions as Algorithms

subscriptions : Model -> Sub Msg
subscriptions model =
    case model.currentModel of
        SortAlgorithmsModel subModel -> 
            List.map (Sub.map SubPageMsg) [Algorithms.subscriptions subModel] 
            |> Sub.batch
