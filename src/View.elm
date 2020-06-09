module View exposing (view)

import Bootstrap.Grid as Grid
import Browser
import Html exposing (..)
import Html.Attributes exposing (src)
import Html.Events exposing (..)
import Model exposing (Model, CurrentModel(..))
import Svg.Attributes exposing (..)
import Update exposing (Msg(..), SubPageMsg(..))
import Algorithms.Visualization.SortView as SortView


view : Model -> Browser.Document Msg
view model =
    let
        currentPage = case model.currentModel of
            SortAlgorithmsModel sortmodel -> 
                 SortView.view sortmodel
                 |> Html.map AlgorithmsMsg
                 |> Html.map SubPageMsg

    in
    { title = "Sort algorithms"
    , body =
        [ Grid.container []
            [currentPage]
        ]
    }
