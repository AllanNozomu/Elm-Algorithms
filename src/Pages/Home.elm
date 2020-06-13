module Pages.Home exposing (view)

import Algorithms.Visualization.Model exposing (SortType(..))
import Html.Styled exposing (..)
import Update exposing (Msg(..))
import Route exposing (href, Route(..))


view : Html Msg
view =
    div []
        [ div []
            [ div []
                [ h1 []
                    [ text "Algorithms in elm" ],
                    a  [ href (Route.SortAlgorithmsPage "mergeSort")] [ text "Sort algorithms" ]
                ]
            ]
        ]