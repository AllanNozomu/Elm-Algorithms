module View exposing (view)

import Algorithms.Visualization.SortView as SortView
import Browser
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes exposing (class)
import Model exposing (CurrentModel(..), Model)
import Pages.Home as Home
import Update exposing (Msg(..), SubPageMsg(..))


view : Model -> Browser.Document Msg
view model =
    let
        currentPage =
            case model.currentModel of
                SortAlgorithmsModel sortmodel ->
                    SortView.view sortmodel
                        |> Html.map AlgorithmsMsg
                        |> Html.map SubPageMsg

                HomeModel ->
                    Home.view
    in
    { title = "Elm algorithms"
    , body =
        [ div [ class "container" ]
            [ currentPage ]
        ] |> List.map Html.toUnstyled
    }
